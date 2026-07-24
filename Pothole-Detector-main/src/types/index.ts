export interface Report {
  id: string;
  lat: number;
  lng: number;
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved';
  image_url: string;
  upvotes_count: number;
  priority_score?: number;
  created_at?: string;
}

export interface NewsAlert {
  id: string;
  headline: string;
  source_name: string;
  source_url: string;
  published_at: string;
  alarm_level: 'informational' | 'alarming';
}

export interface DuplicateCheckResponse {
  nearby_reports: Report[];
}
