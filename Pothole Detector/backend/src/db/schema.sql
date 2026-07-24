-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY, -- Firebase Auth UID
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'citizen', -- 'citizen', 'officer', 'admin'
  ward_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  location geometry(Point, 4326) NOT NULL, -- PostGIS point
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  description TEXT,
  severity VARCHAR(50) NOT NULL, -- 'minor', 'moderate', 'severe'
  status VARCHAR(50) DEFAULT 'Reported', -- 'Reported', 'Acknowledged', 'In Progress', 'Resolved'
  image_url VARCHAR(1024),
  priority_score DOUBLE PRECISION DEFAULT 0,
  ward_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for fast distance queries
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);

-- Upvotes table
CREATE TABLE IF NOT EXISTS upvotes (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(report_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Status history table
CREATE TABLE IF NOT EXISTS status_history (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) REFERENCES users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News alerts table
CREATE TABLE IF NOT EXISTS news_alerts (
  id SERIAL PRIMARY KEY,
  headline TEXT NOT NULL,
  source_name VARCHAR(255),
  source_url VARCHAR(1024),
  published_at TIMESTAMP WITH TIME ZONE,
  country VARCHAR(50),
  matched_keywords TEXT,
  alarm_level VARCHAR(50), -- 'informational', 'alarming'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert mock user for local development
INSERT INTO users (id, email, name, role) 
VALUES ('mock-user-123', 'mock@example.com', 'Mock User', 'citizen') 
ON CONFLICT (id) DO NOTHING;
