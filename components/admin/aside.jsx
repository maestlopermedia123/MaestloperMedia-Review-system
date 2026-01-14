"use client";
import React, {useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  Plus,
  Bell,
  Search,
  ChevronRight,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function SidebarItem({ icon, label, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all 
      ${active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-bold text-sm">{label}</span>
      </div>
      {active && <ChevronRight size={16} />}
    </div>
  );
}


export default function Aside({ activePage, setActivePage }) {


    const { user, logout, loading } = useAuth();
    const router = useRouter();
    

    useEffect(() => {
      if (loading) return;
    
      if (!user) {
        router.replace('/login');
        return;
      }
    
      if (user.role !== 'admin') {
        router.replace('/dashboard');
      }
    }, [user, loading, router]);
    if (loading || !user || user.role !== 'admin') {
      return <p>Checking access...</p>;
      }
    
    return (

        <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 text-white hidden xl:flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutDashboard size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus<span className="text-indigo-400">Dash</span></span>
          </div>
          
          <nav className="space-y-2">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Overview"
              active={activePage === "overview"}
              onClick={() => setActivePage("overview")}
            />

            <SidebarItem
              icon={<Users size={20} />}
              label="Task Management"
              active={activePage === "users"}
              onClick={() => setActivePage("users")}
            />

            <SidebarItem
              icon={<ClipboardList size={20} />}
              label="Task Board"
              active={activePage === "tasks"}
              onClick={() => setActivePage("tasks")}
            />

            <SidebarItem
              icon={<Settings size={20} />}
              label="System Settings"
              active={activePage === "settings"}
              onClick={() => setActivePage("settings")}
            />
          </nav>

        </div>
        
        <div className="mt-auto p-8 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">JD</div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
               {user && (
                <button
                  onClick={logout}
                  className="text-sm text-red-600"
                >
                  Logout
                </button>
                )}
            </div>
          </div>
        </div>
      </aside>

    );
}


