import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Info } from 'lucide-react';

interface NewsAlert {
  id: number;
  headline: string;
  source_name: string;
  source_url: string;
  published_at: string;
  alarm_level: string;
}

const NewsFeed = () => {
  const [news, setNews] = useState<NewsAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/news`);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="p-4 text-slate-400 text-sm">Loading latest alerts...</div>;
  }

  if (news.length === 0) {
    return <div className="p-4 text-slate-400 text-sm">No recent alerts found.</div>;
  }

  return (
    <div className="flex flex-col">
      {news.map((item) => (
        <a 
          key={item.id} 
          href={item.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-4 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors group block"
        >
          <div className="flex items-start gap-3">
            {item.alarm_level === 'alarming' ? (
              <div className="p-1.5 bg-red-500/10 rounded-md mt-0.5 shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            ) : (
              <div className="p-1.5 bg-blue-500/10 rounded-md mt-0.5 shrink-0">
                <Info className="w-4 h-4 text-blue-400" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-slate-200 group-hover:text-white leading-snug mb-1">
                {item.headline}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">{item.source_name}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default NewsFeed;
