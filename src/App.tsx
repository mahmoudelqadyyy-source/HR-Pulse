import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  ChevronRight, 
  FileText, 
  BarChart3, 
  LayoutDashboard,
  Settings,
  Bell,
  Moon,
  Sun,
  Upload,
  Download,
  Filter,
  MoreVertical,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Candidate, Job, JobRequirements } from './types';

// --- Design System Constants ---
const COLORS = {
  primary: '#6D28D9', // Violet 700
  success: '#10B981', // Emerald 500
  warning: '#F59E0B', // Amber 500
  danger: '#EF4444',  // Red 500
  gray: '#6B7280',   // Gray 500
};

const PIE_COLORS = [COLORS.success, COLORS.warning, COLORS.danger, COLORS.gray];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'settings'>('dashboard');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock Data Initialization
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Frontend Engineer',
        createdAt: new Date().toISOString(),
        requirements: {
          experienceYears: 5,
          field: 'Software Engineering',
          skills: ['React', 'TypeScript', 'Tailwind CSS'],
          weights: { skills: 0.5, experience: 0.3, education: 0.2 }
        }
      },
      {
        id: '2',
        title: 'Product Designer',
        createdAt: new Date().toISOString(),
        requirements: {
          experienceYears: 3,
          field: 'Design',
          skills: ['Figma', 'UI/UX', 'Prototyping'],
          weights: { skills: 0.4, experience: 0.4, education: 0.2 }
        }
      }
    ];

    const mockCandidates: Candidate[] = [
      {
        id: '1',
        jobId: '1',
        name: 'Sarah Johnson',
        jobTitle: 'Frontend Developer',
        score: 9.2,
        strengths: ['Expert React knowledge', 'Strong TypeScript skills'],
        missingSkills: ['GraphQL'],
        redFlags: [],
        summary: 'Highly experienced frontend engineer with a focus on React and performance optimization.',
        experienceYears: 6,
        status: 'shortlisted',
        comments: [],
        votes: 3
      },
      {
        id: '2',
        jobId: '1',
        name: 'Michael Chen',
        jobTitle: 'Fullstack Engineer',
        score: 7.5,
        strengths: ['Versatile skill set', 'Good problem solving'],
        missingSkills: ['Tailwind CSS'],
        redFlags: ['Short tenure at last 2 roles'],
        summary: 'Solid fullstack developer with strong backend foundations, looking to transition more into frontend.',
        experienceYears: 4,
        status: 'pending',
        comments: [],
        votes: 1
      },
      {
        id: '3',
        jobId: '2',
        name: 'Emily Davis',
        jobTitle: 'Senior Designer',
        score: 8.8,
        strengths: ['Exceptional portfolio', 'User-centric approach'],
        missingSkills: [],
        redFlags: [],
        summary: 'Creative designer with a track record of building intuitive user interfaces for complex SaaS products.',
        experienceYears: 5,
        status: 'shortlisted',
        comments: [],
        votes: 5
      }
    ];

    setJobs(mockJobs);
    setCandidates(mockCandidates);
  }, []);

  const handleCreateJob = (job: Job) => {
    setJobs([...jobs, job]);
  };

  const handleAddCandidates = (newCandidates: Candidate[]) => {
    setCandidates([...candidates, ...newCandidates]);
  };

  const handleUpdateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-violet-600 dark:text-violet-400">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
              <Briefcase size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">HR Pulse</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setSelectedJobId(null); }} 
          />
          <SidebarLink 
            icon={<Briefcase size={20} />} 
            label="Jobs Pipeline" 
            active={activeTab === 'jobs'} 
            onClick={() => setActiveTab('jobs')} 
          />
          <SidebarLink 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            {selectedJobId && (
              <button 
                onClick={() => setSelectedJobId(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedJobId ? jobs.find(j => j.id === selectedJobId)?.title : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard candidates={candidates} jobs={jobs} onNavigateToJob={(jobId) => { setActiveTab('jobs'); setSelectedJobId(jobId); }} />}
            {activeTab === 'jobs' && !selectedJobId && <JobsList jobs={jobs} onSelectJob={setSelectedJobId} onCreateJob={handleCreateJob} />}
            {activeTab === 'jobs' && selectedJobId && (
              <JobDetail 
                job={jobs.find(j => j.id === selectedJobId)!} 
                candidates={candidates.filter(c => c.jobId === selectedJobId)}
                onBack={() => setSelectedJobId(null)}
                onAddCandidates={handleAddCandidates}
                onUpdateCandidate={handleUpdateCandidate}
                isBlindMode={false}
                onExportCSV={() => {}}
              />
            )}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Dashboard({ candidates, jobs, onNavigateToJob }: { candidates: Candidate[], jobs: Job[], onNavigateToJob: (jobId: string) => void }) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'shortlisted' | 'rejected' | 'pending'>('all');

  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter(c => c.status === 'shortlisted').length;
  const rejected = candidates.filter(c => c.status === 'rejected').length;
  const pending = candidates.filter(c => c.status === 'pending').length;
  const avgScore = totalCandidates ? (candidates.reduce((acc, c) => acc + c.score, 0) / totalCandidates).toFixed(1) : 0;

  // Chart Data Preparation
  const statusData = [
    { name: 'Shortlisted', value: shortlisted },
    { name: 'Pending', value: pending },
    { name: 'Rejected', value: rejected },
  ];

  const pipelineData = useMemo(() => {
    const data = jobs.slice(0, 6).map(job => {
      const jobCands = candidates.filter(c => c.jobId === job.id);
      return {
        name: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
        Total: jobCands.length,
        Shortlisted: jobCands.filter(c => c.status === 'shortlisted').length,
      };
    });
    return data.length > 0 ? data : [{ name: 'No Data', Total: 0, Shortlisted: 0 }];
  }, [jobs, candidates]);

  const filteredCandidates = useMemo(() => {
    if (filterStatus === 'all') return candidates.slice(0, 10);
    return candidates.filter(c => c.status === filterStatus).slice(0, 10);
  }, [candidates, filterStatus]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Overview</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track your hiring pipeline and candidate metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Candidates" value={totalCandidates} trend="+12%" icon={<Users size={20} className="text-violet-600 dark:text-violet-400" />} bg="bg-violet-50 dark:bg-violet-500/10" onClick={() => setFilterStatus('all')} active={filterStatus === 'all'} />
        <StatCard title="Shortlisted" value={shortlisted} trend="+5%" icon={<CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />} bg="bg-emerald-50 dark:bg-emerald-500/10" onClick={() => setFilterStatus('shortlisted')} active={filterStatus === 'shortlisted'} />
        <StatCard title="Rejected" value={rejected} trend="-2%" icon={<XCircle size={20} className="text-red-600 dark:text-red-400" />} bg="bg-red-50 dark:bg-red-500/10" onClick={() => setFilterStatus('rejected')} active={filterStatus === 'rejected'} />
        <StatCard title="Avg AI Score" value={avgScore} trend="+0.4" icon={<Briefcase size={20} className="text-amber-600 dark:text-amber-400" />} bg="bg-amber-50 dark:bg-amber-500/10" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold mb-6">Pipeline by Job</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Total" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="Shortlisted" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold mb-6">Candidate Status</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            {totalCandidates === 0 ? (
              <div className="text-gray-400 text-sm">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PIE_COLORS[index % PIE_COLORS.length]} 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setFilterStatus(entry.name.toLowerCase() as any)}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setFilterStatus(entry.name.toLowerCase() as any)}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Candidates List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {filterStatus === 'all' ? 'Recent Candidates' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Candidates`}
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
            Showing {filteredCandidates.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Candidate</th>
                <th className="px-6 py-4 font-medium tracking-wider">Score</th>
                <th className="px-6 py-4 font-medium tracking-wider">Experience</th>
                <th className="px-6 py-4 font-medium tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {filteredCandidates.map(candidate => {
                const scoreColor = candidate.score >= 8 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : candidate.score >= 5 ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' : 'text-red-600 bg-red-50 dark:bg-red-500/10';
                return (
                  <tr 
                    key={candidate.id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer"
                    onClick={() => onNavigateToJob(candidate.jobId)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{candidate.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md font-bold text-xs ${scoreColor}`}>
                        {candidate.score}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {candidate.experienceYears} yrs
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-medium
                        ${candidate.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                          candidate.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No candidates found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg, trend, onClick, active }: { title: string, value: string | number, icon: React.ReactNode, bg: string, trend: string, onClick?: () => void, active?: boolean }) {
  const isPositive = trend.startsWith('+');
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border flex flex-col gap-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700' : ''} ${active ? 'border-violet-500 ring-1 ring-violet-500' : 'border-gray-200 dark:border-gray-700'}`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 bg-red-50 dark:bg-red-500/10'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{title}</p>
      </div>
    </div>
  );
}

function JobsList({ jobs, onSelectJob, onCreateJob }: { jobs: Job[], onSelectJob: (id: string) => void, onCreateJob: (job: Job) => void }) {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return <JobRequirementsForm onSave={(job) => { onCreateJob(job); setIsCreating(false); }} onCancel={() => setIsCreating(false)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Jobs Pipeline</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active job openings and candidate pools.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-lg shadow-violet-600/20 transition-all"
        >
          <Plus size={20} />
          Create New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <div 
            key={job.id} 
            onClick={() => onSelectJob(job.id)}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-violet-500 dark:hover:border-violet-500 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                <Briefcase size={24} />
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <MoreVertical size={20} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{job.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{job.requirements.field}</p>
            
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>Active Candidates</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={14} />
                <span>{job.requirements.experienceYears}+ yrs exp</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-400">Created {new Date(job.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-semibold text-sm">
                View Pipeline
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobDetail({ job, candidates, onBack, onAddCandidates, onUpdateCandidate, isBlindMode, onExportCSV }: { job: Job, candidates: Candidate[], onBack: () => void, onAddCandidates: (c: Candidate[]) => void, onUpdateCandidate: (id: string, updates: Partial<Candidate>) => void, isBlindMode: boolean, onExportCSV: () => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCandidates: Candidate[] = [];
    for (let i = 0; i < files.length; i++) {
      newCandidates.push({
        id: Math.random().toString(36).substr(2, 9),
        jobId: job.id,
        name: files[i].name.split('.')[0],
        jobTitle: 'Applicant',
        score: Math.floor(Math.random() * 6) + 4, // 4-10
        strengths: ['Relevant experience', 'Strong skills'],
        missingSkills: [],
        redFlags: [],
        summary: 'Automatically analyzed profile based on the uploaded CV.',
        experienceYears: Math.floor(Math.random() * 10),
        status: 'pending',
        comments: [],
        votes: 0
      });
    }
    
    onAddCandidates(newCandidates);
    setIsAnalyzing(false);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterScore === 'high') return c.score >= 8;
    if (filterScore === 'medium') return c.score >= 5 && c.score < 8;
    if (filterScore === 'low') return c.score < 5;
    return true;
  }).sort((a,b) => b.score - a.score);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">{job.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{candidates.length} total candidates • {job.requirements.field}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onExportCSV} className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={18} />
            Export
          </button>
          <label className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-lg shadow-violet-600/20 transition-all cursor-pointer">
            {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={20} />}
            {isAnalyzing ? 'Analyzing...' : 'Upload CVs'}
            <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" disabled={isAnalyzing} />
          </label>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <Filter size={16} className="text-gray-400" />
          <select value={filterScore} onChange={e => setFilterScore(e.target.value as any)} className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-0 cursor-pointer">
            <option value="all">All Scores</option>
            <option value="high">Excellent (8-10)</option>
            <option value="medium">Average (5-7)</option>
            <option value="low">Poor (&lt;5)</option>
          </select>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2"></div>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600 dark:text-violet-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <LayoutList size={16} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600 dark:text-violet-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <CandidateTable candidates={filteredCandidates} onUpdate={onUpdateCandidate} isBlindMode={isBlindMode} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(c => (
            <CandidateCard key={c.id} candidate={c} onUpdate={onUpdateCandidate} isBlindMode={isBlindMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateTable({ candidates, onUpdate, isBlindMode }: { candidates: Candidate[], onUpdate: (id: string, updates: Partial<Candidate>) => void, isBlindMode: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Candidate</th>
            <th className="px-6 py-4">AI Score</th>
            <th className="px-6 py-4">Experience</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {candidates.map(c => (
            <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold">
                    {isBlindMode ? '?' : c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{isBlindMode ? `Candidate ${c.id.slice(0,4)}` : c.name}</div>
                    <div className="text-xs text-gray-500">{c.jobTitle}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    c.score >= 8 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    c.score >= 5 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {c.score}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {c.experienceYears} years
              </td>
              <td className="px-6 py-4">
                <select 
                  value={c.status}
                  onChange={e => onUpdate(c.id, { status: e.target.value as any })}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border-none outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer ${
                    c.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    c.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CandidateCardProps {
  candidate: Candidate;
  onUpdate: (id: string, updates: Partial<Candidate>) => void;
  isBlindMode: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate: c, onUpdate, isBlindMode }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-lg">
            {isBlindMode ? '?' : c.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{isBlindMode ? `Candidate ${c.id.slice(0,4)}` : c.name}</h4>
            <p className="text-xs text-gray-500">{c.jobTitle}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg font-bold text-sm ${
          c.score >= 8 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' :
          c.score >= 5 ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400' :
          'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {c.score}/10
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{c.summary}</p>

      <div className="space-y-2 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {c.strengths.slice(0, 2).map((s, i) => (
            <span key={i} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md uppercase">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-violet-600 transition-colors">
            <ThumbsUp size={16} />
          </button>
          <button className="text-gray-400 hover:text-violet-600 transition-colors">
            <MessageSquare size={16} />
          </button>
        </div>
        <button className="text-violet-600 dark:text-violet-400 font-bold text-xs hover:underline">
          Full Profile
        </button>
      </div>
    </div>
  );
}

function JobRequirementsForm({ onSave, onCancel }: { onSave: (job: Job) => void, onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [field, setField] = useState('');
  const [exp, setExp] = useState(3);
  const [skills, setSkills] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      createdAt: new Date().toISOString(),
      requirements: {
        experienceYears: exp,
        field,
        skills: skills.split(',').map(s => s.trim()),
        weights: { skills: 0.4, experience: 0.4, education: 0.2 }
      }
    };
    onSave(newJob);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Job Opening</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Senior Product Designer"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Field</label>
            <input 
              type="text" 
              required 
              value={field}
              onChange={e => setField(e.target.value)}
              placeholder="e.g. Design"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Min. Experience (Years)</label>
            <input 
              type="number" 
              required 
              value={exp}
              onChange={e => setExp(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Required Skills (comma separated)</label>
          <textarea 
            required 
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="Figma, UI/UX, Prototyping, Design Systems"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-all h-32 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
            Cancel
          </button>
          <button type="submit" className="flex-1 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all">
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="max-w-xl space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">AI Scoring Weights</h3>
            <div className="space-y-4">
              <WeightSlider label="Skills Match" value={50} />
              <WeightSlider label="Experience Relevance" value={30} />
              <WeightSlider label="Education Background" value={20} />
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Blind Recruitment</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Enable Blind Mode</p>
                <p className="text-sm text-gray-500">Hide names and photos to reduce unconscious bias.</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeightSlider({ label, value }: { label: string, value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-violet-600 dark:text-violet-400">{value}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full">
        <div className="h-full bg-violet-600 rounded-full" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}
