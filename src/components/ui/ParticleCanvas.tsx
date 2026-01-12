// import { useEffect, useRef } from "react";

// interface ParticleCanvasProps {
//   className?: string;
// }

// export const ParticleCanvas = ({ className = "" }: ParticleCanvasProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let width = canvas.width = canvas.parentElement?.offsetWidth || 800;
//     let height = canvas.height = canvas.parentElement?.offsetHeight || 600;
//     let animationId: number;

//     const brandRGB = "102, 186, 54"; // #66ba36

//     interface Particle {
//       x: number;
//       y: number;
//       vx: number;
//       vy: number;
//       size: number;
//     }

//     const particles: Particle[] = [];
//     const particleCount = 50;

//     for (let i = 0; i < particleCount; i++) {
//       particles.push({
//         x: Math.random() * width,
//         y: Math.random() * height,
//         vx: (Math.random() - 0.5) * 0.3,
//         vy: (Math.random() - 0.5) * 0.3,
//         size: Math.random() * 2 + 1,
//       });
//     }

//     const animate = () => {
//       ctx.clearRect(0, 0, width, height);

//       particles.forEach((p, i) => {
//         p.x += p.vx;
//         p.y += p.vy;

//         if (p.x < 0 || p.x > width) p.vx *= -1;
//         if (p.y < 0 || p.y > height) p.vy *= -1;

//         // Draw dot
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(${brandRGB}, 0.5)`;
//         ctx.fill();

//         // Connections
//         for (let j = i + 1; j < particles.length; j++) {
//           const p2 = particles[j];
//           const dx = p.x - p2.x;
//           const dy = p.y - p2.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);

//           if (dist < 150) {
//             ctx.beginPath();
//             ctx.strokeStyle = `rgba(${brandRGB}, ${0.15 - (dist / 150) * 0.15})`;
//             ctx.lineWidth = 1;
//             ctx.moveTo(p.x, p.y);
//             ctx.lineTo(p2.x, p2.y);
//             ctx.stroke();
//           }
//         }
//       });

//       animationId = requestAnimationFrame(animate);
//     };

//     animate();

//     const handleResize = () => {
//       width = canvas.width = canvas.parentElement?.offsetWidth || 800;
//       height = canvas.height = canvas.parentElement?.offsetHeight || 600;
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />;
// };
