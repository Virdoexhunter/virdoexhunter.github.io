import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon, ShieldCheck, Cpu, Trophy, Mail } from "lucide-react";
import { useSubmitContact } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";

type SectionType = "profile" | "experience" | "skills" | "achievements" | "contact" | null;

interface TerminalOverlayProps {
  section: SectionType;
  onClose: () => void;
}

export function TerminalOverlay({ section, onClose }: TerminalOverlayProps) {
  return (
    <AnimatePresence>
      {section && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none"
        >
          <div className="w-full max-w-4xl h-full max-h-[80vh] bg-black/90 border border-primary/50 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.1)] backdrop-blur-sm overflow-hidden flex flex-col pointer-events-auto relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/30">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-primary uppercase tracking-widest">
                  ROOT@MAINFRAME:~/{section?.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-primary/70 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm md:text-base relative custom-scrollbar">
              <div className="scanline absolute inset-0 pointer-events-none" />
              
              <ContentRouter section={section} />
              
            </div>
            
            {/* Footer Status Bar */}
            <div className="px-4 py-1 bg-primary/5 border-t border-primary/20 flex justify-between text-[10px] text-primary/50 font-mono uppercase">
              <span>System: ONLINE</span>
              <span>Encrypted Connection: TLS 1.3</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContentRouter({ section }: { section: SectionType }) {
  switch (section) {
    case "profile":
      return <ProfileContent />;
    case "experience":
      return <ExperienceContent />;
    case "skills":
      return <SkillsContent />;
    case "achievements":
      return <AchievementsContent />;
    case "contact":
      return <ContactContent />;
    default:
      return null;
  }
}

function ProfileContent() {
  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary animate-pulse">
           <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-primary font-bold tracking-tighter">DEEPAK DHIMAN</h1>
          <p className="text-xl text-primary/80 font-mono mt-1">Application Security Engineer</p>
        </div>
      </div>

      <div className="space-y-4 font-mono">
        <p className="typing-effect">
          <span className="text-accent">{">"}</span> Security researcher and application-security engineer with 5+ years of hands-on experience across web, API, mobile (Android/iOS) and microservice environments.
        </p>
        <p>
          <span className="text-accent">{">"}</span> Offensive-first testing, threat modeling and secure-SDLC practices to find and close real abuse paths in product flows (auth, payments, session management).
        </p>
        <p>
          <span className="text-accent">{">"}</span> Comfortable embedding security into CI/CD, creating POCs and working directly with engineering teams to ship fixes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="p-4 border border-primary/20 bg-primary/5 rounded">
          <h3 className="text-primary font-bold mb-2">EDUCATION</h3>
          <div className="space-y-3">
            <div>
              <p className="text-foreground font-bold text-sm">B. Tech in Computer Science Engineering</p>
              <p className="text-muted-foreground text-xs">Kurukshetra University | 08/2017 – 05/2020</p>
              <p className="text-primary text-xs mt-1">Score: 79%</p>
            </div>
            <div>
              <p className="text-foreground font-bold text-sm">Diploma in Computer Science Engineering</p>
              <p className="text-muted-foreground text-xs">GBN Polytechnic | 08/2015 – 05/2017</p>
              <p className="text-primary text-xs mt-1">Score: 80%</p>
            </div>
          </div>
        </div>
        <div className="p-4 border border-primary/20 bg-primary/5 rounded">
          <h3 className="text-primary font-bold mb-2">EXECUTION STATEMENT</h3>
          <p className="text-muted-foreground text-sm italic">
            "I treat AppSec not as vulnerability listing but as a continuous mapping of how trust breaks in real product flows."
          </p>
        </div>
      </div>
    </div>
  );
}

function ExperienceContent() {
  const experiences = [
    {
      role: "Product Security Consultant",
      company: "Emirates NBD via Forward Defense",
      period: "02/2025 – Present",
      details: [
        "Performed targeted security assessments for web, Android and iOS applications in microservice architectures.",
        "Ran threat modeling sessions from feature ideation to architecture review and translated risks into developer-actionable remediation.",
        "Embedded security checks into sprint cycles and CI/CD pipelines to enable shift-left testing.",
        "Used Semgrep / Checkmarx / Burp Suite Pro for SAST/DAST and SCA for dependency/security supply-chain checks.",
        "Monitored container runtimes and microservice behavior (Sysdig) to detect misconfigurations and runtime anomalies.",
        "Built POCs and exploit chains for auth/payment/session abuse and worked with engineers until issues were fixed.",
        "Reviewed design docs & feature proposals and flagged abuse cases before code was written.",
        "Reverse engineered client-side logic to identify hidden trust assumptions and weak enforcement boundaries.",
        "Created threat scenarios that modelled 'how a malicious actor would chain normal features into exploitation'."
      ]
    },
    {
      role: "Security Consultant",
      company: "Ampcus Cyber",
      period: "02/2024 – 02/2025",
      details: [
        "Conducted web, API and mobile (Android/iOS) security engagements with emphasis on business-logic abuse.",
        "Built automation scripts to remove repetitive manual steps and scale testing.",
        "Led OSINT-driven attack-surface discovery, red-team simulations and social-engineering exercises."
      ]
    },
    {
      role: "Cyber Security Specialist",
      company: "Network Intelligence India",
      period: "10/2021 – 12/2023",
      details: [
        "Led VAPT for Web, Mobile & Infrastructure.",
        "Performed Firewall & WiFi security reviews.",
        "Led OSINT-driven attack-surface discovery and red-team simulations."
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display text-secondary mb-6 border-b border-secondary/30 pb-2 uppercase tracking-widest">
        MISSION_LOGS // EXPERIENCE
      </h2>
      
      <div className="relative border-l-2 border-secondary/20 ml-3 space-y-12">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-secondary" />
            
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
              <h3 className="text-lg font-bold text-foreground tracking-tight">{exp.role}</h3>
              <span className="font-mono text-xs text-secondary bg-secondary/10 px-2 py-1 rounded shrink-0">
                {exp.period}
              </span>
            </div>
            
            <h4 className="text-secondary font-mono text-sm mb-4">@{exp.company}</h4>
            
            <ul className="space-y-2">
              {exp.details.map((detail, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="text-secondary mt-1 shrink-0">::</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsContent() {
  const skillCategories = [
    {
      name: "Application Security & VAPT",
      skills: ["Web", "API", "Mobile (Android/iOS)", "Thick Client", "AD", "Network"]
    },
    {
      name: "DevSecOps & Tools",
      skills: ["CI/CD Security", "Semgrep", "Checkmarx", "Burp Suite Pro", "Sysdig", "Trufflehog", "OWASP ZAP", "Kibana", "Red Panda"]
    },
    {
      name: "Red Teaming & OSINT",
      skills: ["Phishing", "Social Engineering", "Attack Simulations", "OSINT Recon", "Asset Discovery"]
    },
    {
      name: "Specialized Testing",
      skills: ["IoT Pentesting", "MIoT (Medical Devices)", "DICOM", "HL7", "FDA 501", "PACS", "Web LLM Attacks"]
    },
    {
      name: "Standards & Config",
      skills: ["OWASP Top 10", "NIST", "PCI-DSS", "MITRE ATT&CK", "Firewall/WAF Reviews", "IDS/IPS"]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display text-accent mb-6 border-b border-accent/30 pb-2 uppercase tracking-widest">
        SYSTEM_CAPABILITIES // ARSENAL
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category, idx) => (
          <div key={idx} className="bg-accent/5 border border-accent/20 p-5 rounded-lg hover:border-accent/50 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-5 h-5 text-accent group-hover:animate-pulse" />
              <h3 className="text-lg font-bold text-accent font-display tracking-tight">{category.name}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, sIdx) => (
                <span 
                  key={sIdx} 
                  className="px-2 py-1 bg-black border border-accent/30 text-accent/80 text-xs font-mono rounded hover:bg-accent hover:text-black transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsContent() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display text-yellow-500 mb-6 border-b border-yellow-500/30 pb-2 uppercase tracking-widest">
        HALL_OF_FAME // ACHIEVEMENTS
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-lg border border-yellow-500/20">
          <div className="flex items-start gap-4">
            <Trophy className="w-8 h-8 text-yellow-500 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Key Accomplishments</h3>
              <ul className="space-y-3">
                <li className="flex gap-2 text-muted-foreground">
                  <span className="text-yellow-500">★</span>
                  <span>200+ Hall of Fame mentions (Google, Dell, Blackboard, NCIIPC).</span>
                </li>
                <li className="flex gap-2 text-muted-foreground">
                  <span className="text-yellow-500">★</span>
                  <span>Top 10 Hackenproof researcher (2022).</span>
                </li>
                <li className="flex gap-2 text-muted-foreground">
                  <span className="text-yellow-500">★</span>
                  <span>Delivered Project Oman – manual Web/WiFi/Network Pentest in 20 days with client appreciation.</span>
                </li>
                <li className="flex gap-2 text-muted-foreground">
                  <span className="text-yellow-500">★</span>
                  <span>Building a corporate Banking product from scratch in current Organisation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-yellow-500/20 p-4 rounded bg-black/40">
            <h4 className="text-yellow-500 font-mono text-sm mb-3 border-b border-yellow-500/20 pb-2">
              [ PUBLICATIONS & MEDIA ]
            </h4>
            <ul className="space-y-2 text-sm text-foreground/80 font-mono">
              <li className="flex items-center gap-2">• Interview with XSSRAT (2023)</li>
              <li className="flex items-center gap-2">• Security write-ups on Medium</li>
              <li className="flex items-center gap-2">• Contributor to GitHub HowToHunt repo</li>
              <li className="flex items-center gap-2">• YouTube (Virdoex) Bug Hunting</li>
              <li className="flex items-center gap-2">• Podcast: The Cyber Explorers</li>
            </ul>
          </div>

          <div className="border border-yellow-500/20 p-4 rounded bg-black/40">
            <h4 className="text-yellow-500 font-mono text-sm mb-3 border-b border-yellow-500/20 pb-2">
              [ CERTIFICATIONS ]
            </h4>
            <ul className="space-y-2 text-sm text-foreground/80 font-mono">
              <li className="flex items-center gap-2">• eWPTXv2 – Adv Web Pentesting</li>
              <li className="flex items-center gap-2">• eCPPT v2 – Pentesting Prof</li>
              <li className="flex items-center gap-2">• API Penetration Testing</li>
              <li className="flex items-center gap-2">• Certified AppSec Practitioner</li>
              <li className="flex items-center gap-2">• Threat Modeling Security Fundamentals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactContent() {
  const submit = useSubmitContact();
  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertMessage) => {
    submit.mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display text-primary mb-6 border-b border-primary/30 pb-2 uppercase tracking-widest">
        ESTABLISH_UPLINK // CONTACT
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm text-muted-foreground mb-6 font-mono">
            Initiate a secure communication channel. All messages are encrypted end-to-end.
            Available for consulting, security audits, and speaking engagements.
          </p>
          
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-primary/80">
                <Mail className="w-5 h-5" />
                <span className="font-mono">virdoexhunter@gmail.com</span>
             </div>
             <div className="flex items-center gap-3 text-primary/80">
                <span className="font-mono text-xs">LOC: Bellandur, Bengaluru 560103</span>
             </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Identity Name</label>
            <input 
              {...form.register("name")}
              className="w-full bg-black border border-primary/30 rounded p-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-sm"
              placeholder="Enter your name..."
            />
            {form.formState.errors.name && (
              <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Return Address (Email)</label>
            <input 
              {...form.register("email")}
              className="w-full bg-black border border-primary/30 rounded p-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-sm"
              placeholder="user@domain.com"
            />
             {form.formState.errors.email && (
              <span className="text-xs text-destructive">{form.formState.errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Payload (Message)</label>
            <textarea 
              {...form.register("message")}
              rows={4}
              className="w-full bg-black border border-primary/30 rounded p-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-sm"
              placeholder="Type your message..."
            />
             {form.formState.errors.message && (
              <span className="text-xs text-destructive">{form.formState.errors.message.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submit.isPending}
            className="w-full py-2 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submit.isPending ? (
              <>
                <span className="animate-pulse">Encrypting...</span>
              </>
            ) : (
              "Transmit Data"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
