import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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

const Map = ({ reports }: { reports: Report[] }) => {
  return (
    <MapContainer 
      center={[51.505, -0.09]} // Default to London or fallback
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {reports.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]}>
          <Popup className="rounded-lg shadow-xl border-0">
            <div className="p-2 min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                <span className={`px-2 py-1 text-xs rounded-full font-semibold capitalize
                  ${report.severity === 'severe' ? 'bg-red-500/20 text-red-700' : 
                    report.severity === 'moderate' ? 'bg-amber-500/20 text-amber-700' : 
                    'bg-green-500/20 text-green-700'}`}>
                  {report.severity}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {report.status}
                </span>
              </div>
              {report.image_url && (
                <img src={report.image_url} alt="Pothole" className="w-full h-32 object-cover rounded-md mb-2" />
              )}
              <p className="text-sm text-slate-700 mb-3">{report.description || 'No description provided.'}</p>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-xs text-slate-500">{report.upvotes_count} upvotes</span>
                <button className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-full transition-colors font-medium">
                  Upvote
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
