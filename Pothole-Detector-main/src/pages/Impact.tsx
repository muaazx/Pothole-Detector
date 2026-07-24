import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, ShieldAlert, Footprints, DollarSign, Building2, 
  Leaf, TrafficCone, HeartPulse, Briefcase, Smile, 
  Sparkles, CheckCircle2, ArrowRight, Layers, Cpu, Compass
} from 'lucide-react';

import vehicleDamageImg from '../../assets/vehicle_damage.png';
import smartSolutionImg from '../../assets/smart_solution.png';
import communitySafetyImg from '../../assets/community_safety.png';

interface ImpactCategory {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  badge: string;
  color: string;
  borderColor: string;
  bgColor: string;
  points: { title: string; desc: string }[];
  image?: string;
}

export default function Impact() {
  const [activeTab, setActiveTab] = useState<number | 'all'>('all');

  const categories: ImpactCategory[] = [
    {
      id: 1,
      title: 'Vehicle Damage',
      subtitle: 'Costly mechanical repairs and compromised vehicle safety',
      icon: Car,
      badge: 'Mechanical Risk',
      color: 'text-red-400',
      borderColor: 'border-red-500/30',
      bgColor: 'bg-red-500/10',
      image: vehicleDamageImg,
      points: [
        {
          title: 'Tire Damage',
          desc: 'Impact with road craters can puncture tires or cause them to bulge, making them prone to blowouts. This damage can result in dangerous driving conditions and necessitate costly replacements.',
        },
        {
          title: 'Wheel Alignment Issues',
          desc: 'Repeated pothole hits can misalign your vehicle’s wheels, leading to uneven tire wear and difficulty steering. Misalignment can also affect vehicle handling and safety.',
        },
        {
          title: 'Suspension Damage',
          desc: 'The suspension system can take a severe hit from potholes, resulting in a less smooth ride and expensive repairs. Damage to the suspension can compromise vehicle stability and comfort.',
        },
        {
          title: 'Exhaust System Damage',
          desc: 'Low-hanging components like the exhaust system can be damaged by deep craters, leading to increased emissions and repair costs. This damage can also affect vehicle performance and fuel efficiency.',
        },
      ],
    },
    {
      id: 2,
      title: 'Road Safety Hazards',
      subtitle: 'Severe driver disorientation and collision risks',
      icon: ShieldAlert,
      badge: 'Collision Risk',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-500/10',
      points: [
        {
          title: 'Loss of Control',
          desc: 'Striking a pothole can cause drivers to lose control of their vehicles, especially at high speeds or in wet conditions. This loss of control can lead to severe accidents and collisions.',
        },
        {
          title: 'Sudden Maneuvers',
          desc: 'Drivers may swerve or brake abruptly to avoid potholes, increasing the risk of collisions with other vehicles or pedestrians. Such sudden movements can destabilise vehicles and lead to traffic incidents.',
        },
        {
          title: 'Hidden Dangers',
          desc: 'Potholes filled with water can be nearly invisible, making them hard to avoid and increasing the risk of damage and accidents. This concealment can catch drivers off guard and exacerbate the danger.',
        },
      ],
    },
    {
      id: 3,
      title: 'Pedestrian Safety',
      subtitle: 'Threats to sidewalk navigability and mobility access',
      icon: Footprints,
      badge: 'Human Safety',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-500/10',
      image: communitySafetyImg,
      points: [
        {
          title: 'Trip and Fall Hazards',
          desc: 'Cracks and holes on sidewalks or crosswalks can cause pedestrians to trip and fall, leading to injuries such as sprains, fractures, and head trauma. These accidents can have serious consequences, particularly for the elderly.',
        },
        {
          title: 'Accessibility Issues',
          desc: 'Surface damage can create barriers for people with mobility impairments, making it difficult or even impossible to navigate sidewalks and streets safely. This can limit their access to essential services and contribute to social exclusion.',
        },
      ],
    },
    {
      id: 4,
      title: 'Economic Impact',
      subtitle: 'Financial strain on citizens and municipal budgets',
      icon: DollarSign,
      badge: 'Financial Strain',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/10',
      points: [
        {
          title: 'Increased Repair Costs',
          desc: 'Delaying pothole repairs can result in more extensive damage to roads and vehicles, leading to higher repair costs for both municipalities and individuals. This can strain public budgets and individual finances.',
        },
        {
          title: 'Insurance Claims',
          desc: 'Frequent vehicle damage from potholes can lead to increased insurance claims, driving up premiums for everyone. Higher premiums can impact drivers’ affordability and financial stability.',
        },
        {
          title: 'Decreased Property Values',
          desc: 'Poor road conditions can negatively impact property values in affected areas, discouraging investment and economic growth. Well-maintained roads are essential for sustaining property values and community development.',
        },
      ],
    },
    {
      id: 5,
      title: 'Long-term Infrastructure Damage',
      subtitle: 'Deep structural decay beneath road foundations',
      icon: Building2,
      badge: 'Structural Decay',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      points: [
        {
          title: 'Underlying Subsurface Problems',
          desc: 'Potholes can signal problems with the road’s foundation, which, if left unaddressed, can lead to more severe and costly repairs. Addressing these foundational issues is crucial for maintaining road integrity.',
        },
        {
          title: 'Accelerated Deterioration',
          desc: 'Potholes can accelerate the deterioration of road surfaces, shortening their lifespan and necessitating more frequent resurfacing and maintenance. Proactive repair can help extend the lifespan of roadways.',
        },
      ],
    },
    {
      id: 6,
      title: 'Environmental Impact',
      subtitle: 'Increased carbon output and water channel pollution',
      icon: Leaf,
      badge: 'Eco Footprint',
      color: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      bgColor: 'bg-teal-500/10',
      points: [
        {
          title: 'Increased Emissions',
          desc: 'Damaged roads can lead to increased vehicle emissions as drivers may need to accelerate or decelerate suddenly to avoid potholes. This can exacerbate air pollution and contribute to climate change.',
        },
        {
          title: 'Runoff Pollution',
          desc: 'Potholes can collect and trap rainwater, which may carry pollutants like oil, chemicals, and debris into storm drains and waterways, negatively impacting local ecosystems and water quality.',
        },
      ],
    },
    {
      id: 7,
      title: 'Traffic Congestion',
      subtitle: 'Bottlenecks and severe transit delay ripples',
      icon: TrafficCone,
      badge: 'Transit Bottleneck',
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/10',
      points: [
        {
          title: 'Disruptive Traffic Flow',
          desc: 'Drivers slowing down or swerving to avoid potholes can disrupt the flow of traffic, leading to increased congestion and delays.',
        },
        {
          title: 'Increased Accident Rates',
          desc: 'The accidents caused by potholes can lead to traffic jams and road closures, further contributing to congestion and travel delays.',
        },
      ],
    },
    {
      id: 8,
      title: 'Public Health',
      subtitle: 'Psychological stress and emergency response delays',
      icon: HeartPulse,
      badge: 'Public Wellness',
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      bgColor: 'bg-rose-500/10',
      points: [
        {
          title: 'Stress and Anxiety',
          desc: 'The danger of encountering potholes and the potential for vehicle damage can cause stress and anxiety for drivers and commuters. Frequent pothole-related incidents can also contribute to overall vehicular stress.',
        },
        {
          title: 'Emergency Response Delays',
          desc: 'Poor road conditions can slow down emergency response times for ambulances, fire trucks, and other critical services, potentially impacting public health and safety.',
        },
      ],
    },
    {
      id: 9,
      title: 'Economic Productivity',
      subtitle: 'Commercial travel delays and fleet maintenance costs',
      icon: Briefcase,
      badge: 'Productivity Drag',
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      bgColor: 'bg-indigo-500/10',
      points: [
        {
          title: 'Increased Travel Time',
          desc: 'Traffic disruptions and vehicle damage can lead to increased travel times, reducing productivity for businesses and individuals. Delays in transportation can affect delivery schedules and overall efficiency.',
        },
        {
          title: 'Higher Operational Costs',
          desc: 'Businesses with fleet vehicles may experience increased operational costs due to vehicle repairs and maintenance caused by potholes. This can impact profitability and lead to higher costs for consumers.',
        },
      ],
    },
    {
      id: 10,
      title: 'Quality of Life',
      subtitle: 'Diminished urban mobility and community aesthetic',
      icon: Smile,
      badge: 'Civic Well-being',
      color: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      bgColor: 'bg-sky-500/10',
      points: [
        {
          title: 'Reduced Mobility',
          desc: 'Poor road conditions can limit mobility for residents, especially those who rely on public transportation or have limited access to personal vehicles. This can affect their ability to access employment, education, and essential services.',
        },
        {
          title: 'Decreased Community Appeal',
          desc: 'Roads in disrepair can detract from the overall appeal of a community, affecting residents’ pride and potentially deterring new residents or businesses from moving into the area.',
        },
      ],
    },
  ];

  const filteredCategories = activeTab === 'all' 
    ? categories 
    : categories.filter((c) => c.id === activeTab);

  return (
    <div className="space-y-10 py-2" id="impact-page-wrapper">
      
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--accent-primary)]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3.5 py-1.5 text-xs font-bold text-[var(--accent-primary)] shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>THE 10 DIMENSIONS OF ROAD HAZARDS</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Why Our Solution is <span className="text-gradient">Innovative & Impactful</span>
          </h1>

          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            Road damage may seem like a minor inconvenience, but its impact is far from trivial. From damaging vehicles and endangering human lives to contributing to economic strain and environmental harm, the dangers extend well beyond their surface appearance.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)]/80 px-4 py-2.5 backdrop-blur-md">
              <Cpu className="h-4 w-4 text-[var(--accent-primary)]" />
              <span className="text-xs font-semibold text-white">AI-Driven Hazard Detection</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)]/80 px-4 py-2.5 backdrop-blur-md">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Real-Time Priority Indexing</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)]/80 px-4 py-2.5 backdrop-blur-md">
              <Layers className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold text-white">Proactive Municipal Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="impact-category-filter">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-indigo-950/40'
              : 'border border-[var(--border-glass)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          <span>All 10 Categories</span>
        </button>

        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                  : 'border border-[var(--border-glass)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* CATEGORY GRID & DETAILED CONTENT */}
      <div className="space-y-8" id="impact-content-grid">
        {filteredCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-[var(--accent-primary)]/40"
            >
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.bgColor} ${cat.color} border ${cat.borderColor} shadow-inner`}>
                    <Icon className="h-6 w-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                      Dimension {cat.id} of 10
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {cat.id}. {cat.title}
                    </h2>
                  </div>
                </div>

                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${cat.bgColor} ${cat.color} ${cat.borderColor}`}>
                  {cat.badge}
                </span>
              </div>

              {/* Grid with image (if available) and points list */}
              <div className={`grid gap-8 ${cat.image ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
                
                {/* Visual Image Showcase Card */}
                {cat.image && (
                  <div className="lg:col-span-5 relative group/img overflow-hidden rounded-2xl border border-[var(--border-glass)] shadow-2xl h-64 lg:h-full min-h-[220px]">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">Visual Telemetry</span>
                      <p className="text-xs font-medium text-zinc-200 mt-0.5">{cat.subtitle}</p>
                    </div>
                  </div>
                )}

                {/* Sub-Points breakdown */}
                <div className={`${cat.image ? 'lg:col-span-7' : 'grid sm:grid-cols-2 gap-4'}`}>
                  <div className={`${cat.image ? 'space-y-4' : 'contents'}`}>
                    {cat.points.map((pt, pIdx) => (
                      <div
                        key={pIdx}
                        className="rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-base)]/70 p-4.5 backdrop-blur-sm transition-all hover:bg-[var(--bg-surface-elevated)]"
                      >
                        <div className="flex items-center gap-2 font-display text-sm font-semibold text-white mb-1.5">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 ${cat.color}`} />
                          <span>{pt.title}</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-6">
                          {pt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* WHY OUR SOLUTION IS INNOVATIVE & IMPACTFUL - CONCLUSION SECTION */}
      <section className="relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-12 shadow-2xl overflow-hidden" id="solution-conclusion-block">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>THE INNOVATIVE SOLUTION</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Proactive Prevention through <span className="text-emerald-400">Advanced Pothole Radar</span> Technology
            </h2>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Road damage may seem like a minor inconvenience, but its impact is far from trivial. Preventing these issues through proactive maintenance, infrastructure investment, and the adoption of advanced technologies is crucial. By focusing on innovations that stop these problems from occurring in the first place, we can significantly reduce their frequency.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)] p-3.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shrink-0 mt-0.5">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Automated Priority Indexing</h4>
                  <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Algorithmic scoring weights severe depth, community upvotes, and traffic density to ensure urgent hazards receive immediate council dispatch.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)] p-3.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Full Cycle Transparency & Governance</h4>
                  <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Citizens and engineers share a single source of truth from initial photo proof submission to status acknowledgment and final road repair.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#/report"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] px-6 py-3 text-xs font-bold text-white shadow-xl transition-all active:scale-95"
              >
                <span>Report a Hazard Now</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-[var(--border-glass)] shadow-2xl h-80 lg:h-full min-h-[300px]">
            <img
              src={smartSolutionImg}
              alt="Smart Infrastructure Solution"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Next-Gen Civic Infrastructure</span>
              <h3 className="font-display text-base font-bold mt-1">Safeguarding Communities & Ensuring Safer Journeys</h3>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
