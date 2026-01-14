"use client";
import React, { useState,useEffect } from 'react';
import Link from 'next/link';
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
import './admin.css';
import Aside from '@/components/admin/aside';
import UserManage from '@/components/admin/UserManage';
import { useAuth } from '@/context/AuthContext';

export default function PremiumAdminPanel() {
  
  const { user } = useAuth();
  // ✅ hooks first (already correct)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // For sidebar active page
  const [activePage, setActivePage] = useState("overview");

  // Adding Tasks, Users, Settings pages later
    const [formData, setFormData] = useState({
      title: "",
      company: "",
      platform: "Google Maps",
      reviewLink: "",
      price: "",
      maxUsers: "",
      assignedUsers: [],
      deadline: "",
      instructions: "",
      proof: {
        screenshot: false,
        reviewLink: false,
        usernameVisible: false,
      },
    });

    // Tasks state
    const [tasks, setTasks] = useState([]);
    const [loadingTask, setLoadingTask] = useState(true);
    // ✅ USERS API FETCH
    useEffect(() => {
      if (!user || user.role !== 'admin') return;

      const fetchUsers = async () => {
        try {
          setUsersLoading(true);

          const res = await fetch('/api/admin/users', {
            credentials: 'include',
          });

          if (!res.ok) throw new Error('Failed to fetch users');

          const data = await res.json();
          setUsers(data.data || []);

          console.log('Fetched Users:', data.data);

        } catch (err) {
          console.error(err);
        } finally {
          setUsersLoading(false);
        }
      };

      fetchUsers();
      }, [user]);

      // TASKS API FETCH - To be implemented later
    useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/admin/tasks");
        const data = await res.json();

        if (data.success) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoadingTask(false);
      }
    };

      fetchTasks();
    }, []);

    // ✅ SAFE: user is guaranteed here
    // console.log('Admin User:', user);

    // ✅ FILTER REAL API USERS (NOT MOCK)
    const filteredUsers = users.filter(u =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // Total Users Count
    const totalUsers = users.length;
    


    // Adding tasks Functions
    const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    };


    const handleCheckbox = (key) => {
      setFormData(prev => ({
        ...prev,
        proof: {
          ...prev.proof,
          [key]: !prev.proof[key],
        },
      }));
    };


    const handleMultiSelect = (e) => {
    const values = Array.from(e.target.selectedOptions).map(
        opt => opt.value
      );

      setFormData(prev => ({
        ...prev,
        assignedUsers: values,
      }));
    };


    const handleSubmit = async () => {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        window.location.reload();
      }
    };


    
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- PREMIUM SIDEBAR --- */}
      <Aside
        activePage={activePage}
        setActivePage={setActivePage}
      />
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 xl:ml-72 min-h-screen pb-24">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 px-8 flex items-center justify-between z-10">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search analytics..." className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
      {/* --- DASHBOARD CONTENT --- */}
      {activePage === "overview" && (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {/* STATS ROW (3 Columns on mobile) */}
          <div className="grid grid-cols-3 gap-3 md:gap-8 mb-12">
            {/* Total Users - Opens Search Modal */}
            <div onClick={() => setIsUserModalOpen(true)} className="cursor-pointer">
              <StatCardComponent 
                label="Total Users" 
                value={totalUsers}
                trend="+12%"
                icon={<Users size={24}/>}
                gradient="from-blue-500 to-indigo-600"
              />
            </div>

              <div onClick={() => setIsUserModalOpen(true)} className="cursor-pointer">
              <StatCardComponent 
                label="Completed" 
                value="550" 
                trend="+12%"
                icon={<CheckCircle size={24}/>}
                gradient="from-blue-500 to-indigo-600"
              />
            </div>

            <div onClick={() => setIsUserModalOpen(true)} className="cursor-pointer">
              <StatCardComponent 
                label="Pending Reviews" 
                value="2" 
                trend="-1%"
                icon={<ClipboardList size={24}/>}
                gradient="from-blue-500 to-indigo-600"
              />
            </div>

           
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Recent Assignments</h2>
              <button className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
            </div>
           <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-indigo-50 text-indigo-600 text-xs uppercase tracking-wider font-black">
                  <th className="px-8 py-5">Assigned Users</th>
                  <th className="px-8 py-5">Task Details</th>
                  <th className="px-8 py-5">Reward</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {tasks.map(task => (
                  <tr
                    key={task._id}
                    className="group hover:bg-indigo-50/30 transition"
                  >

                    {/* ASSIGNED USERS */}
                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        {task.assignedUsers.slice(0, 3).map(user => (
                          <div
                            key={user._id}
                            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold border-2 border-white"
                            title={user.name}
                          >
                            {user.name[0]}
                          </div>
                        ))}

                        {task.assignedUsers.length > 3 && (
                          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold border-2 border-white">
                            +{task.assignedUsers.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* TASK INFO */}
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900">
                        {task.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {task.company} • {task.platform}
                      </p>
                      <a
                        href={task.reviewLink}
                        target="_blank"
                        className="text-xs text-indigo-600 font-semibold hover:underline"
                      >
                        Review Link
                      </a>
                    </td>

                    {/* PRICE */}
                    <td className="px-8 py-6">
                      <span className="font-bold text-emerald-600">
                        ₹{task.price}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide
                          ${task.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : task.status === "completed"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-rose-100 text-rose-600"}
                        `}
                      >
                        {task.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEditModal(task)}
                          className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(task._id)}
                          className="px-4 py-2 rounded-xl bg-rose-100 text-rose-600 font-semibold hover:bg-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          </div>
        </div>
      )}

       {activePage === "users" && <UserManage />}
       {activePage === "tasks" && (
          <h1 className="text-3xl font-bold">Task Board</h1>
        )}

        {activePage === "settings" && (
          <h1 className="text-3xl font-bold">System Settings</h1>
        )}
      </main>

      {/* --- FLOATING ACTION BUTTON --- */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-2 flex items-center gap-3 z-30"
      >
        <div className="bg-white/20 p-1 rounded-lg">
          <Plus size={20} />
        </div>
        <span className="font-bold tracking-wide">ASSIGN TASK</span>
      </button>

      {/* --- USER SEARCH MODAL --- */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 pb-4 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800">Search Members</h3>
              <button onClick={() => { setIsUserModalOpen(false); setSearchQuery(""); }} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="px-8 mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Type name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
            </div>
            <div className="px-4 pb-8 max-h-[350px] overflow-y-auto">
              {filteredUsers.map((user,id) => (
                <Link key={id} href={`/admin/users/${user._id}`} className="flex items-center justify-between p-4 hover:bg-indigo-50 rounded-2xl group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 group-hover:text-indigo-600">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ASSIGN TASK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">

            <h3 className="text-2xl font-black mb-8 text-slate-800">
                Create New Review Assignment
            </h3>

            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* TASK TITLE */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Task Title
                </label>
                <input
                  name="title"
                  placeholder="Google Maps Review – Starbucks"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* COMPANY + PLATFORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    name="company"
                    placeholder="Starbucks"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Review Platform
                  </label>
                  <select
                    name="platform"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Google Maps</option>
                    <option>Play Store</option>
                    <option>App Store</option>
                    <option>Website</option>
                  </select>
                </div>
              </div>

              {/* REVIEW LINK */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Review Link
                </label>
                <input
                  name="reviewLink"
                  type="url"
                  placeholder="https://g.page/starbucks/review"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* PRICE + LIMIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Reward per Review ($)
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="5"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Max Users Allowed
                  </label>
                  <input
                    name="maxUsers"
                    type="number"
                    placeholder="50"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* ASSIGN USERS */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Assign Users
                </label>
                <select
                  multiple
                  onChange={handleMultiSelect}
                  className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {filteredUsers.map((u,id) => (
                    <option key={id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-2">
                  Hold Ctrl / Cmd to select multiple users
                </p>
              </div>

              {/* DEADLINE */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Submission Deadline
                </label>
                <input
                  name="deadline"
                  type="datetime-local"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* INSTRUCTIONS */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Review Instructions
                </label>
                <textarea
                  name="instructions"
                  rows={4}
                  placeholder="Minimum 50 words, include service quality..."
                  onChange={handleChange}
                  className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* PROOF REQUIRED */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Proof Required
                </label>
                <div className="flex flex-wrap gap-6">
                  {[
                    { label: "Screenshot", value: "screenshot" },
                    { label: "Review Link", value: "reviewLink" },
                    { label: "Username Visible", value: "usernameVisible" },
                  ].map((p) => (
                    <label key={p.value} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckbox(p.value)}
                        className="accent-indigo-600"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl font-bold bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition"
                >
                  Create Task
                </button>
              </div>
            </form>


            </div>
        </div>
        )}

    </div>
  );
}

/* --- UI COMPONENTS --- */

function StatCardComponent({ label, value, trend, icon, gradient }) {
  return (
    <div className="group block">
      <div className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-200 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 group-hover:-translate-y-1 relative overflow-hidden h-full">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-[0.03] -mr-8 -mt-8 rounded-full`}></div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20`}>
          {icon}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">{value}</h3>
          <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatLink({ href, label, value, trend, icon, gradient }) {
  return (
    <Link href={href}>
      <StatCardComponent label={label} value={value} trend={trend} icon={icon} gradient={gradient} />
    </Link>
  );
}

function SidebarItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-bold text-sm">{label}</span>
      </div>
      {active && <ChevronRight size={16} />}
    </div>
  );
}

function TableRow({ name, task, status }) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5 font-bold text-slate-700">{name}</td>
      <td className="px-8 py-5 text-slate-600 text-sm">{task}</td>
      <td className="px-8 py-5">
        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {status}
        </span>
      </td>
      <td className="px-8 py-5 text-right font-black text-slate-300 hover:text-indigo-600 cursor-pointer">•••</td>
    </tr>
  );
}

