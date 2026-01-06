export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
};

export const blogCategories = ["All", "AI/ML", "Development", "Design", "Industry", "Company"] as const;

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of AI in Enterprise Software",
    excerpt:
      "Exploring how artificial intelligence is reshaping the enterprise software landscape and what it means for businesses.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    category: "AI/ML",
    author: "Sarah Williams",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    title: "Building Scalable Microservices Architecture",
    excerpt:
      "A comprehensive guide to designing and implementing microservices that can handle millions of requests.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    category: "Development",
    author: "Michael Park",
    date: "Dec 10, 2024",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "Design Systems That Scale",
    excerpt:
      "How we built a design system that maintains consistency across 50+ products and 200+ engineers.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    category: "Design",
    author: "Emily Rodriguez",
    date: "Dec 5, 2024",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Machine Learning in Healthcare: A Case Study",
    excerpt:
      "How we helped a major hospital network reduce diagnostic errors by 40% using AI.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    category: "Industry",
    author: "Alex Chen",
    date: "Nov 28, 2024",
    readTime: "10 min read",
  },
  {
    id: 5,
    title: "Our Journey to 100 Employees",
    excerpt:
      "Lessons learned scaling our team from a garage startup to a global technology company.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    category: "Company",
    author: "Alex Chen",
    date: "Nov 20, 2024",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "Securing Cloud-Native Applications",
    excerpt: "Best practices for building secure applications in a cloud-native world.",
    image:
      "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=800",
    category: "Development",
    author: "Michael Park",
    date: "Nov 15, 2024",
    readTime: "9 min read",
  },
];

