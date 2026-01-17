"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  X
} from "lucide-react";
import BASE_URL from "@/utils/baseUrl";
export default function UserManage() {
  // Task submission data state
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/tasksubmission");
        const result = await res.json();
        console.log("Fetched Data FROM TASK SUBMISSION:", result);
        setSubmissions(result.data || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter submissions based on search
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(
      submission =>
        (submission._id && submission._id.toLowerCase().includes(search.toLowerCase())) ||
        (submission.task && submission.task.toLowerCase().includes(search.toLowerCase())) ||
        (submission.user && submission.user.toLowerCase().includes(search.toLowerCase())) ||
        (submission.status && submission.status.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, submissions]);

  // Modal handlers
  const openDetailModal = (submission) => {
    setSelectedSubmission(submission);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSubmission(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-600">
            <XCircle size={12} />
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Loading submissions...</p>
    </div>
  );

  return (
    <div className="p-3 space-y-6">

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, task, user, or status..."
            className="w-full bg-white border border-indigo-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-indigo-50 border-b border-indigo-100">
            <tr className="text-xs uppercase tracking-wider text-indigo-500 font-bold">
              <th className="px-6 py-4">Submission ID</th>
              <th className="px-6 py-4">Task ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-indigo-100">
            {filteredSubmissions.map((submission) => (
              <tr key={submission._id} className="hover:bg-indigo-50 transition">
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-slate-700">
                    {submission._id?.substring(0, 8)}...
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-slate-700">
                    {submission.task?.substring(0, 8)}...
                  </div>
                </td>
                {/* <p>{BASE_URL}</p> */}
                <td className="px-6 py-4">
                  <a
                    href={`${BASE_URL}/${submission.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {submission.user?.substring(0, 8)}...
                    <ExternalLink size={12} />
                  </a>
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(submission.status)}
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">
                    {formatDate(submission.submittedAt)}
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openDetailModal(submission)}
                      className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-600 hover:text-white transition"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="p-2 rounded-lg bg-rose-100 hover:bg-rose-600 hover:text-white transition"
                      title="Delete Submission"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {modalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in duration-200">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800">
                Submission Details
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Submission ID
                  </label>
                  <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg">
                    {selectedSubmission._id}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Task ID
                  </label>
                  <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg">
                    {selectedSubmission.task}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    User ID
                  </label>
                  <a
                    href={`${BASE_URL}/${selectedSubmission.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                  >
                    {selectedSubmission.user}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Status
                  </label>
                  <div className="text-lg">
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Submitted At
                  </label>
                  <div className="text-sm">
                    {formatDate(selectedSubmission.submittedAt)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Created At
                  </label>
                  <div className="text-sm">
                    {formatDate(selectedSubmission.createdAt)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Updated At
                  </label>
                  <div className="text-sm">
                    {formatDate(selectedSubmission.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Proof Section */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-bold text-slate-800 mb-3">Proof Details</h3>
              
              <div className="space-y-4">
                {selectedSubmission.proof?.screenshotUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Screenshot
                    </label>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <img 
                        src={selectedSubmission.proof.screenshotUrl} 
                        alt="Submission screenshot"
                        className="max-w-full h-auto rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>
                )}

                {selectedSubmission.proof?.reviewLink && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Review Link
                    </label>
                    <a
                      href={selectedSubmission.proof.reviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline text-sm"
                    >
                      {selectedSubmission.proof.reviewLink}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg transition">
                Approve
              </button>
              <button className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold shadow-lg transition">
                Reject
              </button>
              <button 
                onClick={closeModal}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-xl font-bold shadow-lg transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}