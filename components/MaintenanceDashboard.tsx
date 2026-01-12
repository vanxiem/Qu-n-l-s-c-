
import React, { useState } from 'react';
import { Machine, DowntimeEvent, MachineStatus } from '../types';

interface MaintenanceDashboardProps {
  machines: Machine[];
  events: DowntimeEvent[];
  onUpdateStatus: (machineId: string, status: MachineStatus, reason?: string) => void;
}

const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ machines, events, onUpdateStatus }) => {
  const [notes, setNotes] = useState<Record<string, string>>({});
  
  const activeEvents = events.filter(e => !e.endTime);
  
  const maintenancePending = machines.filter(m => {
    if (m.status !== MachineStatus.STOPPED) return false;
    const event = activeEvents.find(e => e.machineId === m.id);
    return event && !event.isPlanned;
  });

  const handleResolve = (machineId: string) => {
    onUpdateStatus(machineId, MachineStatus.RUNNING);
    setNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[machineId];
      return newNotes;
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl flex justify-between items-center">
        <div>
          <h3 className="text-blue-800 font-bold flex items-center gap-2 text-lg">
            <span>🔧</span> PHÒNG KỸ THUẬT: MÁY ĐANG DỪNG SỰ CỐ ({maintenancePending.length})
          </h3>
          <p className="text-blue-700 text-sm">Danh sách các máy gặp sự cố kỹ thuật cần xử lý ngay.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maintenancePending.map(machine => {
          const event = activeEvents.find(e => e.machineId === machine.id);
          const currentNotes = notes[machine.id] || '';

          return (
            <div key={machine.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-2xl font-black text-slate-800">{machine.code}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase">{machine.brand} | {machine.capacity}T</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                    Sự Cố Kỹ Thuật
                  </span>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lý do báo dừng</p>
                  <p className="text-[10px] font-mono font-bold text-red-400">
                    {event ? new Date(event.startTime).toLocaleTimeString() : '--:--'}
                  </p>
                </div>
                <p className="text-slate-800 font-black text-lg leading-tight">
                  {machine.currentDowntimeReason || 'Yêu cầu kiểm tra'}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nhật ký xử lý (Kỹ thuật)</p>
                   <textarea 
                    value={currentNotes}
                    onChange={(e) => setNotes({...notes, [machine.id]: e.target.value})}
                    placeholder="Nhập nội dung đã xử lý..."
                    className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white min-h-[80px]"
                   />
                </div>
              </div>

              <button 
                onClick={() => handleResolve(machine.id)}
                className="w-full bg-slate-900 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-green-200 flex items-center justify-center gap-2 group"
              >
                <span className="text-lg group-hover:scale-125 transition-transform">✅</span>
                BÁO CÁO ĐÃ SỬA XONG
              </button>
            </div>
          );
        })}

        {maintenancePending.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-slate-500 font-bold text-lg">Hệ thống vận hành ổn định.</p>
            <p className="text-slate-400 text-sm">Hiện tại không có yêu cầu hỗ trợ kỹ thuật.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
