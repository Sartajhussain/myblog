import React, { useState } from "react";
import missionImg from "../assets/mission.jpg";
import storyImg from "../assets/story.jpg";
import sartaj from "../assets/sartaj-2.jpeg";
import pdf from "../assets/sartaj-frontend_dev.pdf";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaDownload,
  FaCode,
  FaRocket,
  FaUsers,
  FaTimes,
  FaExternalLinkAlt,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa";

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdf;
    link.download = "Sartaj_Hussain_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const projects = [
    {
      title: "MERN Blog App",
      desc: "Full-stack blog with JWT role-based authorization and complete CRUD REST APIs.",
      link: "https://blog-application-774e.onrender.com/",
      tech: ["React.js", "Nodejs", "MERN Stack", "Atlas", "Render"],
    },
    {
      title: "Eragento - Premium Bags",
      desc: "Full-featured international e-commerce storefront with secure payment gateways.",
      link: "https://eragento.com.au/",
      tech: ["Php", "CodeIgniter", "MySQL", "reactjs", "javascript"],
    },
    {
      title: "Spirit Masters - Bartending",
      desc: "Professional corporate website with polished service pages and custom booking UI.",
      link: "https://www.spiritmasters.in/",
      tech: ["Php", "CodeIgniter", "MySQL", "reactjs", "javascript"],
    },
    {
      title: "The Best Cab - Booking",
      desc: "Responsive cab booking platform with vehicle selection and confirmation flow.",
      link: "https://thebestcab.in/",
      tech: ["React", "Redux", "Tailwind CSS", "Node.js", "MongoDB"],
    },
    {
      title: "Komplytek Academy - E-Learning",
      desc: "E-learning e-commerce platform supporting course purchases and access management.",
      link: "https://komplytek.com/academy/",
      tech: ["Php", "CodeIgniter", "MySQL", "reactjs"],
    },
  ];

  const techStack = [
    "React.js",
    "Redux Toolkit",
    "JavaScript (ES6+)",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "MongoDB",
    "RESTful APIs",
    "Git / GitHub",
    "JWT Auth",
    "Responsive Design",
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans selection:bg-[oklch(0.71_0.2_46.45)] selection:text-white transition-colors duration-300 bg-slate-950 text-slate-100">

      {/* =====================================================
          BACKGROUND — orange theme glows + grid
      ===================================================== */}

      {/* Orange glow — top-left */}
      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.08] rounded-full blur-3xl animate-blob" />

      {/* Orange lighter — top-right */}
      <div className="pointer-events-none absolute top-[150px] right-[-120px] w-[500px] h-[500px] bg-[oklch(0.8_0.15_60)] opacity-[0.08] rounded-full blur-3xl animate-blob animation-delay-2000" />

      {/* Orange glow — mid-left */}
      <div className="pointer-events-none absolute top-[900px] left-[10%] w-[450px] h-[450px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Orange glow — bottom-right */}
      <div className="pointer-events-none absolute bottom-[300px] right-[5%] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.07] rounded-full blur-3xl animate-blob" />

      {/* Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "white",
        }}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center py-20">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 items-center w-full">

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs font-semibold tracking-wide text-[oklch(0.71_0.2_46.45)]">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.71_0.2_46.45)] animate-ping" />
              AVAILABLE FOR NEW OPPORTUNITIES
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Crafting{" "}
              <span className="bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] via-[oklch(0.8_0.15_60)] to-[oklch(0.71_0.2_46.45)] bg-clip-text text-transparent">
                Digital
              </span>{" "}
              Experiences
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 font-medium">
              Sartaj Hussain —{" "}
              <span className="text-[oklch(0.71_0.2_46.45)]">
                Frontend Developer & MERN Specialist
              </span>
            </p>

            <p className="text-slate-400 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed">
              Passionate about building fast, accessible, and high-performance
              web applications with React. Focused on delivering seamless
              interactive designs for global clients.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={handleDownload}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] text-white font-bold rounded-2xl shadow-lg shadow-[oklch(0.71_0.2_46.45)]/20 hover:shadow-[oklch(0.71_0.2_46.45)]/40 hover:scale-[1.02] transition-all duration-300"
              >
                <FaDownload className="text-white group-hover:translate-y-0.5 transition-transform" />
                Download Resume
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-[oklch(0.71_0.2_46.45)]/40 font-semibold rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              >
                View Live Work
                <FaArrowRight className="text-[oklch(0.71_0.2_46.45)] text-sm" />
              </button>
            </div>
          </div>

          {/* Hero Image & Social Badges */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500" />

              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src={sartaj}
                  alt="Sartaj Hussain"
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>

              <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl flex gap-3">
                <a
                  href="https://www.linkedin.com/in/sartaj-hussain/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-slate-800 hover:bg-[oklch(0.71_0.2_46.45)] text-slate-300 hover:text-white rounded-xl transition-all duration-300 shadow-md hover:-translate-y-1"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin size={20} />
                </a>

                <a
                  href="https://github.com/Sartajhussain"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-slate-800 hover:bg-[oklch(0.71_0.2_46.45)] text-slate-300 hover:text-white rounded-xl transition-all duration-300 shadow-md hover:-translate-y-1"
                  aria-label="GitHub Profile"
                >
                  <FaGithub size={20} />
                </a>

                <a
                  href="https://www.instagram.com/sartaj_mansuri2002"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-slate-800 hover:bg-[oklch(0.71_0.2_46.45)] text-slate-300 hover:text-white rounded-xl transition-all duration-300 shadow-md hover:-translate-y-1"
                  aria-label="Instagram Profile"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="relative z-10 py-12 border-y border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-3xl text-[oklch(0.71_0.2_46.45)] mb-2 flex justify-center">
              <FaCode />
            </div>
            <h3 className="text-4xl font-extrabold text-white">2+ Years</h3>
            <p className="text-slate-400 text-sm mt-1">
              Professional Experience
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-3xl text-[oklch(0.8_0.15_60)] mb-2 flex justify-center">
              <FaRocket />
            </div>
            <h3 className="text-4xl font-extrabold text-white">5+ Live</h3>
            <p className="text-slate-400 text-sm mt-1">
              Production Applications
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-3xl text-[oklch(0.71_0.2_46.45)] mb-2 flex justify-center">
              <FaUsers />
            </div>
            <h3 className="text-4xl font-extrabold text-white">30%</h3>
            <p className="text-slate-400 text-sm mt-1">
              Page Speed Optimization
            </p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT & TECH STACK ================= */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-700" />
            <img
              src={sartaj}
              alt="Developer Workspace"
              className="relative w-full h-[380px] lg:h-[480px] object-cover rounded-3xl border border-slate-800 shadow-2xl"
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[oklch(0.71_0.2_46.45)] text-sm font-semibold tracking-wider uppercase">
                Engineering Philosophy
              </span>
              <h2 className="text-4xl font-bold">Behind The Code</h2>
            </div>

            <p className="text-slate-300 leading-relaxed text-lg">
              I specialize in React.js, Redux, and modern CSS architecture. My
              primary focus is building fluid user experiences backed by
              optimized codebases. I successfully reduced core page render
              times by{" "}
              <span className="font-semibold text-[oklch(0.71_0.2_46.45)]">30%</span> for
              enterprise e-commerce applications.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-200">
                Technologies I Work With
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {techStack.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-[oklch(0.71_0.2_46.45)]/50 hover:text-[oklch(0.71_0.2_46.45)] transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & JOURNEY ================= */}
      <section className="relative z-10 py-20 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <span className="text-[oklch(0.8_0.15_60)] text-sm font-semibold tracking-wider uppercase">
              Background
            </span>
            <h2 className="text-4xl font-bold">My Mission & Journey</h2>
            <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
              <p>
                <strong className="text-white">Mission:</strong> To craft
                intuitive digital products and mentor aspiring developers in
                mastering real-world web applications.
              </p>
              <p>
                <strong className="text-white">Journey:</strong> What started
                with raw HTML/CSS experiments evolved into engineering
                full-scale SaaS platforms and e-commerce ecosystems for clients
                in Australia and India.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 group">
              <img
                src={missionImg}
                alt="Mission Showcase"
                className="rounded-3xl w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= LET'S CONNECT ================= */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 w-full order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 group">
            <img
              src={storyImg}
              alt="Story Showcase"
              className="rounded-3xl w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="lg:w-1/2 space-y-6 order-1 lg:order-2">
          <span className="text-[oklch(0.71_0.2_46.45)] text-sm font-semibold tracking-wider uppercase">
            Collaboration
          </span>
          <h2 className="text-4xl font-bold">Let's Build Something Great</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            From e-commerce solutions like <strong>Eragento</strong> to
            interactive platforms like <strong>Komplytek Academy</strong>, I
            take ownership from UI architecture to backend integration.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed">
            Available for high-impact frontend roles and specialized client
            projects.
          </p>

          <div className="pt-4">
            <a
              href="mailto:sartajhusain770@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[oklch(0.71_0.2_46.45)] hover:bg-[oklch(0.65_0.2_46.45)] text-white font-bold rounded-2xl shadow-lg shadow-[oklch(0.71_0.2_46.45)]/20 transition-all duration-300 hover:scale-[1.02]"
            >
              <FaEnvelope /> Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Live Client Projects
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Featured production projects built and deployed
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-[oklch(0.71_0.2_46.45)] rounded-xl transition-colors"
                aria-label="Close Modal"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="group bg-slate-950/60 border border-slate-800 hover:border-[oklch(0.71_0.2_46.45)]/40 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-[oklch(0.71_0.2_46.45)] transition-colors">
                          {project.title}
                        </h3>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-900 hover:bg-[oklch(0.71_0.2_46.45)] hover:text-white text-slate-400 rounded-lg transition-colors"
                          aria-label={`Visit ${project.title}`}
                        >
                          <FaExternalLinkAlt size={14} />
                        </a>
                      </div>
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        {project.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-900 border border-slate-800 text-[oklch(0.71_0.2_46.45)] px-3 py-1 rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-slate-800 flex justify-end bg-slate-900">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;