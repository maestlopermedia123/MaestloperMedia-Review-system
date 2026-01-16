'use client';
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Modal from '@/components/modal/Modal';
import { useTasks } from '@/context/TaskContext';

export default function ReviewDashboard() {
  const { user, refreshUser, loading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  let userId = user ? user._id : null;
  // console.log('Tasks in Dashboard:', tasks);

  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  // Modal Start
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Form State
  const [form, setForm] = useState({
    username: "",
    reviewLink: "",
    screenshot: null,
  });

  // Task Submitted Data Handler 
  const [tasksSubmitted, setTasksSubmitted] = useState([]);
  const [loadings, setLoading] = useState(true);

  // Check if user has already submitted for this task
  const checkIfAlreadySubmitted = (taskId) => {
    return tasksSubmitted.some(submission => submission.task === taskId);
  };

  // Check if reviewLink already exists
  const checkIfReviewLinkExists = (reviewLink) => {
    return tasksSubmitted.some(submission => 
      submission.proof?.reviewLink === reviewLink || 
      submission.reviewLink === reviewLink
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTaskId) {
      alert("Missing task");
      return;
    }
    if (!userId) {
      alert("User not logged in");
      return;
    }

    // Check if user already submitted for this task
    if (checkIfAlreadySubmitted(selectedTaskId)) {
      alert("You have already submitted for this task. You cannot submit again.");
      return;
    }

    // Check if reviewLink already exists
    if (form.reviewLink && checkIfReviewLinkExists(form.reviewLink)) {
      alert("This review link has already been submitted. Please use a different link.");
      return;
    }

    const formData = new FormData();

    formData.append("task", selectedTaskId);
    formData.append("user", userId);
    formData.append("reviewLink", form.reviewLink);
    if (form.screenshot) {
      formData.append("screenshot", form.screenshot);
    }

    try {
      const res = await fetch("/api/tasksubmission", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Submission failed");
        return;
      }

      // console.log("Submission Success:", result);
      
      // Add the new submission to tasksSubmitted
      const newSubmission = {
        task: selectedTaskId,
        status: "pending",
        proof: {
          reviewLink: form.reviewLink,
          screenshotUrl: result.data?.proof?.screenshotUrl
        },
        ...result.data
      };
      
      setTasksSubmitted(prev => [...prev, newSubmission]);
      
      alert("Task submitted successfully!");
      
      setForm({
        reviewLink: "",
        screenshot: null,
      });
      setIsModalOpen(false);

      // Refresh the submissions data
      fetchTaskSubmissions();

    } catch (error) {
      console.error("Submit error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = (taskId) => {
    // Check if already submitted before opening modal
    if (checkIfAlreadySubmitted(taskId)) {
      alert("You have already submitted for this task. You cannot submit again.");
      return;
    }
    
    setModalMode('add');
    setSelectedTaskId(taskId);
    setSelectedReview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setSelectedReview(item);
    setIsModalOpen(true);
  };
  // Modal End

  // Fetch task submissions for this user
  const fetchTaskSubmissions = async () => {
    try {
      const res = await fetch("/api/tasksubmission");
      const result = await res.json();
      
      // Filter submissions for this specific user
      const userSubmissions = result.data?.filter(
        submission => submission.user === userId
      ) || [];
      
      // console.log("User's task submissions:", userSubmissions);
      
      setTasksSubmitted(userSubmissions);
      
    } catch (error) {
      console.error("Error fetching task submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTaskSubmissions();
    }
  }, [userId]);

  useEffect(() => {
    const filtered = tasks.filter(item => {
      const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.reviewLink?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'All' || item.status === status;
      return matchSearch && matchStatus;
    });

    setFilteredTasks(filtered);
  }, [search, status, tasks]);

  // Calculate stats
  const totalTasks = tasks.length;
  const pendingReview = useMemo(() => {
    return tasksSubmitted.filter(submission => submission.status === "pending").length;
  }, [tasksSubmitted]);
  
  const approvedTasks = useMemo(() => {
    return tasksSubmitted.filter(submission => submission.status === "approved").length;
  }, [tasksSubmitted]);
  
  const rejectedTasks = useMemo(() => {
    return tasksSubmitted.filter(submission => submission.status === "rejected").length;
  }, [tasksSubmitted]);
  
  const submittedTasks = tasksSubmitted.length;
  const availableTasks = filteredTasks.filter(task => !checkIfAlreadySubmitted(task._id)).length;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-amber-100">
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-light text-slate-900 mb-2">Review <span className="font-bold">Console</span></h1>
            <p className="text-slate-500 text-sm tracking-wide">India's Local Work & Earning Network</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search repository..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:ring-1 focus:ring-slate-900 outline-none transition-all shadow-sm"
              />
              <svg className="w-4 h-4 absolute left-4 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            {/* <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium focus:ring-1 focus:ring-slate-900 outline-none shadow-sm cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="In Review">In Review</option>
              <option value="Pending">Pending</option>
            </select> */}
          </div>

        </div>

        {/* STATS TILES */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8 mb-8 md:mb-16">
          <Stat label="Total Tasks" value={totalTasks} />
          <Stat label="Available Tasks" value={availableTasks} color="text-blue-600" />
          <Stat label="Submitted Tasks" value={submittedTasks} color="text-emerald-600" />
        </div>

        {/* Submission Status Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-amber-700">{pendingReview}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-black text-emerald-700">{approvedTasks}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-black text-rose-700">{rejectedTasks}</p>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Submission Queue</h2>
            {/* <button className="text-[11px] font-bold text-slate-900 uppercase tracking-widest hover:text-amber-600 transition-colors">Export CSV</button> */}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-8 py-4">Project Details</th>
                  <th className="px-8 py-4">Company Type</th>
                  <th className="px-8 py-4">Submission Status</th>
                  <th className="px-8 py-4">Deadline</th>
                  <th className="px-8 py-4">Reward</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTasks.map(item => {
                  const isSubmitted = checkIfAlreadySubmitted(item._id);
                  const submission = tasksSubmitted.find(sub => sub.task === item._id);
                  
                  return (
                    <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-800 mb-1 group-hover:text-amber-700 transition-colors">{item.title}</p>
                        <a href={item.reviewLink} target='_blank' rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-slate-900 truncate block max-w-xs">{item.reviewLink}</a>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {item.company}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {isSubmitted ? (
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
                            submission?.status === 'approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                            submission?.status === 'rejected' ? 'border-rose-200 bg-rose-50 text-rose-700' :
                            'border-amber-200 bg-amber-50 text-amber-700'
                          }`}>
                            {submission?.status?.toUpperCase() || 'SUBMITTED'}
                          </span>
                        ) : (
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${statusStyles[item.status]}`}>
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-400 italic">
                        {item.deadline}
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-400 italic">
                        {item.price}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {isSubmitted ? (
                          <button
                            disabled
                            className="px-6 py-2.5 bg-slate-300 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest cursor-not-allowed flex items-center gap-2"
                          >
                            <span className="text-lg leading-none">✓</span> Submitted
                          </button>
                        ) : (
                          <button
                            onClick={() => openAddModal(item._id)}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2"
                          >
                            <span className="text-lg leading-none">+</span> Submit Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTasks.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 italic font-light text-lg">No records match your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* THE MODAL USAGE */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="space-y-5" onSubmit={handleSubmit}>
          

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Review URL
            </label>
            <input
              name="reviewLink"
              value={form.reviewLink}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm"
              placeholder="https://..."
              required
            />
            {form.reviewLink && checkIfReviewLinkExists(form.reviewLink) && (
              <p className="text-xs text-rose-600 mt-1">
                ⚠️ This review link has already been submitted
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Proof Screenshot
            </label>
            <label className="flex items-center justify-center w-full px-4 py-4 bg-slate-50 border border-dashed rounded-2xl text-xs cursor-pointer">
              <span>
                {form.screenshot ? form.screenshot.name : "Upload Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, screenshot: e.target.files[0] })
                }
              />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3">
              <strong>Note:</strong> You cannot submit the same task more than once. 
              Each review link must be unique.
            </p>
            <button
              type="submit"
              disabled={form.reviewLink && checkIfReviewLinkExists(form.reviewLink)}
              className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase ${
                form.reviewLink && checkIfReviewLinkExists(form.reviewLink)
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-amber-700'
              }`}
            >
              {form.reviewLink && checkIfReviewLinkExists(form.reviewLink)
                ? "Link Already Used"
                : "Confirm Submission"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

function Stat({ label, value, color = "text-slate-900" }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-amber-50 transition-colors"></div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 relative z-10">{label}</p>
      <h3 className={`text-5xl font-light tracking-tighter relative z-10 ${color}`}>
        {value.toString().padStart(2, '0')}
      </h3>
    </div>
  );
}

const statusStyles = {
  'Approved': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'In Review': 'border-amber-200 bg-amber-50 text-amber-700',
  'Pending': 'border-slate-200 bg-slate-50 text-slate-700',
  'active': 'border-emerald-200 bg-emerald-50 text-emerald-700'
};