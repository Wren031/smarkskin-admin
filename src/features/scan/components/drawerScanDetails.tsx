import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Calendar, User, FileText, Microscope, Download, 
  ExternalLink, Activity, ChevronDown, ChevronUp,
  Droplets, ShieldAlert, Target, ScanFace, ShoppingBag 
} from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scan: any; 
}

export default function ScanDetailsDrawer({ isOpen, onClose, scan }: DrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!scan) return null;

  const isConcern = scan.overall_severity?.toLowerCase() !== 'healthy';
  const formattedDate = new Date(scan.created_at).toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000]"
          />
          
          {/* Drawer Container */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[700px] bg-[#F8FAFC] shadow-2xl z-[1001] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-lg">
                  <ScanFace size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">Clinical Facial Analysis</h2>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold border border-slate-200">
                      V2.4 AI-CORE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    ID: <span className="text-slate-900 font-bold">#{scan.id?.toString().padStart(6, '0')}</span>
                  </p>
                </div>
              </div>
              
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Profile Overview */}
              <section className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-5 flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-slate-400 rounded-[50%] blur opacity-10" />
                    <div className="relative w-48 h-56 rounded-[50%] overflow-hidden border-4 border-white shadow-lg">
                      <img src={scan.image_url} alt="Patient Scan" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950 p-1.5 rounded-full border border-white shadow-lg">
                      <Target size={14} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="col-span-7 grid grid-cols-2 gap-2">
                  <div className="col-span-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">Patient Data</h3>
                  </div>
                  <InfoPlate icon={<User size={12}/>} label="Full Name" value={scan.user_name} />
                  <InfoPlate icon={<Calendar size={12}/>} label="Date" value={formattedDate} />
                  <InfoPlate icon={<Activity size={12}/>} label="Status" value={isConcern ? "Review Required" : "Optimal"} />
                  <InfoPlate icon={<ShieldAlert size={12}/>} label="Security" value="Encrypted" />
                </div>
              </section>

              {/* Vital Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <MetricCard icon={<Droplets size={16}/>} label="Skin Type" value={scan.skin_type || "Standard"} theme="blue" />
                <MetricCard icon={<ShieldAlert size={16}/>} label="AI Confidence" value={scan.confidence} theme={isConcern ? "orange" : "emerald"} />
                <MetricCard icon={<Target size={16}/>} label="Health Score" value={`${scan.score}%`} theme="black" />
              </div>

              {/* Diagnostic Box */}
              <section className="bg-white rounded-xl p-3.5 border border-slate-200 relative overflow-hidden">
                <Microscope size={32} className="absolute -right-2 -bottom-2 opacity-5 text-black" />
                <h4 className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Primary Observation</h4>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {scan.conditions?.[0]?.label || "No significant findings"}
                </p>
              </section>

              {/* Treatment Protocol */}
              <motion.section layout className="bg-slate-950 rounded-[1.5rem] p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                      <FileText className="text-slate-300" size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Clinical Protocol</h4>
                      <p className="text-slate-400 text-[9px] uppercase tracking-wider">AI-Recommended Care</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    {isExpanded ? 'Collapse' : 'Details'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <ProtocolItem label="Strategy" content={scan.treatment} />
                  <ProtocolItem label="Precautions" content={scan.precautions} />
                </div>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-6 border-t border-white/10 space-y-6">
                        <div>
                          <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Lifestyle Adjustments</h5>
                          <div className="space-y-1.5">
                            {scan.lifestyle?.map((tip: any, i: number) => (
                              <div key={i} className="flex items-center gap-2.5 p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="w-1 h-1 rounded-full bg-blue-400" />
                                <p className="text-slate-300 text-xs">{tip.title || tip.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recommended Regimen</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {scan.products?.map((prod: any, i: number) => (
                              <div key={i} className="flex flex-col justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/[0.08] transition-all">
                                <div className="flex justify-between items-start mb-2">
                                  <ShoppingBag size={12} className="text-slate-400" />
                                  <ExternalLink size={10} className="text-slate-500" />
                                </div>
                                <div>
                                  <p className="text-white font-bold text-xs leading-tight">{prod.product_name}</p>
                                  <p className="text-slate-500 text-[8px] font-bold uppercase tracking-wider mt-0.5">{prod.type}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </div>

            {/* Footer Actions */}
            <footer className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">End-to-End Encryption Active</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-950 text-white rounded-lg font-bold text-xs hover:bg-black transition-all shadow-lg active:scale-95">
                <Download size={16} />
                Download PDF Report
              </button>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MetricCard({ icon, label, value, theme }: any) {
  const styles: Record<string, string> = {
    black: "bg-slate-950 text-white border-slate-900",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
  };

  return (
    <div className={`p-4 rounded-xl border transition-transform hover:scale-[1.01] ${styles[theme]}`}>
      <div className="flex items-center gap-1.5 mb-1 opacity-80">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

function InfoPlate({ icon, label, value }: any) {
  return (
    <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-center gap-2.5">
      <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md">{icon}</div>
      <div className="min-w-0">
        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">{label}</p>
        <p className="text-[10px] font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function ProtocolItem({ label, content }: any) {
  return (
    <div className="space-y-1">
      <h5 className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{label}</h5>
      <p className="text-slate-300 text-xs leading-relaxed">
        {content || "Standard clinical protocol applies."}
      </p>
    </div>
  );
}