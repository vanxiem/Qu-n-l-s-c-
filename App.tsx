
import React, { useState, useMemo, useRef } from 'react';
import { Role, Machine, MachineStatus, MachineBrand, MachineType, DowntimeEvent } from './types';
import OperatorDashboard from './components/OperatorDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import MaintenanceDashboard from './components/MaintenanceDashboard';
import TeamLeaderDashboard from './components/TeamLeaderDashboard';
import HistoryDashboard from './components/HistoryDashboard';
import Sidebar from './components/Sidebar';

const PLANNED_REASONS = ['Không có đơn hàng', 'Bảo trì', 'Cân đối sản xuất', 'Nghỉ lễ'];

const generateAllMachines = (): Machine[] => {
  const area1Data = [
    { code: 'CLF125-25', brand: MachineBrand.CLF, capacity: 125 },
    { code: 'CLF180-30', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-31', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-36', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-37', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF250-13', brand: MachineBrand.CLF, capacity: 250 },
    { code: 'CLF400-10', brand: MachineBrand.CLF, capacity: 400 },
    { code: 'FKI', brand: MachineBrand.OTHER, capacity: 100 },
    { code: 'KAIMEI-15', brand: MachineBrand.OTHER, capacity: 15, type: MachineType.BLOWING },
    { code: 'KAIMEI-09', brand: MachineBrand.OTHER, capacity: 9, type: MachineType.BLOWING },
    { code: 'KAIMEI-34', brand: MachineBrand.OTHER, capacity: 34, type: MachineType.BLOWING },
    { code: 'SMC-26', brand: MachineBrand.OTHER, capacity: 26, type: MachineType.BLOWING },
    { code: 'SMC-27', brand: MachineBrand.OTHER, capacity: 27, type: MachineType.BLOWING },
    { code: 'SMC-30', brand: MachineBrand.OTHER, capacity: 30, type: MachineType.BLOWING },
    { code: 'CLF500-18', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-19', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-22', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-24', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-25', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-26', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'JAD110-03', brand: MachineBrand.JAD, capacity: 110 },
    { code: 'JAD180-02', brand: MachineBrand.JAD, capacity: 180 },
    { code: 'JAD180-22', brand: MachineBrand.JAD, capacity: 180 },
    { code: 'JAD450-01', brand: MachineBrand.JAD, capacity: 450 },
    { code: 'JAD450-02', brand: MachineBrand.JAD, capacity: 450 },
    { code: 'JAD450-03', brand: MachineBrand.JAD, capacity: 450 },
    { code: 'JAD450-04', brand: MachineBrand.JAD, capacity: 450 },
    { code: 'JAD650-01', brand: MachineBrand.JAD, capacity: 650 },
    { code: 'JAD650-02', brand: MachineBrand.JAD, capacity: 650 },
  ];

  const area2Data = [
    { code: 'JAD180-23', brand: MachineBrand.JAD, capacity: 180 },
    { code: 'JAD180-24', brand: MachineBrand.JAD, capacity: 180 },
    { code: 'JAD180-25', brand: MachineBrand.JAD, capacity: 180 },
    { code: 'JAD180-26', brand: MachineBrand.JAD, capacity: 180 },
    { code: 'JAD180-27', brand: MachineBrand.JAD, capacity: 180 },
    { code: 'CLF180-38', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-39', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-40', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-47', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF400-01', brand: MachineBrand.CLF, capacity: 400 },
    { code: 'CLF400-11', brand: MachineBrand.CLF, capacity: 400 },
    { code: 'CLF500-15', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-23', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-27', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF500-28', brand: MachineBrand.CLF, capacity: 500 },
    { code: 'CLF750-12', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-13', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-14', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-15', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-16', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-17', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-18', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-19', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-20', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF950-03', brand: MachineBrand.CLF, capacity: 950 },
    { code: 'CLF950-04', brand: MachineBrand.CLF, capacity: 950 },
    { code: 'CLF950-05', brand: MachineBrand.CLF, capacity: 950 },
    { code: 'CLF950-06', brand: MachineBrand.CLF, capacity: 950 },
    { code: 'CLF1500-01', brand: MachineBrand.CLF, capacity: 1500 },
  ];

  const area3Data = [
    { code: 'CLF100-04', brand: MachineBrand.CLF, capacity: 100 },
    { code: 'CLF180-24', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-25', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-41', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-42', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-43', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-44', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-45', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF180-46', brand: MachineBrand.CLF, capacity: 180 },
    { code: 'CLF250-07', brand: MachineBrand.CLF, capacity: 250 },
    { code: 'CLF250-10', brand: MachineBrand.CLF, capacity: 250 },
    { code: 'CLF250-19', brand: MachineBrand.CLF, capacity: 250 },
    { code: 'CLF750-10', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF750-11', brand: MachineBrand.CLF, capacity: 750 },
    { code: 'CLF950-02', brand: MachineBrand.CLF, capacity: 950 },
    { code: 'CLF1000-01', brand: MachineBrand.CLF, capacity: 1000 },
    { code: 'CLF1420-01', brand: MachineBrand.CLF, capacity: 1420 },
    { code: 'CLF1420-02', brand: MachineBrand.CLF, capacity: 1420 },
    { code: 'CLF2k01', brand: MachineBrand.CLF, capacity: 2000 },
    { code: 'WJ2K-01', brand: MachineBrand.OTHER, capacity: 2000 },
    { code: 'CLF2k02', brand: MachineBrand.CLF, capacity: 2000 },
    { code: 'JSW2K5-01', brand: MachineBrand.OTHER, capacity: 2500 },
    { code: 'CLF3K5-01', brand: MachineBrand.CLF, capacity: 3500 },
    { code: 'CLF4K-01', brand: MachineBrand.CLF, capacity: 4000 },
    { code: 'KAIMEI-35', brand: MachineBrand.OTHER, capacity: 35, type: MachineType.BLOWING },
    { code: 'AKEI', brand: MachineBrand.OTHER, capacity: 50, type: MachineType.BLOWING },
  ];

  return [
    ...area1Data.map((m, i) => ({ ...m, id: `a1-${i}`, area: 1, type: m.type || MachineType.INJECTION, status: MachineStatus.RUNNING })),
    ...area2Data.map((m, i) => ({ ...m, id: `a2-${i}`, area: 2, type: MachineType.INJECTION, status: MachineStatus.RUNNING })),
    ...area3Data.map((m, i) => ({ ...m, id: `a3-${i}`, area: 3, type: m.type || MachineType.INJECTION, status: MachineStatus.RUNNING }))
  ];
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<Role>(Role.OPERATOR);
  const [selectedArea, setSelectedArea] = useState<1 | 2 | 3 | 'ALL'>('ALL');
  const [machines, setMachines] = useState<Machine[]>(generateAllMachines());
  const [events, setEvents] = useState<DowntimeEvent[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMachines = useMemo(() => {
    if (selectedArea === 'ALL') return machines;
    return machines.filter(m => m.area === selectedArea);
  }, [machines, selectedArea]);

  const statsBySelectedArea = useMemo(() => {
    // Luôn tính toán dựa trên `filteredMachines` để con số khớp với khu vực đang chọn
    const targetMachines = filteredMachines;
    
    const running = targetMachines.filter(m => m.status === MachineStatus.RUNNING).length;
    const stopped = targetMachines.filter(m => 
      m.status === MachineStatus.STOPPED && !PLANNED_REASONS.includes(m.currentDowntimeReason || '')
    ).length;
    
    const noOrder = targetMachines.filter(m => 
      m.status === MachineStatus.STOPPED && PLANNED_REASONS.includes(m.currentDowntimeReason || '')
    ).length;
    
    return { total: targetMachines.length, running, stopped, noOrder };
  }, [filteredMachines]);

  const handleUpdateMachineStatus = (machineId: string, status: MachineStatus, reason?: string) => {
    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, status, currentDowntimeReason: reason } : m));
    
    if (status === MachineStatus.STOPPED && reason) {
      setEvents(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        machineId,
        startTime: Date.now(),
        reason,
        category: 'Hệ thống',
        isPlanned: PLANNED_REASONS.includes(reason)
      }]);
    } else if (status === MachineStatus.RUNNING) {
      setEvents(prev => prev.map(e => (e.machineId === machineId && !e.endTime) ? { ...e, endTime: Date.now() } : e));
    }
  };

  const handleQuickNoOrder = () => {
    selectedMachineIds.forEach(id => {
      handleUpdateMachineStatus(id, MachineStatus.STOPPED, 'Không có đơn hàng');
    });
    setSelectedMachineIds([]);
    setShowQuickOrderModal(false);
  };

  const toggleMachineSelection = (id: string) => {
    setSelectedMachineIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const codesFromFile = text
        .split(/[\r\n,;\t]+/)
        .map(c => c.trim().toUpperCase())
        .filter(c => c.length > 0);
      
      const matchMachineIds = machines
        .filter(m => 
          m.status === MachineStatus.RUNNING && 
          codesFromFile.includes(m.code.toUpperCase())
        )
        .map(m => m.id);

      if (matchMachineIds.length > 0) {
        setSelectedMachineIds(prev => {
          const newSelection = new Set([...prev, ...matchMachineIds]);
          return Array.from(newSelection);
        });
        alert(`Thành công! Đã tự động nhận diện và TICK ${matchMachineIds.length} máy từ danh sách của bạn.`);
      } else {
        alert("Lưu ý: Không tìm thấy mã máy nào trong file khớp với các máy ĐANG CHẠY hiện tại.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateMachineDetails = (machineId: string, updates: Partial<Machine>) => {
    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, ...updates } : m));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar userRole={userRole} onRoleChange={setUserRole} onShowHistory={() => setShowHistory(!showHistory)} isHistoryActive={showHistory} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <header className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                SmartMolding - <span className="text-blue-600 uppercase">
                  {showHistory ? 'Lịch Sử Gián Đoạn' : (selectedArea === 'ALL' ? 'Toàn Nhà Máy' : `Khu Vực ${selectedArea}`)}
                </span>
              </h1>
              <p className="text-slate-500 text-sm font-medium">Giám sát {selectedArea === 'ALL' ? 'tổng quát' : `khu vực ${selectedArea}`}</p>
            </div>
            {!showHistory && (
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[1, 2, 3, 'ALL'].map(area => (
                  <button 
                    key={area}
                    onClick={() => setSelectedArea(area as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${selectedArea === area ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {area === 'ALL' ? 'TẤT CẢ' : `KHU ${area}`}
                  </button>
                ))}
              </div>
            )}
            
            {!showHistory && (userRole === Role.TEAM_LEADER || userRole === Role.MANAGER) && (
              <button 
                onClick={() => {
                  setSelectedMachineIds([]);
                  setShowQuickOrderModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
              >
                <span>📦</span> CẬP NHẬT NHANH ĐƠN HÀNG
              </button>
            )}
          </div>
          
          {!showHistory && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0">
              {[
                { label: 'Tổng Máy', val: statsBySelectedArea.total, color: 'slate' },
                { label: 'Đang Chạy', val: statsBySelectedArea.running, color: 'green' },
                { label: 'Sự Cố', val: statsBySelectedArea.stopped, color: 'red' },
                { label: 'Dừng KH', val: statsBySelectedArea.noOrder, color: 'blue' }
              ].map(stat => (
                <div key={stat.label} className={`bg-${stat.color}-50 px-4 py-2 rounded-xl text-center border border-${stat.color}-100 min-w-[100px]`}>
                  <p className={`text-[10px] font-bold text-${stat.color}-600 uppercase`}>{stat.label}</p>
                  <p className={`text-xl font-black text-${stat.color}-700`}>{stat.val}</p>
                </div>
              ))}
            </div>
          )}
        </header>

        {showHistory ? (
          <HistoryDashboard machines={machines} events={events} />
        ) : (
          <>
            {userRole === Role.OPERATOR && <OperatorDashboard machines={filteredMachines} onUpdateStatus={handleUpdateMachineStatus} />}
            {userRole === Role.MANAGER && <ManagerDashboard machines={filteredMachines} events={events} onUpdateMachine={handleUpdateMachineDetails} />}
            {userRole === Role.MAINTENANCE && <MaintenanceDashboard machines={filteredMachines} events={events} onUpdateStatus={handleUpdateMachineStatus} />}
            {userRole === Role.TEAM_LEADER && <TeamLeaderDashboard machines={filteredMachines} events={events} onUpdateStatus={handleUpdateMachineStatus} onUpdateMachine={handleUpdateMachineDetails} />}
          </>
        )}

        {showQuickOrderModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl scale-in-center">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Dừng máy hàng loạt</h2>
                  <p className="text-xs text-slate-500 font-medium">Lý do: <span className="text-blue-600 font-bold">KHÔNG CÓ ĐƠN HÀNG</span></p>
                </div>
                <button onClick={() => setShowQuickOrderModal(false)} className="text-slate-400 text-2xl hover:text-slate-600 transition-colors">&times;</button>
              </div>
              
              <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Tự động chọn từ file</span>
                  <input 
                    type="file" 
                    accept=".csv,.txt,.xls,.xlsx" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border border-blue-300 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>📁</span> NẠP DANH SÁCH & TỰ ĐỘNG TICK
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 italic bg-white/50 px-3 py-1.5 rounded-lg border border-slate-100">
                  * Upload file text/excel chứa danh sách mã máy để TICK tự động.
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh sách máy đang chạy</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black">{selectedMachineIds.length} máy đã tick</span>
                  </div>
                  <button 
                    onClick={() => {
                      const allRunningIds = machines.filter(m => m.status === MachineStatus.RUNNING).map(m => m.id);
                      setSelectedMachineIds(selectedMachineIds.length === allRunningIds.length ? [] : allRunningIds);
                    }}
                    className="text-blue-600 text-[10px] font-black uppercase hover:underline"
                  >
                    {selectedMachineIds.length === machines.filter(m => m.status === MachineStatus.RUNNING).length ? 'BỎ CHỌN TẤT CẢ' : 'CHỌN TẤT CẢ'}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {machines.filter(m => m.status === MachineStatus.RUNNING).map(m => (
                    <button 
                      key={m.id}
                      onClick={() => toggleMachineSelection(m.id)}
                      className={`relative p-3 border rounded-xl transition-all text-center group flex flex-col items-center justify-center min-h-[85px] ${
                        selectedMachineIds.includes(m.id) 
                        ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200 ring-2 ring-blue-200' 
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      {selectedMachineIds.includes(m.id) && (
                        <div className="absolute top-1 right-1 bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black shadow-sm">
                          ✓
                        </div>
                      )}
                      <p className={`text-xs font-black tracking-tight ${selectedMachineIds.includes(m.id) ? 'text-white' : 'text-slate-700'}`}>{m.code}</p>
                      <p className={`text-[9px] font-bold uppercase ${selectedMachineIds.includes(m.id) ? 'text-blue-100' : 'text-slate-400'}`}>{m.brand}</p>
                      <p className={`text-[8px] font-medium ${selectedMachineIds.includes(m.id) ? 'text-blue-200' : 'text-slate-300'}`}>Khu {m.area}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                    Xác nhận dừng {selectedMachineIds.length} máy
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium italic">Trạng thái sẽ chuyển sang "STOPPED - Không đơn hàng"</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowQuickOrderModal(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-100 transition-all uppercase tracking-widest">HỦY</button>
                  <button 
                    disabled={selectedMachineIds.length === 0}
                    onClick={handleQuickNoOrder}
                    className={`px-8 py-3 rounded-xl font-black text-xs transition-all shadow-lg uppercase tracking-widest ${
                      selectedMachineIds.length > 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    XÁC NHẬN DỪNG {selectedMachineIds.length > 0 ? selectedMachineIds.length : ''} MÁY
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
