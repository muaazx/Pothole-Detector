import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  Upload, Image as ImageIcon, MapPin, CheckCircle, AlertOctagon, 
  Loader2, Sparkles, FileWarning, ArrowRight, ThumbsUp, X 
} from 'lucide-react';
import { api } from '../lib/api';
import SeverityCard, { SeverityType } from './SeverityCard';
import { Report } from '../types';
import axios from 'axios';

// Component to handle pin placements on the nested fallback map
function LocationPicker({ position, setPosition }: { position: [number, number] | null; setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })} /> : null;
}

interface ReportFormProps {
  onSuccess: () => void;
}

export default function ReportForm({ onSuccess }: ReportFormProps) {
  // Form values
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityType>('minor');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Flow & verification states
  const [isAcquiringLocation, setIsAcquiringLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [duplicateConflicts, setDuplicateConflicts] = useState<Report[] | null>(null);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-trigger browser Geolocation on Mount
  useEffect(() => {
    requestGeolocation();
  }, []);

  const fetchIPLocation = () => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          setLat(data.latitude);
          setLng(data.longitude);
        } else {
          setLat(37.7749);
          setLng(-122.4194);
        }
      })
      .catch(() => {
        setLat(37.7749);
        setLng(-122.4194);
      })
      .finally(() => {
        setIsAcquiringLocation(false);
      });
  };

  const requestGeolocation = () => {
    setIsAcquiringLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Attempting IP alignment...');
      fetchIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setIsAcquiringLocation(false);
      },
      (err) => {
        console.warn('GPS lock failed, using IP location fallback:', err);
        setLocationError(
          err.code === 1 
            ? 'GPS access denied. Aligned location using IP location. Click map to adjust pin.' 
            : 'Satellite lock timed out. Aligned using IP location.'
        );
        fetchIPLocation();
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };


  // Drag and drop image handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessImage(e.target.files[0]);
    }
  };

  const validateAndProcessImage = (file: File) => {
    setValidationError(null);
    
    // File type validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Unsupported file format. Please upload JPEG, PNG or WebP images.');
      return;
    }

    // Size check (max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setValidationError('Image size exceeds 5MB limit. Please upload a compressed image file.');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Client-side validation checks
    if (!lat || !lng) {
      setValidationError('Coordinate alignment missing. Please place a marker on the map.');
      return;
    }
    if (!image) {
      setValidationError('Physical image proof is mandatory to prevent fraudulent pothole reports.');
      return;
    }
    if (!description.trim()) {
      setValidationError('A brief geological description is required.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('lat', lat.toString());
    formData.append('lng', lng.toString());
    formData.append('severity', severity);
    formData.append('description', description.trim());

    try {
      await api.createReport(formData);
      setSubmitSuccess(true);
      // Reset state after slight delay
      setTimeout(() => {
        onSuccess();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        // Duplicate report detected - display collision reports modal
        const conflictData = err.response.data as { nearby_reports?: Report[] };
        setDuplicateConflicts(conflictData.nearby_reports || []);
      } else {
        setValidationError(
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Connect failed with network database. Submit was buffered locally.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvoteDuplicate = async (id: string) => {
    setUpvotingId(id);
    try {
      await api.upvoteReport(id);
      setDuplicateConflicts(null);
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess();
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Failed to upvote collision report:', error);
      alert('Upvote register failed. Database sync offline.');
    } finally {
      setUpvotingId(null);
    }
  };

  const resetForm = () => {
    setDescription('');
    setSeverity('minor');
    clearImage();
    setValidationError(null);
    setSubmitSuccess(false);
    setDuplicateConflicts(null);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xl relative overflow-hidden" id="report-form-container">
      {/* Decorative colored glow in top-right corner */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-[var(--accent-primary)]/10 blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-2.5 border-b border-[var(--border-glass)] pb-4 mb-6">
        <Sparkles className="h-5 w-5 text-[var(--accent-primary)]" />
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">File Infrastructure Report</h2>
          <p className="text-xs text-[var(--text-tertiary)]">All logs are routed directly to county engineers for priority processing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Geolocation verification */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              1. Pothole Location Coordinates
            </span>
            {isAcquiringLocation ? (
              <span className="flex items-center gap-1 text-[var(--accent-primary)] text-[10px] animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                Satellite Lock In Progress
              </span>
            ) : (
              <button 
                type="button" 
                onClick={requestGeolocation} 
                className="text-[10px] text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-bold uppercase hover:underline"
              >
                Sync GPS
              </button>
            )}
          </label>

          {locationError && (
            <div className="mb-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-400 flex gap-2">
              <FileWarning className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{locationError}</span>
            </div>
          )}

          {lat && lng ? (
            <div className="space-y-3">
              <div className="flex gap-2 text-sans text-xs bg-[var(--bg-base)] p-2.5 border border-[var(--border-glass)] rounded-lg">
                <span className="text-[var(--text-tertiary)]">Latitude: <strong className="text-[var(--text-secondary)] font-medium">{lat.toFixed(6)}</strong></span>
                <span className="text-[var(--text-tertiary)]">|</span>
                <span className="text-[var(--text-tertiary)]">Longitude: <strong className="text-[var(--text-secondary)] font-medium">{lng.toFixed(6)}</strong></span>
              </div>
              
              {/* Fallback Manual Placement Map */}
              <div className="h-44 w-full rounded-xl border border-[var(--border-glass)] overflow-hidden relative">
                <MapContainer
                  center={[lat, lng]}
                  zoom={14}
                  className="h-full w-full"
                  zoomControl={false}
                  doubleClickZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                  <LocationPicker position={[lat, lng]} setPosition={(pos) => { setLat(pos[0]); setLng(pos[1]); }} />
                </MapContainer>
                <div className="absolute bottom-2 right-2 z-[1000] bg-[var(--bg-surface-elevated)]/80 backdrop-blur-sm border border-[var(--border-glass)] text-[9px] text-[var(--text-secondary)] px-2 py-0.5 rounded">
                  Drag/Click map to fine-tune pin location
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-base)] text-xs text-[var(--text-secondary)]">
              No coordinates mapped. Waiting for GPS link...
            </div>
          )}
        </div>

        {/* Step 2: Severity Assessment */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
            <AlertOctagon className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            2. Severity Assessment
          </label>
          <SeverityCard value={severity} onChange={setSeverity} />
        </div>

        {/* Step 3: Photographic Evidence Upload */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
            <Upload className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            3. Photographic Proof
          </label>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-300 ${
              dragActive 
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5' 
                : imagePreview 
                  ? 'border-[var(--border-glass)] bg-[var(--bg-base)]' 
                  : 'border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-[var(--text-tertiary)]'
            }`}
          >
            {imagePreview ? (
              <div className="relative w-full flex flex-col items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Infrastructure Damage Preview"
                  className="h-44 w-full max-w-sm rounded-lg object-cover border border-[var(--border-glass)]"
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]">{image?.name}</span>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1 transition-colors"
                    title="Remove Image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-primary)]">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-semibold text-[var(--text-primary)]">Drag & drop image here</p>
                <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">Supports JPEG, PNG, or WebP up to 5MB</p>
                <p className="mt-2.5 text-xs text-[var(--accent-primary)] font-bold uppercase text-[10px]">Or browse files</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Step 4: Geological Description */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              <ImageIcon className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              4. Geological Details / Description
            </label>
            <span className={`text-[10px] font-mono ${description.length > 450 ? 'text-red-400' : 'text-[var(--text-tertiary)]'}`}>
              {description.length}/500
            </span>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            placeholder="Describe pothole location landmark, specific lane direction, depth, or speed risk..."
            rows={4}
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
          />
        </div>

        {/* Error Feedback Block */}
        {validationError && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex gap-2"
          >
            <AlertOctagon className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </motion.div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting || submitSuccess}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-indigo-950/40 disabled:text-indigo-400 disabled:cursor-not-allowed text-sm font-semibold text-white py-3.5 shadow-lg shadow-indigo-950/40 transition-all active:scale-98"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading Geological Evidence...</span>
            </>
          ) : submitSuccess ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Report Successfully Broadcast!</span>
            </>
          ) : (
            <>
              <span>Submit Report to Council</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* DUPLICATE COLLISION MODAL (HTTP 409) */}
      <AnimatePresence>
        {duplicateConflicts && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="duplicate-conflict-modal">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setDuplicateConflicts(null)}
                className="absolute top-4 right-4 rounded-full p-1 text-[var(--text-tertiary)] hover:text-white transition-colors hover:bg-[var(--border-glass)]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5 border-b border-[var(--border-glass)] pb-4 mb-4">
                <div className="h-9 w-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-white">Duplicate Records Detected</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Others have already reported potholes at these exact coordinates.</p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-tertiary)] leading-relaxed mb-4">
                To prevent spam and help county engineers prioritize faster, please consider upvoting one of the existing records below instead of filing a new report.
              </p>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-5 pr-1">
                {duplicateConflicts.map((rep) => (
                  <div
                    key={rep.id}
                    className="flex gap-3 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] p-3 items-start justify-between"
                  >
                    {rep.image_url && (
                      <img
                        src={rep.image_url}
                        alt="Existing Damage"
                        className="h-14 w-14 rounded object-cover border border-[var(--border-glass)] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                          rep.severity === 'severe' ? 'bg-red-500/10 text-red-400' :
                          rep.severity === 'moderate' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-green-500/10 text-green-400'
                        }`}>
                          {rep.severity}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] capitalize">
                          {rep.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">
                        {rep.description}
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      disabled={upvotingId === rep.id}
                      onClick={() => handleUpvoteDuplicate(rep.id)}
                      className="flex items-center gap-1 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[10px] font-bold text-white px-2.5 py-1.5 shadow active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      {upvotingId === rep.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ThumbsUp className="h-3 w-3" />
                      )}
                      <span>Upvote</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border-glass)] pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setDuplicateConflicts(null)}
                  className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  Cancel Submission
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    // Force submit bypassing duplication restriction if user really wants to
                    setIsSubmitting(true);
                    setDuplicateConflicts(null);
                    const formData = new FormData();
                    if (image) formData.append('image', image);
                    if (lat) formData.append('lat', lat.toString());
                    if (lng) formData.append('lng', lng.toString());
                    formData.append('severity', severity);
                    formData.append('description', description.trim());
                    formData.append('force', 'true'); // Bypass duplicate restriction argument
                    try {
                      await api.createReport(formData);
                      setSubmitSuccess(true);
                      setTimeout(() => {
                        onSuccess();
                        resetForm();
                      }, 2000);
                    } catch (err) {
                      setValidationError('Failed to force record submission onto database.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="rounded-lg bg-[var(--status-severe)]/10 text-[var(--status-severe)] border border-[var(--status-severe)]/20 hover:bg-[var(--status-severe)]/20 px-4 py-2 text-xs font-semibold transition-all active:scale-95"
                >
                  Force Save Anyway
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submitting Glass overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-[var(--bg-surface)]/40 backdrop-blur-sm flex items-center justify-center flex-col gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
          <span className="text-xs font-semibold text-white">Transmitting proof...</span>
        </div>
      )}
    </div>
  );
}
