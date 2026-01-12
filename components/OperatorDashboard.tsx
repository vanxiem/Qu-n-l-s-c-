
import React, { useState, useMemo } from 'react';
import { Machine, MachineStatus, MachineType, DOWNTIME_REASONS } from '../types';

interface OperatorDashboardProps {
  machines: Machine[];
  onUpdateStatus: (machineId: string, status: MachineStatus, reason?: string) => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ machines, onUpdateStatus }) => {
  const [filterType, setFilterType] = useState<MachineType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);

  const filteredMachines = useMemo(() => {
    return machines.filter(m => {
      const matchesType = filterType === 'ALL' || m.type === filterType;
      const matchesSearch = m.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [machines, filterType, searchQuery]);

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
    if (machine.status === MachineStatus.RUNNING) {
      setShowReasonModal(true);
    } else {
      onUpdateStatus(machine.id, MachineStatus.RUNNING);
    }
  };

  const selectReason = (reason: string) => {
    if (selectedMachine) {
      onUpdateStatus(selectedMachine.id, MachineStatus.STOPPED, reason);
      setShowReasonModal(false);
      setSelectedMachine(null);
    }
  };

  const PLANNED_REASONS = ['Không có đơn hàng', 'Bảo trì', 'Cân đối sản xuất', 'Nghỉ lễ'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${filterType === 'ALL' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            Tất cả ({machines.length})
          </button>
          <button onClick={() => setFilterType(MachineType.INJECTION)} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${filterType === MachineType.INJECTION ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Máy Ép</button>
          <button onClick={() => setFilterType(MachineType.BLOWING)} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${filterType === MachineType.BLOWING ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Máy Thổi</button>
        </div>
        <div className="flex-1 w-full relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">🔍</span>
          <input 
            type="text" 
            placeholder="NV vận hành tìm mã máy (vd: CLF2k, JAD450...)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
        {filteredMachines.map((machine) => {
          const isPlanned = PLANNED_REASONS.includes(machine.currentDowntimeReason || '');
          return (
            <button
              key={machine.id}
              onClick={() => handleMachineClick(machine)}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 shadow-sm min-h-[140px] ${
                machine.status === MachineStatus.RUNNING 
                ? 'bg-white border-slate-100 hover:border-green-400' 
                : isPlanned 
                  ? 'bg-blue-50 border-blue-200 hover:border-blue-500 shadow-blue-100'
                  : 'bg-red-50 border-red-200 hover:border-red-500 shadow-red-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                 <div className={`w-3 h-3 rounded-full ${machine.status === MachineStatus.RUNNING ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : isPlanned ? 'bg-blue-500' : 'bg-red-500 animate-pulse'}`}></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{machine.type === MachineType.INJECTION ? 'Máy Ép' : 'Máy Thổi'}</span>
              </div>
              <h3 className={`text-lg font-black leading-tight tracking-tight text-center ${machine.status === MachineStatus.RUNNING ? 'text-slate-800' : isPlanned ? 'text-blue-700' : 'text-red-700'}`}>{machine.code}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{machine.brand} {machine.capacity}T</p>
              {machine.status === MachineStatus.STOPPED && (
                <div className={`mt-3 w-full truncate text-[10px] font-black py-1.5 px-2 rounded-lg text-center uppercase tracking-tight shadow-inner ${isPlanned ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {machine.currentDowntimeReason || 'ĐANG DỪNG'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showReasonModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl scale-in-center">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Báo cáo dừng máy: {selectedMachine?.code}</h2>
                <p className="text-slate-500 text-sm font-medium">NV Vận hành chọn lý do chính xác theo danh sách chuẩn</p>
              </div>
              <button onClick={() => setShowReasonModal(false)} className="text-slate-400 text-3xl hover:text-slate-600 font-light">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/20">
              {DOWNTIME_REASONS.map((group) => (
                <div key={group.category} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 border-b border-slate-50 pb-2 text-slate-400">{group.category}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {group.reasons.map(reason => (
                      <button
                        key={reason}
                        onClick={() => selectReason(reason)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all font-black text-xs active:scale-95 ${PLANNED_REASONS.includes(reason) ? 'border-blue-200 bg-blue-50/50 hover:border-blue-500 text-blue-700' : 'border-slate-100 hover:border-red-400 hover:bg-red-50 text-slate-700'}`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50">
               <button onClick={() => setShowReasonModal(false)} className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase text-xs hover:bg-slate-100">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorDashboard;
