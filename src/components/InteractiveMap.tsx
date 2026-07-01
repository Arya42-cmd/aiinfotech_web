import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Phone, Mail, Globe } from "lucide-react";

interface OfficeLocation {
  id: string;
  name: string;
  type: string;
  coords: { x: number; y: number }; // Percentage coords on our SVG map
  address: string;
  phone: string;
  email: string;
  timezone: string;
  hours: string;
  staff: string;
}

const offices: OfficeLocation[] = [
  {
    id: "chennai",
    name: "Chennai, India",
    type: "Global Headquarters",
    coords: { x: 50, y: 50 }, // Adjusted coordinates
    address: "AI INFOTECH, 73, 2nd Main Rd, Mahalakshmi Nagar, Chennai, Mudichur, Tamil Nadu 600048",
    phone: "+91 98500 22377",
    email: "info@aiinfotech.co.in",
    timezone: "Asia/Kolkata",
    hours: "09:00 - 18:30 IST",
    staff: "Technical QA & Dev Specialists"
  },
  {
    id: "sf-map",
    name: "View on Google Maps",
    type: "Location Link",
    coords: { x: 50, y: 50 },
    address: "Click to open in Google Maps",
    phone: "N/A",
    email: "N/A",
    timezone: "Asia/Kolkata",
    hours: "N/A",
    staff: "N/A"
  }
];

interface InteractiveMapProps {
  isDark?: boolean;
}

export default function InteractiveMap({ isDark = false }: InteractiveMapProps) {
  const [activeOffice, setActiveOffice] = useState<OfficeLocation>(offices[0]);
  const [localTimes, setLocalTimes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const updateTimes = () => {
      const times: { [key: string]: string } = {};
      offices.forEach((office) => {
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: office.timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          });
          times[office.id] = formatter.format(new Date());
        } catch {
          times[office.id] = "00:00:00";
        }
      });
      setLocalTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOfficeClick = (office: OfficeLocation) => {
    if (office.id === "sf-map") {
      window.open("https://www.google.com/maps/place/AI+INFOTECH,+73,+2nd+Main+Rd,+Mahalakshmi+Nagar,+Chennai,+Mudichur,+Tamil+Nadu+600048/data=!4m2!3m1!1s0x3a525d6d5d07b039:0x8f279f95fda37e56!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESCDI2LjI0LjEwGAAg14IDKqkBLDk0MjY3NzI3LDk0MjkyMTk1LDk0Mjk5NTMyLDEwMDc5NjQ5OCwxMDA3OTc3NjEsMTAwNzk2NTM1LDEwMDgyMjEwOSw5NDI4MDU3Niw5NDIwNzM5NCw5NDIwNzUwNiw5NDIwODUwNiw5NDIxODY1Myw5NDIyOTgzOSw5NDI3NTE2OCw5NDI3OTYxOSwxMDA3OTI1NzIsMTAwODIwMjMyLDEwMDgwNDk3NkICSU4%3D&skid=b22c2b5b-3fd9-4175-a050-5773f1a2f711&g_st=aw", "_blank");
    } else {
      setActiveOffice(office);
    }
  };

  const containerClass = isDark
    ? "bg-slate-900/40 border-slate-800"
    : "bg-white shadow-sm border-slate-200";

  const mapBgClass = isDark
    ? "bg-slate-950/80 border-slate-800/80"
    : "bg-slate-50 border-slate-200/80 shadow-xs";

  const gridLineBg = `linear-gradient(to right, ${isDark ? "#1e293b" : "#e2e8f0"} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? "#1e293b" : "#e2e8f0"} 1px, transparent 1px)`;
  const continentClass = isDark ? "text-slate-800/20" : "text-slate-300/40";
  const pinUnselectedClass = isDark
    ? "bg-slate-900 border-slate-700 text-slate-400"
    : "bg-white border-slate-250 text-slate-500 hover:border-slate-400 hover:text-slate-700 shadow-xs";

  const hoverLabelClass = isDark
    ? "bg-slate-950/90 text-white border-slate-800"
    : "bg-white text-slate-900 border-slate-200 shadow-md";

  const titleBorderClass = isDark ? "border-slate-800 pb-4" : "border-slate-200 pb-4";
  const textTitleClass = isDark ? "text-white" : "text-slate-900";
  const textMutedClass = isDark ? "text-slate-500" : "text-slate-500";
  const textValueClass = isDark ? "text-slate-300" : "text-slate-700";

  const clockCardClass = isDark
    ? "bg-slate-950/60 border-slate-800/80"
    : "bg-slate-50 border-slate-200/80 shadow-xs";

  const clockTimeClass = isDark
    ? "bg-slate-900 text-white border-slate-800"
    : "bg-white text-slate-900 border-slate-200 shadow-xs";

  const iconWrapperClass = isDark
    ? "bg-slate-950 border-slate-800 text-slate-400"
    : "bg-white border-slate-250 text-slate-500 shadow-xs";

  const capacityClass = isDark
    ? "bg-gradient-to-r from-blue-950/20 to-cyan-950/20 border-blue-900/40"
    : "bg-gradient-to-r from-blue-50/40 to-cyan-50/40 border-blue-200/50";

  const staffBadgeClass = isDark
    ? "bg-slate-950/80 text-white border-slate-800"
    : "bg-white text-slate-800 border-slate-200 shadow-xs";

  return (
    <div id="interactive-map-container" className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl border backdrop-blur-md ${containerClass}`}>
      {/* Interactive Map Visual (left 7 cols) */}
      <div className={`lg:col-span-7 relative h-[250px] sm:h-[400px] rounded-2xl border overflow-hidden flex items-center justify-center ${mapBgClass}`}>
        {/* Aesthetic Grid Lines */}
        <div style={{ backgroundImage: gridLineBg }} className="absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Stylized Vector World Map Drawing */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full opacity-35 text-slate-800 select-none pointer-events-none"
          fill="currentColor"
        >
          {/* Extremely simplified, sleek dotted/block world representation */}
          <rect x="50" y="80" width="120" height="60" rx="10" className={continentClass} />
          <rect x="150" y="100" width="100" height="150" rx="10" className={continentClass} />
          <rect x="50" y="220" width="130" height="200" rx="10" className={continentClass} />
          
          <rect x="420" y="80" width="160" height="180" rx="10" className={continentClass} />
          <rect x="540" y="120" width="180" height="200" rx="10" className={continentClass} />
          <rect x="680" y="220" width="120" height="160" rx="10" className={continentClass} />
          <rect x="740" y="80" width="130" height="130" rx="10" className={continentClass} />

          {/* Connective light paths */}
          <path
            d="M 180 175 Q 330 140 480 140 T 680 290"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-accent-primary opacity-30 animate-[dash_20s_linear_infinite]"
          />
          <path
            d="M 480 140 Q 580 215 680 290"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-accent-secondary opacity-30"
          />

          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Global Connection Pulses & Map Pins */}
        {offices.map((office) => {
          const isActive = activeOffice.id === office.id;
          return (
            <button
              key={office.id}
              onClick={() => handleOfficeClick(office)}
              style={{ left: `${office.coords.x}%`, top: `${office.coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
              aria-label={`View office in ${office.name}`}
            >
              {/* Outer pulsing ring */}
              <span className={`absolute -inset-4 rounded-full bg-accent-primary/20 scale-75 ${
                isActive ? "animate-ping opacity-100" : "opacity-0 group-hover:opacity-40 transition-opacity"
              }`} />
              
              {/* Pin point */}
              <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${
                isActive 
                  ? "bg-accent-primary border-white text-white shadow-lg shadow-accent-primary/50 scale-110" 
                  : pinUnselectedClass
              }`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Label above hover */}
              <div className={`absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono px-2 py-0.5 rounded border shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${hoverLabelClass}`}>
                {office.name}
              </div>
            </button>
          );
        })}
        
        {/* Floating Globe stats watermark */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-slate-550 font-mono text-[10px]">
          <Globe className="w-3 h-3 animate-spin [animation-duration:15s]" />
          <span>MULTI-NODE GLOBAL NETWORK ACTIVE</span>
        </div>
      </div>

      {/* Office Information Display (right 5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className={`space-y-1.5 border-b ${titleBorderClass}`}>
          <span className="text-xs font-mono tracking-widest text-accent-primary uppercase font-semibold">
            {activeOffice.type}
          </span>
          <h4 className={`text-2xl font-semibold tracking-tight ${textTitleClass}`}>
            {activeOffice.name}
          </h4>
        </div>

        <div className="space-y-4">
          {/* Live Clock Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${clockCardClass}`}>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent-secondary" />
              <div>
                <p className={`text-[11px] font-mono uppercase tracking-wider ${textMutedClass}`}>Local Business Time</p>
                <p className={`text-sm font-mono font-medium ${textValueClass}`}>{activeOffice.hours}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-lg font-mono font-bold tracking-wide px-2.5 py-1 rounded border ${clockTimeClass}`}>
                {localTimes[activeOffice.id] || "00:00:00"}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="flex gap-3.5 items-start">
            <div className={`p-2 rounded-lg border ${iconWrapperClass}`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${textMutedClass}`}>Office Address</p>
              <p className={`text-xs leading-relaxed mt-0.5 ${textValueClass}`}>{activeOffice.address}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-3.5 items-start">
            <div className={`p-2 rounded-lg border ${iconWrapperClass}`}>
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${textMutedClass}`}>Inbound Direct Dial</p>
              <a href={`tel:${activeOffice.phone.replace(/\s+/g, "")}`} className="text-xs text-accent-primary hover:text-accent-secondary font-semibold transition-colors mt-0.5 block">
                {activeOffice.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-3.5 items-start">
            <div className={`p-2 rounded-lg border ${iconWrapperClass}`}>
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${textMutedClass}`}>E-Mail Address</p>
              <a href={`mailto:${activeOffice.email}`} className="text-xs text-accent-primary hover:text-accent-secondary font-semibold transition-colors mt-0.5 block">
                {activeOffice.email}
              </a>
            </div>
          </div>
        </div>

        {/* Live capacity indicator */}
        <div className={`border p-4 rounded-xl flex items-center justify-between ${capacityClass}`}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            <span className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>Operations Capacity</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded border font-mono ${staffBadgeClass}`}>
            {activeOffice.staff}
          </span>
        </div>
      </div>
    </div>
  );
}
