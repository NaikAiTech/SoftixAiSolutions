export type PortfolioProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  metrics: Record<string, string>;
};

export const portfolioCategories = ["All", "AI/ML", "Web", "Mobile", "Enterprise"] as const;

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "Nexus Finance",
    category: "Enterprise",
    description:
      "High-frequency trading engine with AI-powered risk assessment. Reduced latency by 40ms.",
    image:
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "Python", "WebSockets", "TensorFlow"],
    metrics: { latency: "-40ms", accuracy: "99.9%", users: "10K+" },
  },
  {
    id: 2,
    title: "Sentinel Grid",
    category: "Enterprise",
    description: "Cybersecurity visualization platform monitoring 1M+ endpoints in real-time.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tags: ["Vue.js", "GoLang", "Elastic", "Kubernetes"],
    metrics: { endpoints: "1M+", uptime: "99.99%", alerts: "Real-time" },
  },
  {
    id: 3,
    title: "MediCare AI",
    category: "AI/ML",
    description:
      "AI diagnostic assistant for healthcare providers with 95% accuracy in early detection.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "TensorFlow", "React", "HIPAA"],
    metrics: { accuracy: "95%", diagnoses: "50K+", hospitals: "120" },
  },
  {
    id: 4,
    title: "EcoTrack",
    category: "Mobile",
    description: "Sustainability tracking app helping companies reduce their carbon footprint.",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
    tags: ["React Native", "Node.js", "MongoDB"],
    metrics: { downloads: "500K+", reduction: "30%", companies: "200+" },
  },
  {
    id: 5,
    title: "Quantum Analytics",
    category: "AI/ML",
    description: "Predictive analytics platform for retail inventory optimization.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "AWS", "React", "ML"],
    metrics: { savings: "$2M+", accuracy: "94%", retailers: "80" },
  },
  {
    id: 6,
    title: "ConnectHub",
    category: "Web",
    description: "Enterprise collaboration platform with real-time messaging and file sharing.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "PostgreSQL", "WebRTC"],
    metrics: { users: "100K+", messages: "10M+", uptime: "99.9%" },
  },
];

