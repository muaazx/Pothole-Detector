import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Camera, MapPin, Upload } from 'lucide-react';

const ReportForm = () => {
  const navigate = useNavigate();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location', error);
          toast.error('Could not get your location automatically.');
          setLocationLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, confirmDuplicate = false) => {
    e.preventDefault();
    if (!lat || !lng) {
      toast.error('Location is required.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('lat', lat.toString());
      formData.append('lng', lng.toString());
      formData.append('severity', severity);
      formData.append('description', description);
      if (confirmDuplicate) {
        formData.append('confirmDuplicate', 'true');
      }
      if (image) {
        formData.append('image', image);
      }

      // We should use an auth token here, but mocking for MVP
      const token = 'mock_token'; 

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reports`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success(confirmDuplicate ? 'Upvoted existing report!' : 'Report submitted successfully!');
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Handle duplicate detection
        const duplicate = error.response.data.duplicate;
        toast((t) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium text-slate-800">Possible duplicate found!</p>
            <p className="text-sm text-slate-600">A pothole was already reported here.</p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => { toast.dismiss(t.id); handleSubmit(e, true); }}
                className="bg-amber-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-amber-600"
              >
                Upvote Existing
              </button>
              <button 
                onClick={() => toast.dismiss(t.id)}
                className="bg-slate-200 text-slate-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ), { duration: 10000 });
      } else {
        toast.error('Failed to submit report.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/50 p-8 border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          <Camera className="text-amber-500" />
          Report a Pothole
        </h2>
        
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
          
          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Location</label>
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="bg-slate-800 p-3 rounded-full shrink-0">
                <MapPin className="text-amber-500 w-6 h-6" />
              </div>
              <div className="flex-1">
                {locationLoading ? (
                  <p className="text-slate-400 text-sm animate-pulse">Detecting your location...</p>
                ) : lat && lng ? (
                  <p className="text-slate-200 text-sm font-medium">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-red-400 text-sm">Location required</p>
                )}
              </div>
              <button 
                type="button" 
                onClick={getLocation}
                className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors font-medium text-slate-200"
              >
                Retake
              </button>
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Severity</label>
            <div className="grid grid-cols-3 gap-3">
              {['minor', 'moderate', 'severe'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`py-3 px-4 rounded-xl font-medium capitalize transition-all duration-200 border ${
                    severity === level 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Photo (Optional)</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer group relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="text-slate-400 w-6 h-6" />
                </div>
                {image ? (
                  <p className="text-amber-400 font-medium text-sm">{image.name}</p>
                ) : (
                  <div>
                    <p className="text-slate-300 font-medium text-sm">Click to upload or drag and drop</p>
                    <p className="text-slate-500 text-xs mt-1">SVG, PNG, JPG or GIF</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Description (Optional)</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Deep pothole in the right lane..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !lat || !lng}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
