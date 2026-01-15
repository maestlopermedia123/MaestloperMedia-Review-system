'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  ShieldCheck, 
  Image as ImageIcon,
  Send,
  XCircle,
  User,
  Mail,
  Calendar,
  Check,
  AlertTriangle,
  Edit,
  Trash2,
  X,
  QrCode,
  Download,
  Copy,
  Eye,
  EyeOff,
  CreditCard,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import RazorpayButton from '@/components/RazorpayButton';
import TaskPrice from '@/components/TaskPrice';

export default function UserDetailPage({ params }) {
  const [transferAmount, setTransferAmount] = useState("");
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  // const [priceMap, setPriceMap] = useState({});
  console.log("totale amount",transferAmount);
  const [loading, setLoading] = useState(true);
  const [sendingFunds, setSendingFunds] = useState(false);
  const [counter, setCounter] = useState(0);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [approvingTaskId, setApprovingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRazorpayOption, setShowRazorpayOption] = useState(false);
  const [amount, setAmount] = useState(0);
  const resolvedParams = use(params); 
  const userId = resolvedParams.id;


  console.log('Tasks in UserDetailPage:', userData); 
  // Fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        const data = await res.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch task submissions for this user
  const fetchTaskSubmissions = async () => {
    try {
      const res = await fetch("/api/tasksubmission");
      const result = await res.json();
      
      // Filter submissions for this specific user
      const userSubmissions = result.data?.filter(
        submission => submission.user === userId
      ) || [];
      
      setCounter(userSubmissions.length);
      setTasks(userSubmissions);
      
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

  // Handle approve task
  const handleApproveTask = async () => {
    if (!approvingTaskId) return;
    
    setApproving(true);
    try {
      const res = await fetch(`/api/tasksubmission/${approvingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          updatedAt: new Date().toISOString()
        })
      });

      const data = await res.json();
      
      if (data.success) {
        // Update the task status locally
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === approvingTaskId 
              ? { ...task, status: 'approved', updatedAt: new Date().toISOString() }
              : task
          )
        );
        
        alert("Task approved successfully!");
        setShowApproveConfirm(false);
        setApprovingTaskId(null);
        
        // Refresh task submissions to get updated data
        fetchTaskSubmissions();
      } else {
        alert("Approval failed: " + data.message);
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Approval failed. Please try again.");
    } finally {
      setApproving(false);
    }
  };

  // Handle delete task submission
  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/tasksubmission/${deletingTaskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      
      if (data.success) {
        // Remove the task from local state
        setTasks(prevTasks => prevTasks.filter(task => task._id !== deletingTaskId));
        
        alert("Task submission deleted successfully!");
        setShowDeleteConfirm(false);
        setDeletingTaskId(null);
        
        // Refresh task submissions to get updated data
        fetchTaskSubmissions();
      } else {
        alert("Delete failed: " + data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Copy QR code URL to clipboard
  const copyQRUrlToClipboard = () => {
    if (userData?.upiQr?.url) {
      navigator.clipboard.writeText(userData.upiQr.url)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Download QR code image
  const downloadQRCode = () => {
    if (userData?.upiQr?.url) {
      const link = document.createElement('a');
      link.href = userData.upiQr.url;
      link.download = `QR_Code_${userData.name || userData.email}_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Open approve confirmation
  const openApproveConfirm = (taskId) => {
    setApprovingTaskId(taskId);
    setShowApproveConfirm(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (taskId) => {
    setDeletingTaskId(taskId);
    setShowDeleteConfirm(true);
  };

  // Handle fund transfer
  const handleSendFunds = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setSendingFunds(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(transferAmount),
          userId: userId
        })
      });

      const data = await res.json();
      
      if (data.success) {
        alert("Funds transferred successfully!");
        setUserData(prev => ({
          ...prev,
          balance: (parseFloat(prev.balance) + parseFloat(transferAmount)).toFixed(2)
        }));
        setTransferAmount("");
      } else {
        alert("Transfer failed: " + data.message);
      }
    } catch (error) {
      console.error("Transfer error:", error);
      alert("Transfer failed. Please try again.");
    } finally {
      setSendingFunds(false);
    }
  };

  // Handle Razorpay payment success for individual task
  const handleTaskPaymentSuccess = (paymentId, amount, taskData) => {
    alert(`Payment successful for Task ${taskData.taskId}! Payment ID: ${paymentId}, Amount: $${amount}`);
    
    // Update user balance after successful payment
    setUserData(prev => ({
      ...prev,
      balance: (parseFloat(prev.balance) + parseFloat(amount)).toFixed(2)
    }));
    
    // You can also update the specific task status or add payment info here
    console.log('Task payment details:', taskData);
  };

  // Handle Razorpay payment failure for individual task
  const handleTaskPaymentFailure = (error, taskData) => {
    alert(`Payment failed for Task ${taskData.taskId}: ${error}`);
    console.log('Task payment failed details:', taskData);
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

  // Calculate completed tasks
  const calculateCompletedTasks = () => {
    return tasks.filter(task => task.status === "approved").length;
  };

  // Get user join date from created tasks
  const getJoinDate = () => {
    if (tasks.length === 0) return "N/A";
    
    const dates = tasks
      .map(task => new Date(task.submittedAt || task.createdAt))
      .filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) return "N/A";
    
    const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    return oldestDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Handle Razorpay payment success (global)
  const handlePaymentSuccess = (paymentId, amount) => {
    alert(`Payment successful! Payment ID: ${paymentId}, Amount: $${amount}`);
    
    // Update user balance after successful payment
    setUserData(prev => ({
      ...prev,
      balance: (parseFloat(prev.balance) + parseFloat(amount)).toFixed(2)
    }));
  };

  // Handle Razorpay payment failure (global)
  const handlePaymentFailure = (error) => {
    alert(`Payment failed: ${error}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
          <p className="text-slate-600 mt-2">Unable to find user with ID: {userId}</p>
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* --- TOP NAVIGATION --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 text-xs font-black uppercase px-3 py-1 rounded-full ${
              userData.status === "active" 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-slate-100 text-slate-600"
            }`}>
              <ShieldCheck size={14} /> 
              {userData.status ? userData.status.charAt(0).toUpperCase() + userData.status.slice(1) : "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: USER PROFILE & TRANSFER & QR CODE --- */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-100">
                <User size={40} />
              </div>
              <h1 className="text-2xl font-black text-slate-800">{userData.name || userData.email?.split('@')[0] || "User"}</h1>
              
              <div className="flex items-center justify-center gap-2 text-slate-400 font-medium mb-6">
                <Mail size={16} />
                {userData.email || "No email"}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                 <p> Mobile Number:{userData.phone || "N/A"}</p>
                </div>
                </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-left">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks Done</p>
                  <p className="text-lg font-black text-slate-800">Completed: {calculateCompletedTasks()}</p>
                  <p className="text-lg font-black text-slate-800">Pending: {counter}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Since</p>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    <p className="text-lg font-black text-slate-800">{getJoinDate()}</p>
                  </div>
                </div>
              </div>
              
              {/* User ID Display */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">User ID</p>
                <p className="font-mono text-sm text-slate-600 break-all">{userData._id || userId}</p>
              </div>
            </div>

            {/* QR Code Display Card */}
            {userData.upiQr && userData.upiQr.url && (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <QrCode className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">UPI QR Code</h3>
                      <p className="text-xs text-slate-500">Submitted by user</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRazorpayOption(!showRazorpayOption)}
                      className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-medium mr-2"
                    >
                      <CreditCard size={16} />
                      {showRazorpayOption ? "Hide Razorpay" : "Razorpay"}
                    </button>
                    <button 
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {showQRCode ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showQRCode ? "Hide QR" : "Show QR"}
                    </button>
                  </div>
                </div>

                {showQRCode && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* QR Code Image - Scannable */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="flex flex-col items-center">
                        <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-white p-2 shadow-inner">
                          <img 
                            src={userData.upiQr.url} 
                            alt="UPI QR Code"
                            className="w-full h-full object-contain"
                            onClick={() => {
                              // If user taps/clicks on QR code, show scan instructions
                              alert("Open any UPI app (GPay, PhonePe, Paytm) and scan this QR code to make payment.");
                            }}
                          />
                          {/* Scan overlay effect */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-4 h-32 bg-indigo-500/20 animate-pulse rounded"></div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-3 text-center flex items-center justify-center gap-1">
                          <Smartphone size={12} />
                          Scan with any UPI app to pay instantly
                        </p>
                      </div>
                    </div>

                    {/* Razorpay Button Option */}
                    {showRazorpayOption && (
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4">
                        <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                          <CreditCard size={16} />
                          Online Payment via Razorpay
                        </h4>
                        <p className="text-xs text-emerald-700 mb-3">
                          Secure payment via credit/debit card, UPI, or net banking
                        </p>
                        <div className="space-y-3">
                          <RazorpayButton
                            amount={transferAmount || "100"} // Default amount if not specified
                            userEmail={userData.email}
                            userName={userData.name || userData.email}
                            onSuccess={handlePaymentSuccess}
                            onFailure={handlePaymentFailure}
                            disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                          />
                          <p className="text-xs text-slate-500 text-center">
                            Payment will be credited to user's balance immediately
                          </p>
                        </div>
                      </div>
                    )}

                    {/* QR Code Info */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cloudinary Public ID</p>
                        <p className="text-sm font-mono text-slate-700 break-all bg-slate-50 p-2 rounded-lg">
                          {userData.upiQr.public_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upload Date</p>
                        <p className="text-sm text-slate-700">
                          {formatDate(userData.upiQr.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          // Open UPI apps directly if possible
                          if (navigator.share) {
                            navigator.share({
                              title: 'UPI Payment QR Code',
                              text: `Scan this QR code to pay ${userData.name || userData.email}`,
                              url: userData.upiQr.url
                            });
                          } else {
                            copyQRUrlToClipboard();
                          }
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        {copySuccess ? "Copied!" : "Share QR"}
                      </button>
                      <button
                        onClick={downloadQRCode}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                )}

                {!showQRCode && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-amber-700">
                      QR Code is hidden. Click "Show QR" to view and download.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No QR Code Message */}
            {!userData.upiQr && (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <QrCode className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">UPI QR Code</h3>
                      <p className="text-xs text-slate-500">Not uploaded yet</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 mb-2">No QR code uploaded by user</p>
                  <p className="text-xs text-slate-500">Ask the user to upload their UPI QR code</p>
                  
                  {/* Razorpay alternative */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setShowRazorpayOption(!showRazorpayOption)}
                      className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-medium mx-auto"
                    >
                      <CreditCard size={16} />
                      {showRazorpayOption ? "Hide" : "Use Razorpay instead"}
                    </button>
                    
                    {showRazorpayOption && (
                      <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                        <RazorpayButton
                          amount={transferAmount || "100"}
                          userEmail={userData.email}
                          userName={userData.name || userData.email}
                          onSuccess={handlePaymentSuccess}
                          onFailure={handlePaymentFailure}
                          disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Money Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Available Balance</p>
                <DollarSign className="text-indigo-400" size={20} />
              </div>
              <h2 className="text-4xl font-black mb-8">${userData.balance || "0.00"}</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-8 pr-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={handleSendFunds}
                    disabled={sendingFunds}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
                  >
                    {sendingFunds ? "Processing..." : "Send Funds Manually"}
                    {!sendingFunds && (
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                  </button>
                  
                  {/* Quick Razorpay Button */}
                  {transferAmount && parseFloat(transferAmount) > 0 && (
                    <div className="bg-emerald-900/30 border border-emerald-700/30 rounded-2xl p-3">
                      <RazorpayButton
                        amount={transferAmount}
                        userEmail={userData.email}
                        userName={userData.name || userData.email}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        buttonText="Pay via Razorpay"
                        size="small"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: TASKS & PROOF --- */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              Task Submissions ({tasks.length})
            </h2>

            {tasks.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-slate-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Task Submissions</h3>
                <p className="text-slate-500">This user hasn't submitted any tasks yet.</p>
              </div>
            ) : (
tasks.map((task) => (
  <div key={task._id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:border-indigo-200 transition-all">
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Proof Image/Video - LEFT SIDE */}
      <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden bg-slate-100 relative group cursor-zoom-in">
        {task.proof?.screenshotUrl ? (
          <a
            href={task.proof.screenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <img 
              src={task.proof.screenshotUrl} 
              alt="Proof screenshot" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </a>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <ImageIcon className="text-slate-400" size={40} />
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <ImageIcon className="text-white" />
        </div>
      </div>

      {/* Task Details - RIGHT SIDE */}
      <div className="flex-1">
        {/* Task ID and Timestamps */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
              {task.task ? task.task.substring(0, 8) + "..." : "No Task ID"}
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              Submission ID: {task._id?.substring(0, 12)}...
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">
              Submitted: {formatDate(task.submittedAt)}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Updated: {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>

        {/* Status Badge and Task Info */}
        <div className="flex items-center justify-between mb-4">
          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
            task.status === 'approved' 
              ? 'bg-emerald-50 text-emerald-600' 
              : task.status === 'rejected'
              ? 'bg-rose-50 text-rose-600'
              : 'bg-amber-50 text-amber-600'
          }`}>
            {task.status === 'approved' ? (
              <CheckCircle2 size={14}/>
            ) : task.status === 'rejected' ? (
              <XCircle size={14}/>
            ) : (
              <Clock size={14}/>
            )}
            {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : "Pending"}
          </span>
          
          {/* Task Price Display */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Price:</span>
            <span className="font-bold text-slate-800">
              <TaskPrice key={task.task} taskId={task.task }  onPrice={(value) => setAmount(value)}  />
            </span>
          </div>
        </div>

        {/* Task ID Display */}
        <div className="mb-4 p-3 bg-slate-50 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Task ID</p>
          <p className="font-mono text-sm text-slate-700 break-all">{task.task || "N/A"}</p>
        </div>

        {/* Review Link */}
        {task.proof?.reviewLink && (
          <div className="mb-4">
            <a
              href={task.proof.reviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
            >
              View Proof Link <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Razorpay Button Section */}
        <div className="mb-6 pt-4 border-t border-slate-100">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <h4 className="font-bold text-indigo-800">Pay for this Task</h4>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                Task #{task.task?.substring(0, 8)}...
              </span>
            </div>
            
            <RazorpayButton
              userId={task.user || userData?._id}
              taskId={task.task}
              taskSubmissionId={task._id}
              amount={amount}
            />
            
            <div className="mt-3 text-xs text-slate-600 space-y-1">
              <p className="font-medium">Payment Details:</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Task ID:</span>
                  <p className="font-mono truncate">{task.task?.substring(0, 16)}...</p>
                </div>
                <div>
                  <span className="text-slate-400">Submission ID:</span>
                  <p className="font-mono truncate">{task._id?.substring(0, 16)}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200">
          {task.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => openApproveConfirm(task._id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Approve Task
              </button>
              <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2">
                <Edit size={18} />
                Edit
              </button>
            </div>
          )}

          {task.status === 'approved' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={18} />
                  <span className="font-bold">Task Approved</span>
                </div>
                <p className="text-sm text-emerald-600 mt-1">
                  This task has been approved on {formatDate(task.updatedAt)}
                </p>
              </div>
              <button
                onClick={() => openDeleteConfirm(task._id)}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Submission
              </button>
            </div>
          )}

          {task.status === 'rejected' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-rose-700">
                  <XCircle size={18} />
                  <span className="font-bold">Task Rejected</span>
                </div>
                <p className="text-sm text-rose-600 mt-1">
                  This task was rejected on {formatDate(task.updatedAt)}
                </p>
              </div>
              <button
                onClick={() => openDeleteConfirm(task._id)}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Submission
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
))
            )}
          </div>
        </div>
      </main>

      {/* Approve Confirmation Modal */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in duration-200">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Approve Task Submission</h3>
              <p className="text-slate-600">
                Are you sure you want to approve this task submission? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveConfirm(false);
                  setApprovingTaskId(null);
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-xl font-bold transition"
                disabled={approving}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveTask}
                disabled={approving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {approving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Yes, Approve
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full">
                <Trash2 className="h-6 w-6 text-rose-600" />
              </div>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingTaskId(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Task Submission</h3>
              <p className="text-slate-600 mb-2">
                Are you sure you want to delete this task submission? This action is permanent and cannot be undone.
              </p>
              <p className="text-sm text-rose-600 font-medium">
                ⚠️ All submission data including proof files will be permanently removed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingTaskId(null);
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-xl font-bold transition"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={deleting}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}