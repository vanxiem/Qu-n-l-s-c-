
import React, { useState, useMemo } from 'react';
import { Machine, DowntimeEvent } from '../types';

interface HistoryDashboardProps {
  machines: Machine[];
  events: DowntimeEvent[];
}

const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ machines, events }) => {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [shiftFilter, setShiftFilter] = useState<'ALL' | '1' | '2' | '3'>('ALL');
  const [searchCode, setSearchCode] = useState('');

  const getShift = (timestamp: number) => {
    const hour = new Date(timestamp).getHours();
    if (hour >= 6 && hour < 14) return '1';
    if (hour >= 14 && hour < 22) return '2';
    return '3';
  };

  const filteredHistory = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime).toISOString().split('T')[0];
      const matchesDate = eventDate === dateFilter;
      const matchesShift = shiftFilter === 'ALL' || getShift(event.startTime) === shiftFilter;
      const machine = machines.find(m => m.id === event.machineId);
      const matchesSearch = !searchCode || machine?.code.toLowerCase().includes(searchCode.toLowerCase());
      
      return matchesDate && matchesShift && matchesSearch;
    }).sort((a, b) => b.startTime - a.startTime);
  }, [events, dateFilter, shiftFilter, searchCode, machines]);

  const exportToExcel = () => {
    // 1. Tạo header và nội dung bảng dưới dạng HTML
    const headers = ["Ngày", "Ca", "Mã Máy", "Lý Do Gián Đoạn", "Bắt Đầu", "Kết Thúc", "Số Phút", "Loại"];
    
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Lich_Su_Gian_Doan</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        <table border="1">
          <thead>
            <tr style="background-color: #0044cc; color: #ffffff; font-weight: bold;">
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${filteredHistory.map(e => {
              const m = machines.find(mac => mac.id === e.machineId);
              const duration = e.endTime 
                ? Math.round((e.endTime - e.startTime) / 60000) 
                : Math.round((Date.now() - e.startTime) / 60000);
              return `
                <tr>
                  <td>${new Date(e.startTime).toLocaleDateString('vi-VN')}</td>
                  <td align="center">${getShift(e.startTime)}</td>
                  <td>${m?.code || ''}</td>
                  <td>${e.reason || ''}</td>
                  <td align="center">${new Date(e.startTime).toLocaleTimeString('vi-VN')}</td>
                  <td align="center">${e.endTime ? new Date(e.endTime).toLocaleTimeString('vi-VN') : 'Đang chạy'}</td>
                  <td align="right">${duration}</td>
                  <td>${e.isPlanned ? "Kế hoạch" : "Sự cố"}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // 2. Tạo Blob và tải về
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Lich_su_gian_doan_${dateFilter}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chọn ngày</label>
          <input 
            type="date" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chọn ca làm việc</label>
          <select 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value as any)}
          >
            <option value="ALL">Tất cả ca</option>
            <option value="1">Ca 1 (06:00 - 14:00)</option>
            <option value="2">Ca 2 (14:00 - 22:00)</option>
            <option value="3">Ca 3 (22:00 - 06:00)</option>
          </select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tìm mã máy</label>
          <input 
            type="text" 
            placeholder="VD: CLF250..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
        </div>
        <button 
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-green-200 flex items-center gap-2 transition-all h-[46px]"
        >
          <span>📊</span> XUẤT EXCEL CHUẨN
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Mã Máy</th>
                <th className="px-6 py-4 text-center">Ca</th>
                <th className="px-6 py-4">Lý Do Gián Đoạn</th>
                <th className="px-6 py-4 text-center">Bắt Đầu</th>
                <th className="px-6 py-4 text-center">Kết Thúc</th>
                <th className="px-6 py-4 text-center">Số Phút</th>
                <th className="px-6 py-4">Phân Loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map(event => {
                const machine = machines.find(m => m.id === event.machineId);
                const duration = event.endTime 
                  ? Math.round((event.endTime - event.startTime) / 60000)
                  : Math.round((Date.now() - event.startTime) / 60000);
                
                return (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-800">{machine?.code}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-black text-xs text-slate-600">{getShift(event.startTime)}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">{event.reason}</td>
                    <td className="px-6 py-4 text-center text-xs font-mono text-slate-500">
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-mono text-slate-500">
                      {event.endTime 
                        ? new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : <span className="text-red-400 animate-pulse">Running</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-black ${duration > 60 ? 'text-red-600' : 'text-slate-800'}`}>
                        {duration}m
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${event.isPlanned ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {event.isPlanned ? 'Kế Hoạch' : 'Sự Cố'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Không có dữ liệu gián đoạn trong bộ lọc này</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryDashboard;
