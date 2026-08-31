import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { UserRole, UserRoleId } from '../types';
import { ENTERPRISE_ROLES } from '../data/roles';

interface HeaderProps {
  activeTab: 'chat' | 'vault' | 'pipeline' | 'audit' | 'settings';
  setActiveTab: (tab: 'chat' | 'vault' | 'pipeline' | 'audit' | 'settings') => void;
  currentRole: UserRole;
  onSelectRole: (roleId: UserRoleId) => void;
  docsCount: number;
  chunksCount: number;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  onSelectRole,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRoleDropdownOpen(false);
      }
    };

    if (roleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [roleDropdownOpen]);

  const navItems = [
    { id: 'chat' as const, label: 'Assistant' },
    { id: 'vault' as const, label: 'Documents' },
    { id: 'pipeline' as const, label: 'Pipeline' },
    { id: 'audit' as const, label: 'Audit' },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[rgb(96,60,96)] border-b border-black/40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand: Cogniva */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-bold shadow-md ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Cogniva
          </span>
        </div>

        {/* Clean, Simple Inline Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-md'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Profile Card with Floating Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setRoleDropdownOpen(prev => !prev)}
            aria-expanded={roleDropdownOpen}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-left text-xs transition-all shadow-md group cursor-pointer"
          >
            <img
              src={currentRole.avatar}
              alt={currentRole.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/70 shrink-0 bg-black/40"
            />
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                <span>{currentRole.name}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black text-white leading-none">
                  {currentRole.department}
                </span>
              </div>
              <div className="text-[10px] text-white/90 font-medium truncate max-w-[140px]">
                {currentRole.title}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-white/90 group-hover:text-white transition-transform duration-200 ml-0.5 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Floating Dropdown Over Page Content */}
          {roleDropdownOpen && (
            <div
              className="absolute right-0 mt-2.5 w-80 bg-[rgb(80,48,80)] border border-white/30 rounded-2xl shadow-2xl p-2.5 z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/40"
            >
              <div className="px-3 py-2 border-b border-white/20 mb-2 flex items-center justify-between">
                <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-white" />
                  Security Clearance Switcher
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black text-white font-mono font-bold">
                  {currentRole.allowedClassifications.length} Tiers
                </span>
              </div>

              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {Object.values(ENTERPRISE_ROLES).map(role => {
                  const isSelected = role.id === currentRole.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        onSelectRole(role.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white shadow-lg ring-1 ring-white/40 font-semibold'
                          : 'hover:bg-white/15 text-white'
                      }`}
                    >
                      <img
                        src={role.avatar}
                        alt={role.name}
                        className={`w-8 h-8 rounded-full object-cover shrink-0 ring-2 ${
                          isSelected ? 'ring-white' : 'ring-white/40'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold truncate text-white">
                            {role.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                            isSelected ? 'bg-white text-black' : 'bg-black text-white'
                          }`}>
                            {role.department}
                          </span>
                        </div>
                        <div className="text-[10px] font-medium truncate text-white/90">
                          {role.title}
                        </div>
                        <div className="text-[9px] text-white/70 font-mono mt-0.5">
                          Clearance: {role.allowedClassifications.join(', ')}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


