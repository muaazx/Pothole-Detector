import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

interface Report {
  id: number;
  lat: number;
  lng: number;
  severity: string;
  status: string;
  description: string;
  image_url: string;
  upvotes_count: number;
  priority_score: number;
  created_at: string;
}

const Admin = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = 'mock_token';
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/reports/${id}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh list locally
      setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-slate-400 text-sm">Total Reports: </span>
          <span className="text-white font-bold">{reports.length}</span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase font-semibold text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reported</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading reports...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No reports found.</td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-400">#{report.id}</td>
                    <td className="px-6 py-4">
                      {report.image_url ? (
                        <img src={report.image_url} alt="Pothole" className="w-12 h-12 rounded object-cover border border-slate-600" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center text-xs text-slate-500 border border-slate-600">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${report.severity === 'severe' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          report.severity === 'moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white">{report.priority_score}</span>
                        <span className="text-xs text-slate-500">({report.upvotes_count} upvotes)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={report.status}
                        onChange={(e) => updateStatus(report.id, e.target.value)}
                        className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2"
                      >
                        <option value="Reported">Reported</option>
                        <option value="Acknowledged">Acknowledged</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-amber-500 hover:text-amber-400 font-medium">View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
