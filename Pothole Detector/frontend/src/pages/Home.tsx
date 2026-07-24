import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../components/Map';
import NewsFeed from '../components/NewsFeed';

interface Report {
  id: number;
  lat: number;
  lng: number;
  severity: string;
  status: string;
  description: string;
  image_url: string;
  upvotes_count: number;
}

const Home = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports`);
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full">
      {/* Map Section */}
      <div className="flex-1 relative z-0">
        <Map reports={reports} />
      </div>

      {/* News sidebar */}
      <div className="w-full md:w-96 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700 flex flex-col z-10 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-amber-500">📰</span> Local News & Alerts
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NewsFeed />
        </div>
      </div>
    </div>
  );
};

export default Home;
