
import React from 'react';
import { Role } from '../types';

interface SidebarProps {
  userRole: Role;
  onRoleChange: (role: Role) => void;
  onShowHistory: () => void;
  isHistoryActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, onRoleChange, onShowHistory, isHistoryActive }) => {
  const roles = [
    { id: Role.OPERATOR, label: 'NV Vận Hành', icon: '👷' },
    { id: Role.TEAM_LEADER, label: 'Trưởng Ca', icon: '🎖️' },
    { id: Role.MAINTENANCE, label: 'Kỹ Thuật', icon: '🔧' },
    { id: Role.MANAGER, label: 'Quản Lý', icon: '📊' },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 text-white flex flex-col transition-all">
      <div className="p-6 text-center border-b border-slate-800">
        <div className="hidden md:block text-xl font-black tracking-wider text-blue-400 italic">SMART MOLDING</div>
        <div className="md:hidden text-2xl">⚡</div>
      </div>
      
      <nav className="flex-1 py-6 px-2 space-y-2">
        <p className="hidden md:block px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Chế độ xem</p>
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => {
              onRoleChange(role.id);
              if (isHistoryActive) onShowHistory();
            }}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              !isHistoryActive && userRole === role.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{role.icon}</span>
            <span className="ml-3 hidden md:block font-medium">{role.label}</span>
          </button>
        ))}

        <div className="pt-6 mt-6 border-t border-slate-800">
          <p className="hidden md:block px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Dữ liệu</p>
          <button
            onClick={onShowHistory}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              isHistoryActive 
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">📜</span>
            <span className="ml-3 hidden md:block font-medium">Lịch sử sự cố</span>
          </button>
        </div>
      </nav>

      <div className="p-4 bg-slate-800/50 text-xs text-slate-500 hidden md:block">
        <p className="font-bold text-slate-400">SmartMolding V1.3</p>
        <p>© 2025 Manufacturing App</p>
      </div>
    </div>
  );
};

export default Sidebar;
