import React, { useState, useEffect } from "react";
import { Cpu, Globe, ArrowRight, CornerDownRight, Terminal, Sliders, MessageSquare, Archive, Shield, Sparkles, FileDown, GraduationCap, Award, Mail, Phone, ExternalLink, Code2, Layers, Briefcase, Github, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Lenis from "lenis";

import CustomCursor from "./components/CustomCursor";
import ProjectShowcase from "./components/ProjectShowcase";
import ContactForm from "./components/ContactForm";
import portfolioStyles from "./styles/Portfolio.module.css";

export default function App() {
  const [refreshProjects, setRefreshProjects] = useState(0);
  const [refreshMessages, setRefreshMessages] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  const triggerProjectsReload = () => setRefreshProjects(prev => prev + 1);
  const triggerMessagesReload = () => setRefreshMessages(prev => prev + 1);

  const downloadCV = () => {
    window.open("https://drive.google.com/file/d/1rC8DznlHQPXpgk73q5ouBtVzcvZnn_eB/view?usp=sharing", "_blank");
  };

  // Initialize Lenis Smooth Scroll on Mount
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Live clock update
    const interval = setInterval(() => {
      const u = new Date().toUTCString().replace("GMT", "UTC");
      setCurrentTime(u);
    }, 1000);

    return () => {
      lenis.destroy();
      clearInterval(interval);
    };
  }, []);

  // Tracking cursor spotlight coordinate offsets
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    container.style.setProperty("--x", `${x}px`);
    container.style.setProperty("--y", `${y}px`);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden text-[#ededed] space-grid radial-lens selection:bg-white selection:text-black"
      onMouseMove={handleMouseMove}
    >
      <CustomCursor />

      {/* Primary Landing Header */}
      <header className="border-b border-[#222222] py-6 px-4 md:px-12 backdrop-blur-md bg-[#0a0a0c]/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xs tracking-[0.3em] font-medium text-white hover:text-amber-200 transition-colors clickable-cursor">
              ROHIT <span className="text-[#666666]">/</span> LABS 2026
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse hidden sm:block" />
          </div>

          <nav className="hidden md:flex items-center gap-12 text-[11px] tracking-widest text-[#999999]">
            <a href="#lab-projects" className="hover:text-white transition-colors clickable-cursor">PROJECTS</a>
            <a href="#academic-matrix" className="hover:text-white transition-colors clickable-cursor">CREDENTIALS</a>
            <a href="#contact-form-section" className="hover:text-white transition-colors clickable-cursor">CONNECT</a>
          </nav>

          <div className="text-[10px] font-mono text-[#666666] tracking-wider uppercase">
            {currentTime || "ESTABLISHING CHRONOS SYNC..."}
          </div>
        </div>
      </header>

      {/* Main Structural Hero Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-24 space-y-24 relative z-10">
        
        {/* Intro Editorial Segment */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className={`text-[10px] tracking-[0.2em] text-[#666666] ${portfolioStyles.metaText}`}>STUDENT DEVELOPER / PORTFOLIO</span>
              <span className="text-[10px] font-mono text-[#444444]">—</span>
              <span className="text-[10px] font-mono text-amber-500/80 tracking-widest uppercase">CGPA: 9.7</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-[84px] text-white font-normal italic tracking-tighter leading-[0.9] font-serif">
                T.G.S.S. Rohit <br/>
                <span className="sm:ml-16 text-white not-italic font-sans text-sm tracking-[0.15em] font-light text-zinc-500 uppercase block mt-4">
                  Full-Stack Systems Developer & Academic Researcher
                </span>
              </h1>
            </div>

            <div className="max-w-xl sm:ml-16 space-y-6">
              <p className="text-[#999999] text-sm md:text-base leading-relaxed font-light">
                Computer Science undergraduate from <span className="text-white font-normal">Koneru Lakshmaiah Education Foundation (KLH)</span>. I engineer high-integrity web apps, multi-agent automated PR reviewers, and real-time telemetry pipelines. Backed by stable, production-ready relational foundations.
              </p>

              {/* Personal Contact Details block */}
              <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-[11px] font-mono text-[#666666] border-t border-[#222222] pt-4">
                <a href="mailto:2410030030cse@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors clickable-cursor">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> 2410030030cse@gmail.com
                </a>
                <a href="tel:+917816024572" className="flex items-center gap-1.5 hover:text-white transition-colors clickable-cursor">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" /> +91 7816024572
                </a>
                <a href="https://linkedin.com/in/rohit-tangirala-379663206" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors clickable-cursor">
                  <Linkedin className="w-3.5 h-3.5 text-zinc-500" /> Rohit Tangirala
                </a>
              </div>

              {/* CTAs and CV Download Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="#lab-projects" 
                  className="flex items-center gap-2 bg-white text-black hover:bg-[#ededed] text-xs font-bold uppercase py-3 px-5 rounded-lg tracking-wider transition-colors shadow-lg clickable-cursor"
                >
                  Explore Labs
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button 
                  onClick={downloadCV}
                  className="flex items-center gap-2 bg-[#121215] hover:bg-[#19191d] border border-[#2c2c35] text-[#ededed] text-xs font-bold uppercase py-3 px-5 rounded-lg tracking-wider transition-colors clickable-cursor shadow-md"
                >
                  <FileDown className="w-4 h-4 text-green-500 animate-bounce" />
                  Download Resume
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121215]/40 border border-[#222222] rounded-xl p-6 space-y-4">
              <span className="text-[10px] font-mono text-[#666666] tracking-widest uppercase block">DEVELOPER RUNTIME SPEC</span>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[#222222] pb-2">
                  <span className="text-[#666666]">Host Domain:</span>
                  <span className="text-white text-right">KLH Hyderabad</span>
                </div>
                <div className="flex justify-between border-b border-[#222222] pb-2">
                  <span className="text-[#666666]">Current CGPA:</span>
                  <span className="text-white font-semibold">9.7 / 10.0</span>
                </div>
                <div className="flex justify-between border-b border-[#222222] pb-2">
                  <span className="text-[#666666]">Database Engine:</span>
                  <span className="text-white">MySQL (Relational)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Primary Stack:</span>
                  <span className="text-white">React, Express, TS</span>
                </div>
              </div>
            </div>

            {/* Coding Profiles badges block */}
            <div className="bg-[#121215]/20 border border-[#222222] rounded-xl p-4 space-y-2 font-mono text-[11px]">
              <span className="text-[9px] text-[#666666] tracking-wider uppercase block">CODING NETWORK SITES</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <a href="https://github.com/Rohit-Tangirala" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded text-zinc-400 flex items-center justify-center gap-1.5 border border-white/5 clickable-cursor">
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
                <a href="https://leetcode.com/rohiterooze" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded text-zinc-400 flex items-center justify-center gap-1.5 border border-white/5 clickable-cursor">
                  <Code2 className="w-3.5 h-3.5 text-amber-500" /> LeetCode
                </a>
                <a href="https://www.codechef.com/users/hugh_trek_65" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded text-zinc-400 flex items-center justify-center gap-1.5 border border-white/5 clickable-cursor">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" /> CodeChef
                </a>
                <a href="https://codeforces.com/profile/huge_trek_65" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded text-zinc-400 flex items-center justify-center gap-1.5 border border-white/5 clickable-cursor">
                  <Globe className="w-3.5 h-3.5 text-red-400" /> Codeforces
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Continuous Horizontal Ribbon */}
        <section className={portfolioStyles.marqueeContainer}>
          <div className={`py-4 text-sm font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-8 ${portfolioStyles.marqueeContent}`}>
            <span><span className="hover:text-red-400 transition-colors duration-200 cursor-default">Kael Malak</span> ●</span>
            <span><span className="hover:text-cyan-400 transition-colors duration-200 cursor-default">Dimensional</span> ●</span>
            <span><span className="hover:text-violet-400 transition-colors duration-200 cursor-default">Karma</span> ●</span>
            <span><span className="hover:text-pink-400 transition-colors duration-200 cursor-default">Manga</span> ●</span>
            <span><span className="font-sans hover:text-amber-400 transition-colors duration-200 cursor-default">日本語</span> ●</span>
            <span><span className="hover:text-emerald-400 transition-colors duration-200 cursor-default">Open Source</span> ●</span>
            <span><span className="hover:text-sky-400 transition-colors duration-200 cursor-default">Developer</span> ●</span>
            <span><span className="hover:text-blue-400 transition-colors duration-200 cursor-default">Cloud</span> ●</span>
            <span><span className="hover:text-[#ff4f00] transition-colors duration-200 cursor-default">Aiven</span> ●</span>
            <span><span className="hover:text-yellow-400 transition-colors duration-200 cursor-default">hard facts</span> ●</span>
            <span><span className="hover:text-red-400 transition-colors duration-200 cursor-default">Kael Malak</span> ●</span>
            <span><span className="hover:text-cyan-400 transition-colors duration-200 cursor-default">Dimensional</span> ●</span>
            <span><span className="hover:text-violet-400 transition-colors duration-200 cursor-default">Karma</span> ●</span>
            <span><span className="hover:text-pink-400 transition-colors duration-200 cursor-default">Manga</span> ●</span>
            <span><span className="font-sans hover:text-amber-400 transition-colors duration-200 cursor-default">日本語</span> ●</span>
            <span><span className="hover:text-emerald-400 transition-colors duration-200 cursor-default">Open Source</span> ●</span>
            <span><span className="hover:text-sky-400 transition-colors duration-200 cursor-default">Developer</span> ●</span>
            <span><span className="hover:text-blue-400 transition-colors duration-200 cursor-default">Cloud</span> ●</span>
            <span><span className="hover:text-[#ff4f00] transition-colors duration-200 cursor-default">Aiven</span> ●</span>
            <span><span className="hover:text-yellow-400 transition-colors duration-200 cursor-default">hard facts</span> ●</span>
          </div>
        </section>

        {/* Academic Matrix Section */}
        <section id="academic-matrix" className="space-y-8 scroll-mt-24">
          <div className="border-b border-[#222222] pb-4">
            <span className={portfolioStyles.metaText}>CREDENTIALS & COMPONENT MATRIX</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Academic Foundations</h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Investigating the intersections of computer science, relational schemas, system engineering, and intelligent agent parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Timeline Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-green-500" /> Academic Timeline
              </span>

              <div className="space-y-6 relative border-l border-[#222222] pl-6 ml-2">
                {/* Degree 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 border-4 border-[#0d0d0e]" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">B.Tech in Computer Science & Engineering (CSE)</h4>
                      <span className="text-[10px] font-mono text-zinc-500 bg-white/5 py-0.5 px-2 rounded">2024 - 2028</span>
                    </div>
                    <p className="text-xs text-zinc-400">Koneru Lakshmaiah Education Foundation (KLH)</p>
                    <p className="text-[11px] font-mono text-amber-500">CGPA: 9.7 / 10.0 — Hyderabad Principal Scholar</p>
                  </div>
                </div>

                {/* Degree 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border-4 border-[#0d0d0e]" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Intermediate College Instruction</h4>
                      <span className="text-[10px] font-mono text-zinc-500 bg-white/5 py-0.5 px-2 rounded">2022 - 2024</span>
                    </div>
                    <p className="text-xs text-zinc-400">Fiitjee Junior College, Saifabad</p>
                    <p className="text-[11px] font-mono text-zinc-500">Graduation Score: 85% Core PCM Curriculum</p>
                  </div>
                </div>

                {/* Degree 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border-4 border-[#0d0d0e]" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Secondary School Education</h4>
                      <span className="text-[10px] font-mono text-zinc-500 bg-white/5 py-0.5 px-2 rounded">2021 - 2022</span>
                    </div>
                    <p className="text-xs text-zinc-400">Brahm Prakash DAV School, Kanchanbagh</p>
                    <p className="text-[11px] font-mono text-zinc-500">Graduation Score: 90% Board of Certification</p>
                  </div>
                </div>
              </div>

              {/* Achievements block */}
              <div className="pt-4 border-t border-[#222222]/40 space-y-4">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Milestones & Verification
                </span>
                <ul className="space-y-2 text-xs text-zinc-400 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">●</span>
                    <span>AWS Certified Cloud Practitioner <span className="font-mono text-white text-[11px] bg-[#1a1a1f] py-0.5 px-1.5 rounded border border-white/5">(CLF-C02)</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">●</span>
                    <span>NPTEL Certification in Programming in C (Problem-solving fundamentals)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">●</span>
                    <span>Winner Position at <span className="text-white font-normal">IMPACTECH 24-Hour Hackathon</span> hack team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">●</span>
                    <span>Active open-source contributor and hackathon builder on GitHub</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Skills Right Column Matrix */}
            <div className="lg:col-span-6 bg-[#121215]/30 border border-[#222222] rounded-xl p-6 space-y-6">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-500" /> Technical Capability Registers
              </span>

              <div className="space-y-4 font-mono select-none">
                {/* languages */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">LANGUAGES</span>
                    <span className="text-zinc-500">Python, Java, C, JS, TS, SQL</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a23] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>

                {/* frontend */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">FRONTEND / VIEWPORTS</span>
                    <span className="text-zinc-500">React.js, Vite, Tailwind, HTML5, CSS3</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a23] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>

                {/* backend */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">BACKEND / INTERFACES</span>
                    <span className="text-zinc-500">Node, Express, Spring Boot, FastAPI</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a23] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                {/* cloud */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">CLOUD & DEVOPS</span>
                    <span className="text-zinc-500">AWS (CLF-C02), Docker, K8s, Railway</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a23] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>

                {/* databases */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a8a8b2]">DATABASES</span>
                    <span className="text-zinc-500">MySQL, Neo4j Aura, MongoDB</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a23] rounded-full overflow-hidden">
                    <div className="h-full bg-green-500/80 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>

                {/* tools */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a8a8b2]">ML & DESIGN TOOLS</span>
                    <span className="text-zinc-500">Gemini API, PyTorch, Postman, JWT, Git</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a23] rounded-full overflow-hidden">
                    <div className="h-full bg-green-500/80 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/2 border border-amber-500/10 rounded-lg text-xs leading-relaxed text-amber-200/80 flex gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Full-Stack Integrity:</strong> Capable of writing automated code reviews via FastAPI pipelines as well as constructing complex database relationship structures with Neo4j.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Showcase of Projects */}
        <section id="lab-projects" className="space-y-6">
          <div>
            <span className={portfolioStyles.metaText}>INDEXED SHOWCASE</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Active Research Labs</h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Select project nodes to explore deep technical architecture details, system specs, and design components.
            </p>
          </div>
          
          <ProjectShowcase refreshTrigger={refreshProjects} />
        </section>

        {/* Contact form section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <span className={portfolioStyles.metaText}>INTERACTIONS</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight leading-tight">Let's connect</h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Submit your inquiry and outline your project goals, collaboration pitches, or details. I will receive your brief directly in my inbox and respond shortly.
            </p>
          </div>

          <div className="lg:col-span-2">
            <ContactForm onMessageSubmitted={triggerMessagesReload} />
          </div>
        </section>

      </main>

      {/* Footer copyright and specifications */}
      <footer className="border-t border-white/5 py-12 px-4 md:px-12 mt-16 bg-[#0c0c10]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-white font-medium">© 2026 T.G.S.S. Rohit.</span>
            <span className="hidden sm:inline text-[#444444]">•</span>
            <span>All rights reserved. Designed with React + TypeScript + MySQL.</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadCV} 
              className="text-[#999999] hover:text-white transition-all flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded border border-white/5 clickable-cursor"
            >
              <FileDown className="w-3.5 h-3.5" /> Download CV
            </button>
            <span className="text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-ping" />
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
