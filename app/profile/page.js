'use client';
import React, { use, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  console.log('User in ProfilePage:', user);

  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setEmail(user.email || '');
      
      // Set profile image if available
      if (user.profileImage) {
        setPreviewUrl(user.profileImage);
      } else if (user.name) {
        // Fallback to avatar API
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f172a&color=fff&size=128`;
        setPreviewUrl(avatarUrl);
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleProfileImageUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select an image first');
      return;
    }

    if (!user?._id) {
      alert('User not found. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await fetch(`/api/users/profile-image?id=${user._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      alert('Profile image updated successfully!');
      
      // Update preview with new image URL if returned
      if (result.imageUrl) {
        setPreviewUrl(result.imageUrl);
      }
      
      setFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a QR code image first');
      return;
    }

    if (!user?._id) {
      alert('User not found. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('qr', file);
      
      const response = await fetch(`/api/users/qr?id=${user._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload QR code');
      }

      const result = await response.json();
      alert('QR code uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error('Error uploading QR code:', error);
      alert('Error uploading QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      {/* HEADER SECTION */}
 <div className="bg-gradient-to-r from-slate-900 to-slate-800 h-64 relative">
    <div className="max-w-5xl mx-auto px-8 h-full flex items-end">
      <div className="translate-y-16 flex flex-col md:flex-row md:items-end gap-6 w-full">
        {/* Avatar with Upload Functionality */}
        <div className="relative group">
          <form onSubmit={handleProfileImageUpload} className="w-32 h-32">
            <label htmlFor="profile-image-upload" className="cursor-pointer">
              <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-2xl">
                <div className="w-full h-full rounded-xl bg-slate-200 flex items-center justify-center text-3xl font-light text-slate-400 overflow-hidden relative">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl font-light text-slate-600">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold tracking-widest uppercase">Change</span>
                  </div>
                </div>
              </div>
            </label>
            <input 
              id="profile-image-upload"
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {file && (
              <button 
                type="submit"
                disabled={loading}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-amber-500 text-white px-3 py-1 rounded-full hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? 'Uploading...' : 'Save Image'}
              </button>
            )}
          </form>
        </div>

        {/* User Info Section - Fixed for better visibility */}
        <div className="flex-1 pb-4">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{userName || 'User Profile'}</h1>
          <p className="text-slate-200 text-sm tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-sm"></span>
            Account Active • Verified Member
          </p>
          <p className="text-slate-300 text-sm mt-4">
         
          </p>
        </div>

        {/* Edit Profile Button */}
        <div className="pb-4 flex gap-3">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2.5 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-xl text-slate-800"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  </div>
      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: PERSONAL INFO & UPLOAD FORMS */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-600 mb-6">Personal Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput label="Full Name" value={userName} disabled={!isEditing} />
                <ProfileInput label="Email Address" value={email} disabled={!isEditing} />
              </div>
            </section>

            {/* QR Code Upload Section */}
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-600 mb-6">QR Code Upload</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <form onSubmit={handleQRUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload QR Code Image
                    </label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-amber-50 file:text-amber-700
                        hover:file:bg-amber-100"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Supports JPG, PNG, GIF. Max file size: 5MB
                    </p>
                  </div>
                  
                  {file && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
                      <div className="w-32 h-32 border border-slate-300 rounded-lg overflow-hidden">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="QR Code Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={!file || loading}
                    className="px-6 py-2.5 bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Uploading...' : 'Upload QR Code'}
                  </button>
                </form>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: MEMBERSHIP CARD */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
              {/* Decorative Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-8 h-8 bg-amber-400 rotate-45 flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">Premium Tier</span>
                </div>
                
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Membership ID</p>
                <h4 className="text-xl font-mono mb-8 tracking-tighter">AX-9920-2026</h4>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Valid Thru</p>
                    <p className="text-sm font-bold">12 / 2028</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Points</p>
                    <p className="text-sm font-bold text-amber-400">12,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileInput({ label, value, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        type="text" 
        defaultValue={value}
        disabled={disabled}
        className={`bg-transparent border-b py-2 text-sm outline-none transition-all ${
          disabled ? 'border-transparent text-slate-600' : 'border-slate-200 focus:border-amber-500 text-slate-900'
        }`}
      />
    </div>
  );
}