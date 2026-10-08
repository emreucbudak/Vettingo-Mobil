import { Job } from "../../domain/entities/Job";

export const jobs: Job[] = [
  {
    id: "vp-engineering-acme",
    title: "VP of Engineering",
    company: "Acme Corp",
    location: "Remote (US)",
    salary: "$200k - $250k",
    match: 95,
    tags: ["B2B SaaS", "Series C", "Team scaling"],
  },
  {
    id: "director-engineering-globex",
    title: "Director of Engineering",
    company: "Globex",
    location: "New York / Hybrid",
    salary: "$180k - $220k",
    match: 88,
    tags: ["Fintech", "Public", "Cloud Infrastructure"],
  },
  {
    id: "head-platform-northstar",
    title: "Head of Platform Engineering",
    company: "Northstar Labs",
    location: "Remote (Europe)",
    salary: "$190k - $230k",
    match: 84,
    tags: ["Series B", "Developer Tools", "Kubernetes"],
  },
];
export const recommendations: Job[] = [
  {
    id: "vercel",
    title: "Lead UI Developer",
    company: "Vercel",
    location: "Remote",
    salary: "$160k - $210k",
    match: 94,
    tags: ["React", "TypeScript"],
  },
  {
    id: "plaid",
    title: "Senior Software Engineer",
    company: "Plaid",
    location: "New York (Hybrid)",
    salary: "$180k - $230k",
    match: 88,
    tags: ["Fintech", "React"],
  },
];
