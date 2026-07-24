import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ThumbsUp, AlertTriangle, RefreshCw, Layers, Navigation } from 'lucide-react';
import { Report } from '../types';

// Custom controller component to handle map pan/zoom dynamically when selected coords change
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}


// Marker wrapper that auto-opens its popup when selected by ID
function AutoOpenMarker({
  report,
  selectedReportId,
  position,
  children,
}: {
  key?: React.Key;
  report: Report;
  selectedReportId?: string;
  position: [number, number];
  children: React.ReactNode;
}) {

  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (selectedReportId && report.id === selectedReportId && markerRef.current) {
      const timer = setTimeout(() => {
        markerRef.current?.openPopup();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedReportId, report.id]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={createCustomIcon(report.status, report.severity)}
    >
      {children}
    </Marker>
  );
}


// User current location Leaflet DivIcon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-user-icon',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-1/2">
        <div class="absolute w-10 h-10 rounded-full bg-blue-500/40 animate-ping"></div>
        <div class="relative w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center">
          <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [0, 0],
  });
};

// Custom Leaflet DivIcon generator
const createCustomIcon = (status: Report['status'], severity: Report['severity']) => {
  let color = 'var(--status-minor)';
  if (severity === 'moderate') color = 'var(--status-moderate)';
  if (severity === 'severe') color = 'var(--status-severe)';
  if (status === 'resolved') color = 'var(--status-resolved)';

  const isSevereAndActive = severity === 'severe' && status !== 'resolved';
  const pulseClass = isSevereAndActive ? 'marker-severe-pulse' : '';

  return L.divIcon({
    className: 'custom-leaflet-icon-wrapper',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-1/2">
        <!-- Outer Glowing Ring -->
        <div class="absolute w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm shadow-xl flex items-center justify-center">
          <!-- Inner status circle -->
          <div class="w-3.5 h-3.5 rounded-full ${pulseClass}" style="background-color: ${color}; border: 1.5px solid white;"></div>
        </div>
        <!-- Ping ripple effect -->
        ${isSevereAndActive ? `
          <div class="absolute w-12 h-12 rounded-full opacity-30 animate-ping pointer-events-none" style="background-color: ${color}; animation-duration: 2.5s;"></div>
        ` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [0, 0], // Center precisely
  });
};

// Cluster DivIcon generator for grouped markers
const createClusterIcon = (count: number, highestSeverity: Report['severity']) => {
  let color = 'var(--status-minor)';
  if (highestSeverity === 'moderate') color = 'var(--status-moderate)';
  if (highestSeverity === 'severe') color = 'var(--status-severe)';

  return L.divIcon({
    className: 'custom-leaflet-cluster-wrapper',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12 -translate-x-1/2 -translate-y-1/2">
        <div class="absolute w-10 h-10 rounded-full border border-white/30 bg-black/80 backdrop-blur-md shadow-2xl flex items-center justify-center">
          <span class="font-display text-xs font-bold text-white">${count}</span>
        </div>
        <div class="absolute inset-0 rounded-full bg-[${color}] opacity-20 animate-pulse" style="background-color: ${color};"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [0, 0],
  });
};

interface MapProps {
  reports: Report[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onUpvote: (id: string) => Promise<void>;
  selectedCenter?: [number, number];
  selectedReportId?: string;
}

export default function Map({ reports, loading, error, onRetry, onUpvote, selectedCenter, selectedReportId }: MapProps) {
  const defaultCenter: [number, number] = [37.7749, -122.4194]; // Default fallback
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  const [activeCenter, setActiveCenter] = useState<[number, number]>(defaultCenter);
  const [activeZoom, setActiveZoom] = useState<number>(14);

  // Sync selectedCenter prop when user selects a report from remediation dispatch
  useEffect(() => {
    if (selectedCenter) {
      setActiveCenter(selectedCenter);
      setActiveZoom(15);
    }
  }, [selectedCenter]);

  const handleLocationFound = (coords: [number, number]) => {
    setUserLocation(coords);
    setActiveCenter(coords);
    setActiveZoom(15);
  };

  const locateUser = () => {
    setIsLocating(true);
    if (userLocation) {
      // Re-center map immediately to cached userLocation
      setActiveCenter(userLocation);
      setActiveZoom(15);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          handleLocationFound(coords);
          setIsLocating(false);
        },
        (err) => {
          console.warn('Browser GPS failed, using IP location fallback:', err);
          fetchIPLocation();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    } else {
      fetchIPLocation();
    }
  };

  const fetchIPLocation = () => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          const coords: [number, number] = [data.latitude, data.longitude];
          handleLocationFound(coords);
          if (data.city && data.country_name) {
            setLocationName(`${data.city}, ${data.country_name}`);
          }
        }
      })
      .catch((err) => console.error('IP geolocation error:', err))
      .finally(() => setIsLocating(false));
  };

  useEffect(() => {
    locateUser();
  }, []);



  // Manual zoom tracker hook
  function MapEventTracker() {
    const map = useMap();
    useEffect(() => {
      const handleZoom = () => {
        setZoomLevel(map.getZoom());
      };
      map.on('zoomend', handleZoom);
      return () => {
        map.off('zoomend', handleZoom);
      };
    }, [map]);
    return null;
  }

  // Pure React clustering algorithm (compatible with React 19)
  const mapItems = useMemo(() => {
    if (reports.length === 0) return [];

    // Clustering threshold based on map zoom levels
    // Lower zoom -> wider clustering threshold
    const gridSizes: Record<number, number> = {
      1: 5.0, 2: 4.0, 3: 3.0, 4: 2.0, 5: 1.0,
      6: 0.5, 7: 0.2, 8: 0.1, 9: 0.05, 10: 0.02,
      11: 0.01, 12: 0.005, 13: 0.002, 14: 0.001,
      15: 0.0005, 16: 0.0002, 17: 0.0001, 18: 0.00005,
    };

    const threshold = gridSizes[zoomLevel] || 0.0001;

    // Fast grid clustering
    const clusters: {
      key: string;
      reports: Report[];
      latSum: number;
      lngSum: number;
    }[] = [];

    reports.forEach((report) => {
      let matched = false;
      for (const cluster of clusters) {
        const dLat = Math.abs(cluster.latSum / cluster.reports.length - report.lat);
        const dLng = Math.abs(cluster.lngSum / cluster.reports.length - report.lng);
        if (dLat < threshold && dLng < threshold) {
          cluster.reports.push(report);
          cluster.latSum += report.lat;
          cluster.lngSum += report.lng;
          matched = true;
          break;
        }
      }

      if (!matched) {
        clusters.push({
          key: `${report.id}`,
          reports: [report],
          latSum: report.lat,
          lngSum: report.lng,
        });
      }
    });

    return clusters.map((c) => {
      const count = c.reports.length;
      const avgLat = c.latSum / count;
      const avgLng = c.lngSum / count;

      if (count === 1) {
        return {
          type: 'single' as const,
          id: c.reports[0].id,
          position: [c.reports[0].lat, c.reports[0].lng] as [number, number],
          report: c.reports[0],
        };
      } else {
        // Find highest severity in cluster
        let maxSeverity: Report['severity'] = 'minor';
        c.reports.forEach((r) => {
          if (r.severity === 'severe') maxSeverity = 'severe';
          else if (r.severity === 'moderate' && maxSeverity === 'minor') maxSeverity = 'moderate';
        });

        return {
          type: 'cluster' as const,
          id: `cluster-${c.key}`,
          position: [avgLat, avgLng] as [number, number],
          count,
          highestSeverity: maxSeverity,
          reports: c.reports,
        };
      }
    });
  }, [reports, zoomLevel]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-surface-elevated)] to-[var(--bg-surface)] opacity-40"></div>
        <div className="z-10 flex flex-col items-center gap-3">
          <Layers className="h-10 w-10 animate-bounce text-[var(--accent-primary)]" />
          <h3 className="font-display font-medium text-[var(--text-primary)]">Loading Infrastructure Map</h3>
          <p className="text-xs text-[var(--text-tertiary)]">Fetching geological reports & GPS indexes...</p>
        </div>
      </div>
    );
  }

  // Error State with Retry Call
  if (error) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/10 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-primary)]">Map Synchronization Failed</h3>
        <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">{error}</p>
        <button
          onClick={onRetry}
          className="mt-6 flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:bg-[var(--accent-primary-hover)] active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Synchronize Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[550px] w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden" id="map-wrapper">
      {/* Dynamic Status Badges over Map - Centered at Top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-wrap items-center justify-center gap-2 pointer-events-auto max-w-[90%]">
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)]/90 px-3 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-[var(--status-severe)]"></div>
          <span className="text-[var(--text-secondary)]">Severe</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)]/90 px-3 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-[var(--status-moderate)]"></div>
          <span className="text-[var(--text-secondary)]">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)]/90 px-3 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-[var(--status-minor)]"></div>
          <span className="text-[var(--text-secondary)]">Minor</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)]/90 px-3 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-[var(--status-resolved)]"></div>
          <span className="text-[var(--text-secondary)]">Resolved</span>
        </div>
      </div>


      {/* Locate Me Floating Action Button */}
      <button
        onClick={locateUser}
        title="Focus My Location"
        className="absolute top-4 right-4 z-[1000] flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)]/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:bg-[var(--accent-primary)] active:scale-95 cursor-pointer"
      >
        <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin text-blue-400' : 'text-blue-400'}`} />
        <span>{isLocating ? 'Acquiring GPS...' : userLocation ? 'My Location' : 'Locate Me'}</span>
      </button>

      <div className="absolute bottom-4 left-4 z-[1000] bg-[var(--bg-base)]/80 backdrop-blur-md border border-[var(--border-glass)] text-[10px] text-[var(--text-tertiary)] py-1 px-2.5 rounded">
        Zoom: {zoomLevel} | Vector Grid Active
      </div>

      <MapContainer
        center={activeCenter}
        zoom={zoomLevel}
        className="h-full w-full"
        zoomControl={true}
        id="leaflet-map-element"
      >
        {/* Force view change when parent tells map to focus on a reported point or user location */}
        <ChangeMapView center={activeCenter} zoom={activeZoom} />

        
        {/* Standard zoom level events register */}
        <MapEventTracker />

        {/* Premium CartoDB Dark Matter Basemap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserLocationIcon()}>
            <Popup>
              <div className="p-1 font-sans text-center">
                <div className="flex items-center justify-center gap-1.5 text-blue-400 font-bold text-xs">
                  <Navigation className="h-3 w-3" />
                  <span>Your Current Location</span>
                </div>
                {locationName && <p className="text-[11px] text-white font-medium mt-1">{locationName}</p>}
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dynamic Items Mapping */}
        {mapItems.map((item) => {
          if (item.type === 'single') {
            const r = item.report;
            return (
              <AutoOpenMarker
                key={item.id}
                report={r}
                selectedReportId={selectedReportId}
                position={item.position}
              >
                <Popup>
                  <div className="w-64 max-w-xs overflow-hidden rounded-lg font-sans">
                    {r.image_url ? (
                      <img
                        src={r.image_url}
                        alt="Pothole Document"
                        className="h-32 w-full object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-20 w-full items-center justify-center bg-[var(--bg-surface)] text-[var(--text-tertiary)] text-xs rounded border border-[var(--border-glass)]">
                        No Image Provided
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          r.severity === 'severe' ? 'bg-[var(--status-severe)]/10 text-[var(--status-severe)] border border-[var(--status-severe)]/20' :
                          r.severity === 'moderate' ? 'bg-[var(--status-moderate)]/10 text-[var(--status-moderate)] border border-[var(--status-moderate)]/20' :
                          'bg-[var(--status-minor)]/10 text-[var(--status-minor)] border border-[var(--status-minor)]/20'
                        }`}>
                          {r.severity}
                        </span>

                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium capitalize ${
                          r.status === 'resolved' ? 'bg-[var(--status-resolved)]/10 text-[var(--status-resolved)]' :
                          r.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-400' :
                          r.status === 'acknowledged' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-normal text-[var(--text-primary)] line-clamp-3 leading-relaxed">
                        {r.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-[var(--border-glass)] pt-2.5">
                        <span className="text-[10px] text-[var(--text-tertiary)]">
                          Upvotes: <strong className="text-[var(--text-secondary)] font-semibold">{r.upvotes_count}</strong>
                        </span>
                        
                        <button
                          onClick={() => onUpvote(r.id)}
                          className="flex items-center gap-1 rounded bg-[var(--accent-primary)] px-2 py-1 text-[10px] font-bold text-white transition-all hover:bg-[var(--accent-primary-hover)] active:scale-95 cursor-pointer"
                        >
                          <ThumbsUp className="h-2.5 w-2.5" />
                          <span>Upvote</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </AutoOpenMarker>
            );
          } else {
            // Cluster marker representation
            return (
              <Marker
                key={item.id}
                position={item.position}
                icon={createClusterIcon(item.count, item.highestSeverity)}
              >
                <Popup>
                  <div className="w-56 p-1 text-sans">
                    <h4 className="font-display text-xs font-semibold text-[var(--text-primary)]">
                      Density Cluster ({item.count} Reports)
                    </h4>
                    <p className="mt-1 text-[10px] text-[var(--text-secondary)] leading-tight">
                      Close proximity reports grouped together. Zoom in to expand individual reports.
                    </p>
                    <div className="mt-2.5 max-h-32 overflow-y-auto space-y-1.5 border-t border-[var(--border-glass)] pt-2">
                      {item.reports.map((rep) => (
                        <div key={rep.id} className="flex items-center justify-between text-[10px] gap-2">
                          <span className="text-[var(--text-tertiary)] truncate max-w-[120px]">{rep.description || 'Pothole Report'}</span>
                          <span className={`font-bold px-1 rounded uppercase scale-90 ${
                            rep.severity === 'severe' ? 'text-[var(--status-severe)]' :
                            rep.severity === 'moderate' ? 'text-[var(--status-moderate)]' :
                            'text-[var(--status-minor)]'
                          }`}>{rep.severity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          }
        })}
      </MapContainer>
    </div>
  );
}
