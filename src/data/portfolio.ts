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
    title: "Custom Business Website",
    category: "Web Development",
    description:
      "A professional and fully responsive business website designed to enhance brand presence and convert visitors into leads through a clean and user-friendly interface.",
    image:
      "./images/ecommerce.avif",
    tags: ["React", "Python", "WebSockets", "TensorFlow"],
    metrics: { latency: "-40ms", accuracy: "99.9%", users: "10K+" },
  },
  {
    id: 2,
    title: "AI Automation",
    category: " AI Chatbot Integration",
    description: "An AI-powered chatbot developed to automate customer support by handling common queries and providing instant responses around the clock.",
    image:
      "./images/appdevelopment.jpg",
    tags: ["Vue.js", "GoLang", "Elastic", "Kubernetes"],
    metrics: { endpoints: "1M+", uptime: "99.99%", alerts: "Real-time" },
  },
  {
    id: 3,
    title: "App development",
    category: "AI/ML",
    description:
      "A custom web application built to help teams manage tasks, track progress, and improve productivity through a simple and intuitive interface.",
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

