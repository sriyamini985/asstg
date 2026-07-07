import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, Search, Filter, RefreshCw, 
  Download, Eye, FileText, X, LogOut, Loader2, AlertTriangle, Clock
} from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { API_BASE_URL } from '../config';

export default function AdminDashboard({ onShowToast }) {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pendingVerification: 0,
    approved: 0,
    rejected: 0,
    today: 0
  });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting & Pagination state
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [regStatus, setRegStatus] = useState('');
  const [payStatus, setPayStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Module toggle
  const [activeModule, setActiveModule] = useState('events'); // 'events' | 'memberships'
  const [memberships, setMemberships] = useState([]);
  const [membershipsLoading, setMembershipsLoading] = useState(false);

  // Selected item for details/verification modal
  const [selectedReg, setSelectedReg] = useState(null);
  const [modalNotes, setModalNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('asst_admin_token');
    localStorage.removeItem('asst_admin_user');
    navigate('/admin/login');
  }, [navigate]);

  const fetchRegistrations = useCallback(async (adminToken = token) => {
    try {
      let query = `?search=${encodeURIComponent(search)}&category=${category}&regStatus=${regStatus}&payStatus=${payStatus}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      const response = await fetch(`${API_BASE_URL}/api/admin/registrations${query}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (!response.ok) throw new Error('Failed to load registrations');
      const data = await response.json();
      setRegistrations(data);
      setCurrentPage(1); // Reset page on filter/search
    } catch (error) {
      console.error(error);
      if (onShowToast) onShowToast('Failed to load registrations listing');
    }
  }, [category, dateFrom, dateTo, payStatus, regStatus, search, token, onShowToast]);

  const fetchMemberships = useCallback(async (adminToken = token) => {
    setMembershipsLoading(true);
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      const response = await fetch(`${API_BASE_URL}/api/admin/memberships${query}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (!response.ok) throw new Error('Failed to load memberships');
      const data = await response.json();
      setMemberships(data);
    } catch (error) {
      console.error(error);
      if (onShowToast) onShowToast('Failed to load membership requests');
    } finally {
      setMembershipsLoading(false);
    }
  }, [search, token, onShowToast]);

  const loadDashboardData = useCallback(async (adminToken) => {
    setLoading(true);
    try {
      const authHeaders = { 'Authorization': `Bearer ${adminToken}` };
      
      // Load Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, { headers: authHeaders });
      if (!statsRes.ok) throw new Error('Stats load failed');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Load lists
      await fetchRegistrations(adminToken);
      await fetchMemberships(adminToken);
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('Session expired. Please log in again.');
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [fetchRegistrations, fetchMemberships, handleLogout, onShowToast]);

  useEffect(() => {
    const adminToken = localStorage.getItem('asst_admin_token');
    if (!adminToken) {
      navigate('/admin/login');
    } else {
      setToken(adminToken);
      loadDashboardData(adminToken);
    }
  }, [navigate, loadDashboardData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setRegStatus('');
    setPayStatus('');
    setDateFrom('');
    setDateTo('');
    setTimeout(() => fetchRegistrations(), 50);
  };

  const openVerificationModal = (reg) => {
    setSelectedReg(reg);
    setModalNotes(reg.adminNotes || '');
  };

  const handleApprove = async () => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/registrations/${selectedReg.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          regStatus: 'Approved',
          payStatus: 'Verified',
          adminNotes: modalNotes
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to approve registration');

      if (onShowToast) onShowToast(`Registration ID ${selectedReg.registrationId} approved successfully`);
      setSelectedReg(null);
      loadDashboardData(token);
    } catch (error) {
      alert(error.message || 'Error approving registration');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReject = async () => {
    if (!modalNotes.trim()) {
      alert('Please enter rejection remarks in the notes field.');
      return;
    }
    setUpdatingStatus(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/registrations/${selectedReg.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          regStatus: 'Rejected',
          payStatus: 'Rejected',
          adminNotes: modalNotes
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reject registration');

      if (onShowToast) onShowToast(`Registration ID ${selectedReg.registrationId} rejected successfully`);
      setSelectedReg(null);
      loadDashboardData(token);
    } catch (error) {
      alert(error.message || 'Error rejecting registration');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const downloadFile = (reg) => {
    // Create an authenticated download link
    fetch(`${API_BASE_URL}/api/admin/registrations/${reg.id}/screenshot`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) throw new Error('File download failed');
      return response.blob();
    })
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = reg.paymentScreenshot || 'screenshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error(error);
      alert('Could not download screenshot file.');
    });
  };

  const triggerExport = (format) => {
    const query = `?format=${format}&category=${category}&regStatus=${regStatus}&payStatus=${payStatus}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    
    fetch(`${API_BASE_URL}/api/admin/export${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) throw new Error('Export generation failed');
      return response.blob();
    })
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `asst-registrations-${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onShowToast) onShowToast(`Export file downloaded successfully`);
    })
    .catch(error => {
      console.error(error);
      alert('Error exporting registrations.');
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const sortedRegistrations = [...registrations].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'name') {
      aVal = `${a.firstName} ${a.lastName || ''}`.trim().toLowerCase();
      bVal = `${b.firstName} ${b.lastName || ''}`.trim().toLowerCase();
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRegistrations.length / itemsPerPage);
  const paginatedRegistrations = sortedRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
      case 'Verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Under Verification':
      case 'Pending':
      case 'Pending Verification':
      case 'Verification Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="relative min-h-screen pt-36 pb-12 px-6 bg-[#f8fbff]/60">
      <PageBackground />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-blue-50 p-6 rounded-2xl shadow-xl shadow-blue-900/5">
          <div>
            <h1 className="text-[#0d2d6b] font-black text-2xl font-sans tracking-tight">Admin Management Center</h1>
            <p className="text-gray-400 text-xs mt-0.5 font-medium">Logged in as: <strong className="text-gray-600">{localStorage.getItem('asst_admin_user') || 'Admin'}</strong></p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border-2 border-rose-200 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        {/* ── ANALYTICS COUNTERS ── */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-[#123E87] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Registrations', value: stats.total, icon: <Users className="w-4 h-4" />, color: 'border-blue-200 text-blue-800 bg-blue-50/30' },
              { label: 'Pending Verification', value: stats.pendingVerification, icon: <AlertTriangle className="w-4 h-4" />, color: 'border-amber-200 text-amber-800 bg-amber-50/30' },
              { label: 'Approved', value: stats.approved, icon: <CheckCircle className="w-4 h-4" />, color: 'border-emerald-200 text-emerald-800 bg-emerald-50/30' },
              { label: 'Rejected', value: stats.rejected, icon: <XCircle className="w-4 h-4" />, color: 'border-rose-200 text-rose-800 bg-rose-50/30' },
              { label: "Today's Registrations", value: stats.today || 0, icon: <Clock className="w-4 h-4" />, color: 'border-indigo-200 text-indigo-800 bg-indigo-50/30' }
            ].map((card, i) => (
              <div key={i} className={`border p-4 rounded-xl flex flex-col justify-between gap-3 ${card.color}`}>
                <div className="flex justify-between items-center text-current/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center">{card.icon}</div>
                </div>
                <span className="text-2xl font-black">{card.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="bg-white border border-blue-50 p-6 rounded-2xl shadow-xl shadow-blue-900/5 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <label htmlFor="admin-search" className="sr-only">Search registrations</label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="admin-search"
                name="search"
                autocomplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, Name, Hospital, Email, or Mobile..."
                className="premium-input pl-10"
              />
            </div>
            <button type="submit" className="btn-premium-navy flex items-center gap-1.5 cursor-pointer">
              <Filter className="w-3.5 h-3.5" /> Filter Log
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="border-2 border-gray-200 hover:border-gray-300 text-gray-500 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear
            </button>
          </form>

          {/* Advanced Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-category" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Category</label>
              <select
                id="filter-category"
                name="category"
                autocomplete="off"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="premium-input bg-white text-xs"
              >
                <option value="">All Categories</option>
                <option value="Consultant">Consultant</option>
                <option value="Postgraduate Student">Postgraduate Student</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-status" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Reg Status</label>
              <select
                id="filter-status"
                name="status"
                autocomplete="off"
                value={regStatus}
                onChange={(e) => setRegStatus(e.target.value)}
                className="premium-input bg-white text-xs"
              >
                <option value="">All Statuses</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-date-from" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Date From</label>
              <input
                type="date"
                id="filter-date-from"
                name="dateFrom"
                autocomplete="off"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="premium-input text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-date-to" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Date To</label>
              <input
                type="date"
                id="filter-date-to"
                name="dateTo"
                autocomplete="off"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="premium-input text-xs"
              />
            </div>
          </div>

          {/* Exports Center */}
          <div className="flex flex-wrap gap-2.5 pt-3 border-t border-gray-100 justify-end">
            <span className="text-gray-400 text-xs font-bold self-center mr-auto">Exports Center:</span>
            <button
              onClick={() => triggerExport('csv')}
              className="border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={() => triggerExport('xlsx')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* ── MODULE SELECTOR TABS ── */}
        <div className="flex gap-2 text-left">
          <button
            onClick={() => setActiveModule('events')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
              activeModule === 'events'
                ? 'bg-[#123E87] text-white shadow-md shadow-blue-900/10'
                : 'bg-white border border-blue-50/50 text-gray-500 hover:text-[#123E87]'
            }`}
          >
            Event Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setActiveModule('memberships')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
              activeModule === 'memberships'
                ? 'bg-[#123E87] text-white shadow-md shadow-blue-900/10'
                : 'bg-white border border-blue-50/50 text-gray-500 hover:text-[#123E87]'
            }`}
          >
            Membership Requests ({memberships.length})
          </button>
        </div>

        {activeModule === 'events' ? (
          /* ── REGISTRATIONS TABLE LOG ── */
          <div className="bg-white border border-blue-50 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
            <div className="overflow-x-auto text-left">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50/40 text-[#0d2d6b] border-b border-blue-50 text-xs font-bold select-none">
                    <th className="px-6 py-4 cursor-pointer hover:bg-blue-50/60" onClick={() => handleSort('registrationId')}>
                      Reg ID {sortField === 'registrationId' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-blue-50/60" onClick={() => handleSort('name')}>
                      Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-blue-50/60" onClick={() => handleSort('hospital')}>
                      Hospital/Institution {sortField === 'hospital' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-blue-50/60" onClick={() => handleSort('category')}>
                      Category {sortField === 'category' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-blue-50/60" onClick={() => handleSort('registrationStatus')}>
                      Status {sortField === 'registrationStatus' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                  {sortedRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400 font-medium">
                        No registrations matched the search filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedRegistrations.map((reg) => {
                      const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
                      return (
                        <tr key={reg.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-6 py-4 font-bold text-[#123E87]">{reg.registrationId}</td>
                          <td className="px-6 py-4 font-bold text-gray-700">{fullName}</td>
                          <td className="px-6 py-4 max-w-[200px] truncate">{reg.hospital}</td>
                          <td className="px-6 py-4 font-medium">{reg.category}</td>
                          <td className="px-6 py-4 leading-normal">
                            <div>{reg.email}</div>
                            <div className="text-[10px] text-gray-400 font-semibold">{reg.mobile}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${getStatusStyle(reg.paymentStatus)}`}>
                              {reg.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${getStatusStyle(reg.registrationStatus)}`}>
                              {reg.registrationStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openVerificationModal(reg)}
                                className="bg-[#123E87] hover:bg-[#0d2d6b] text-white p-2 rounded-lg cursor-pointer transition-colors"
                                title="Verify Payment & Registration Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => downloadFile(reg)}
                                className="border border-gray-200 hover:bg-gray-50 text-gray-600 p-2 rounded-lg cursor-pointer transition-colors"
                                title="Download Payment Screenshot"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100 select-none">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 text-xs font-bold border rounded-lg hover:bg-gray-100 disabled:opacity-40 cursor-pointer bg-white"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500 font-bold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 text-xs font-bold border rounded-lg hover:bg-gray-100 disabled:opacity-40 cursor-pointer bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── MEMBERSHIP REQUESTS TABLE LOG ── */
          <div className="bg-white border border-blue-50 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
            <div className="overflow-x-auto text-left">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50/40 text-[#0d2d6b] border-b border-blue-50 text-xs font-bold">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Hospital/Clinic</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                  {membershipsLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium">
                        Loading membership requests...
                      </td>
                    </tr>
                  ) : memberships.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium">
                        No online membership requests found.
                      </td>
                    </tr>
                  ) : (
                    memberships.map((member) => (
                      <tr key={member.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-700">{member.name}</td>
                        <td className="px-6 py-4 font-medium">{member.specialty}</td>
                        <td className="px-6 py-4">{member.hospital}</td>
                        <td className="px-6 py-4 leading-normal">
                          <div>{member.email}</div>
                          <div className="text-[10px] text-gray-400 font-semibold">{member.phone}</div>
                        </td>
                        <td className="px-6 py-4 max-w-[250px] truncate" title={member.message}>
                          {member.message || <span className="text-gray-300 italic">No message</span>}
                        </td>
                        <td className="px-6 py-4">{new Date(member.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ── STATUS VERIFICATION DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#030d21]/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-blue-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-[#123E87] text-white px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-lg">Registration Details</h3>
                  <p className="text-[#A9C6EC] text-xs font-semibold mt-0.5">ID: {selectedReg.registrationId} &bull; Submitted on {new Date(selectedReg.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                
                {/* Details Section */}
                <div className="md:col-span-7 flex flex-col gap-5">
                  
                  {/* Personal & Professional */}
                  <div>
                    <h4 className="text-[#0d2d6b] font-black text-xs uppercase tracking-wider border-b border-gray-100 pb-1.5 mb-3">Personal & Professional Info</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Registrant Name</span>
                        <strong className="text-gray-700 font-bold block text-sm mt-0.5">{`${selectedReg.title || ''} ${selectedReg.firstName} ${selectedReg.lastName || ''}`.trim()}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Specialty/Institution</span>
                        <strong className="text-gray-700 font-medium block text-xs mt-0.5">{selectedReg.hospital}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Email Address</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{selectedReg.email}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Mobile Number</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{selectedReg.mobile}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Gender</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{selectedReg.gender || 'Not specified'}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Date of Birth</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{selectedReg.dob ? new Date(selectedReg.dob).toLocaleDateString() : 'Not specified'}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Qualification</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{selectedReg.qualification || 'Not specified'}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Address</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{selectedReg.address || 'Not specified'}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">City</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{selectedReg.city || 'Not specified'}</strong>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">State & Pincode</span>
                        <strong className="text-gray-700 font-medium block mt-0.5">{`${selectedReg.state || ''} - ${selectedReg.pinCode || ''}`.trim() || 'Not specified'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h4 className="text-[#0d2d6b] font-black text-xs uppercase tracking-wider border-b border-gray-100 pb-1.5 mb-3">Payment details</h4>
                    <div className="grid grid-cols-3 gap-4 text-xs bg-blue-50/20 border border-blue-50/50 p-4 rounded-xl">
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Fee Category</span>
                        <strong className="text-[#123E87] font-bold block mt-0.5">{selectedReg.category}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Amount Paid</span>
                        <strong className="text-[#123E87] font-bold block mt-0.5">₹{selectedReg.fee.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Transaction ID</span>
                        <strong className="text-gray-700 font-bold block mt-0.5">{selectedReg.transactionId}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Status Verification Notes Form */}
                  <div>
                    <h4 className="text-[#0d2d6b] font-black text-xs uppercase tracking-wider border-b border-gray-100 pb-1.5 mb-3">Verification Notes & Remarks</h4>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="modal-notes" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Notes (Included in rejection email if rejected)</label>
                      <textarea
                        id="modal-notes"
                        name="notes"
                        autocomplete="off"
                        value={modalNotes}
                        onChange={(e) => setModalNotes(e.target.value)}
                        placeholder="Add remarks, verification notes, or reason for rejection..."
                        className="premium-input text-xs resize-none"
                        rows="3"
                      />
                    </div>
                    
                    <div className="mt-4 flex gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Current Reg Status</span>
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[9px] font-bold mt-1 ${getStatusStyle(selectedReg.registrationStatus)}`}>
                          {selectedReg.registrationStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Current Pay Status</span>
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[9px] font-bold mt-1 ${getStatusStyle(selectedReg.paymentStatus)}`}>
                          {selectedReg.paymentStatus}
                        </span>
                      </div>
                      {selectedReg.verifiedBy && (
                        <div className="ml-auto text-right">
                          <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Verified By</span>
                          <span className="text-gray-600 font-bold block mt-1">{selectedReg.verifiedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Screenshot Column */}
                <div className="md:col-span-5 flex flex-col gap-2.5">
                  <h4 className="text-[#0d2d6b] font-black text-xs uppercase tracking-wider border-b border-gray-100 pb-1.5">Payment Screenshot</h4>
                  <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center flex-1 max-h-[300px]">
                    {selectedReg.paymentScreenshot.toLowerCase().endsWith('.pdf') || selectedReg.paymentScreenshot.startsWith('data:application/pdf') ? (
                      <div className="p-6 flex flex-col items-center gap-2 text-center text-xs text-gray-400">
                        <FileText className="w-12 h-12 text-[#123E87]" />
                        <span>Uploaded PDF document. Click below to download.</span>
                      </div>
                    ) : (
                      <img
                        src={`${API_BASE_URL}/api/admin/registrations/${selectedReg.id}/screenshot?token=${token}`}
                        alt="Screenshot"
                        className="max-w-full max-h-[298px] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="p-6 text-center text-xs text-gray-400">Screenshot not available (or expired)</div>';
                        }}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => downloadFile(selectedReg)}
                    className="border-2 border-[#123E87] hover:bg-[#123E87] text-[#123E87] hover:text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Download Screenshot File
                  </button>
                </div>

              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end items-center gap-2.5">
                <button
                  onClick={() => setSelectedReg(null)}
                  className="border-2 border-gray-200 hover:border-gray-300 text-gray-500 font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer mr-auto bg-white"
                >
                  Close
                </button>
                <button
                  onClick={handleReject}
                  disabled={updatingStatus}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject Registration
                </button>
                <button
                  onClick={handleApprove}
                  disabled={updatingStatus}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve & Verify
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
