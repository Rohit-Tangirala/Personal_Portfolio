import { useState, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight, Code, Tag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "../types";
import portfolioStyles from "../styles/Portfolio.module.css";

interface ProjectShowcaseProps {
  refreshTrigger: number;
}

export default function ProjectShowcase({ refreshTrigger }: ProjectShowcaseProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("fallback");

  const categories = ["All", "System / Infrastructure", "Collaboration / Systems", "IoT & Embedded"];

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const result = await res.json();
      setProjects(result.data || []);
      setDataSource(result.source || "fallback");
      setErrorInfo(null);
    } catch (err: any) {
      console.warn("Could not retrieve projects list from backend:", err);
      setErrorInfo(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, projects]);

  return (
    <div id="project-showcase-section" className="space-y-8">
      {/* Category Filter and Metadata Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all clickable-cursor ${
                activeCategory === cat
                  ? "bg-white text-black font-semibold shadow-md"
                  : "bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat === "All" ? "All Labs" : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>DATA SOURCE:</span>
          <span className="text-zinc-300 font-semibold uppercase tracking-wider">{dataSource}</span>
        </div>
      </div>

      {/* Grid Layout of project cards */}
      {isLoading ? (
        <div className="text-center py-20 font-mono text-xs text-zinc-500 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          Querying project index...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/2">
          <p className="text-sm text-zinc-400">No labs matching category found.</p>
        </div>
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p, index) => {
              // Convert tags to array
              const tagsArray = p.tags ? p.tags.split(",").map(t => t.trim()) : [];

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="group bg-[#161616] border border-[#222222] hover:border-[#3a3a3a] rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between clickable-cursor"
                >
                  <div>
                    {/* Visual Preview Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 border-b border-[#222222]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/90 via-transparent to-transparent z-10" />
                      <img
                        referrerPolicy="no-referrer"
                        src={p.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded text-[10px] text-zinc-300 font-mono tracking-wider uppercase z-20">
                        {p.category}
                      </div>
                    </div>

                    {/* Meta text content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-2xl font-serif text-white group-hover:text-amber-200 transition-colors">
                          {p.title}
                        </h3>
                        <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>

                      <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Badges footer */}
                  <div className="px-5 pb-5 pt-0 flex flex-wrap gap-1.5">
                    {tagsArray.map((tag, i) => (
                      <span key={i} className={`px-2 py-0.5 text-[10px] rounded text-zinc-400 bg-white/5 border border-white/5 ${portfolioStyles.metaText}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Aesthetic Overlay Modal for Detailed project views */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#0d0d0e] border border-[#222222] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image banner */}
              <div className="relative h-60 w-full overflow-hidden bg-zinc-900 border-b border-[#222222]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-transparent to-transparent z-10" />
                <img
                  referrerPolicy="no-referrer"
                  src={selectedProject.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Close Button top-right */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 hover:border-white/35 flex items-center justify-center text-white text-sm transition-all cursor-pointer clickable-cursor"
                >
                  ✕
                </button>

                <div className="absolute bottom-4 left-6 z-20">
                  <span className="text-[10px] tracking-widest font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase mb-2 inline-block">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-4xl font-serif text-white tracking-tight leading-none">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Detailed narrative content */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-zinc-500 tracking-wider">PROJECT CORE ANALYSIS</h4>
                  <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                    {selectedProject.long_description}
                  </p>
                </div>

                {/* Tags section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-zinc-500 tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    BUILT WITH SPECIFICATIONS
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedProject.tags.split(",").map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-white">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer anchor buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <a
                    href={selectedProject.github_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 hover:bg-white/5 text-zinc-300 text-xs font-semibold rounded-lg border border-white/10 transition-colors clickable-cursor"
                  >
                    <Github className="w-4 h-4" />
                    Source Repository
                  </a>
                  <a
                    href={selectedProject.live_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-semibold rounded-lg shadow-md transition-colors clickable-cursor"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
