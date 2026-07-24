import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
        <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚧</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Pothole Reporter
              </h1>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors">Map</Link>
              <Link to="/report" className="text-slate-300 hover:text-white transition-colors">Report</Link>
              <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">Admin</Link>
              {/* Fake Auth button for MVP demo */}
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg transition-colors font-semibold shadow-lg shadow-amber-500/20">
                Sign In
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;
