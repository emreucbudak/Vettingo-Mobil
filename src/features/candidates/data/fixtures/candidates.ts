import { Candidate } from "../../domain/entities/Candidate";

const leadershipExperience = [
  {
    role: "VP of Engineering",
    company: "CloudScale Inc.",
    period: "2020 - Present",
    description:
      "Led a team of 150+ engineers across 4 global offices. Architected migration to microservices, reducing deployment time by 40%.",
  },
  {
    role: "Director of Engineering",
    company: "DataFlow Systems",
    period: "2016 - 2020",
    description:
      "Managed core data pipeline infrastructure. Grew team from 10 to 45.",
  },
];
const education = [
  {
    degree: "M.S. Computer Science",
    institution: "Stanford University",
    period: "2014 - 2016",
  },
  {
    degree: "AWS Certified Solutions Architect",
    institution: "Amazon Web Services",
    period: "2019",
  },
];
export const candidates: Candidate[] = [
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    initials: "SJ",
    role: "VP of Engineering at CloudScale Inc.",
    appliedRole: "Senior Product Designer",
    match: 98,
    stage: "interview",
    skills: [
      { name: "React", level: "Expert", score: 0.95 },
      { name: "System Design", level: "Advanced", score: 0.85 },
      { name: "Leadership", level: "Advanced", score: 0.9 },
      { name: "UX/UI", level: "Expert", score: 0.96 },
      { name: "Figma", level: "Expert", score: 0.92 },
    ],
    summary:
      "Sarah demonstrates exceptional technical leadership, having scaled engineering orgs from 50 to 200+ while maintaining high delivery velocity. Her background in distributed systems aligns with infrastructure overhaul requirements.",
    experiences: leadershipExperience,
    education,
    requirements: [
      { name: "Distributed Systems", result: "EXCEEDS" },
      { name: "Team Scaling", result: "EXCEEDS" },
      { name: "Budget Management", result: "MEETS" },
    ],
  },
  {
    id: "michael-ross",
    name: "Michael Ross",
    initials: "MR",
    role: "Frontend Engineer",
    appliedRole: "Frontend Engineer",
    match: 94,
    stage: "screening",
    skills: [
      { name: "React", level: "Expert", score: 0.94 },
      { name: "TypeScript", level: "Advanced", score: 0.9 },
    ],
    summary:
      "Experienced frontend engineer focused on accessible interfaces, React and TypeScript.",
    experiences: [
      {
        role: "Frontend Engineer",
        company: "TechCorp",
        period: "2021 - Present",
        description:
          "Developed reusable UI components and maintained application performance.",
      },
    ],
    education: [
      {
        degree: "BSc Computer Science",
        institution: "University of Technology",
        period: "2017 - 2021",
      },
    ],
    requirements: [
      { name: "React", result: "EXCEEDS" },
      { name: "TypeScript", result: "MEETS" },
    ],
  },
  {
    id: "zeynep-kaya",
    name: "Zeynep Kaya",
    initials: "ZK",
    role: "Senior Data Analyst",
    appliedRole: "Lead Data Scientist",
    match: 91,
    stage: "offer",
    skills: [
      { name: "Python", level: "Expert", score: 0.95 },
      { name: "SQL", level: "Expert", score: 0.93 },
      { name: "ML", level: "Advanced", score: 0.88 },
    ],
    summary:
      "Veri analizi ve makine öğrenmesi alanlarında deneyimli; analitik sonuçları ürün kararlarına dönüştürüyor.",
    experiences: [
      {
        role: "Senior Data Analyst",
        company: "DataFlow Systems",
        period: "2019 - Present",
        description: "Veri boru hatları ve tahmin modelleri geliştirdi.",
      },
    ],
    education: [
      {
        degree: "İstatistik",
        institution: "İstanbul Üniversitesi",
        period: "2013 - 2017",
      },
    ],
    requirements: [
      { name: "Python", result: "EXCEEDS" },
      { name: "Machine Learning", result: "MEETS" },
    ],
  },
  {
    id: "can-demir",
    name: "Can Demir",
    initials: "CD",
    role: "Engineering Manager",
    appliedRole: "VP of Engineering",
    match: 88,
    stage: "interview",
    skills: [
      { name: "Leadership", level: "Advanced", score: 0.88 },
      { name: "Cloud", level: "Expert", score: 0.92 },
    ],
    summary:
      "Bulut altyapısı ve mühendislik ekiplerinin yönetiminde deneyimli teknoloji lideri.",
    experiences: [
      {
        role: "Engineering Manager",
        company: "CloudScale",
        period: "2020 - Present",
        description:
          "Bulut altyapı ekibinin geliştirme ve operasyon süreçlerini yönetti.",
      },
    ],
    education: [
      {
        degree: "Bilgisayar Mühendisliği",
        institution: "İTÜ",
        period: "2010 - 2014",
      },
    ],
    requirements: [
      { name: "Leadership", result: "MEETS" },
      { name: "Cloud", result: "EXCEEDS" },
    ],
  },
];
export const comparisonCandidates: Candidate[] = [
  {
    ...candidates[0],
    role: "Lead Engineer at TechCorp",
    appliedRole: "Senior Frontend Engineer",
    match: 94,
    skills: candidates[0].skills.slice(0, 3),
    summary:
      "Exceptional architectural background, particularly in scaling micro-frontends.",
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    initials: "MC",
    role: "Senior Dev at InnovateInc",
    appliedRole: "Senior Frontend Engineer",
    match: 88,
    stage: "screening",
    skills: [
      { name: "React", level: "Advanced", score: 0.88 },
      { name: "System Design", level: "Expert", score: 0.92 },
      { name: "Leadership", level: "Intermediate", score: 0.7 },
    ],
    summary:
      "Strong theoretical knowledge of distributed systems and backend integration.",
    experiences: [
      {
        role: "Senior Developer",
        company: "InnovateInc",
        period: "2019 - Present",
        description: "Built distributed systems and backend integrations.",
      },
    ],
    education: [
      {
        degree: "Computer Science",
        institution: "University of Technology",
        period: "2013 - 2017",
      },
    ],
    requirements: [
      { name: "System Design", result: "EXCEEDS" },
      { name: "Leadership", result: "MEETS" },
    ],
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    initials: "ER",
    role: "Frontend Architect at WebFlow",
    appliedRole: "Senior Frontend Engineer",
    match: 91,
    stage: "screening",
    skills: [
      { name: "React", level: "Expert", score: 0.96 },
      { name: "System Design", level: "Intermediate", score: 0.75 },
      { name: "Leadership", level: "Advanced", score: 0.88 },
    ],
    summary:
      "Excellent team mentor with a proven track record of upskilling junior developers.",
    experiences: [
      {
        role: "Frontend Architect",
        company: "WebFlow",
        period: "2020 - Present",
        description:
          "Mentored frontend teams and designed scalable UI architecture.",
      },
    ],
    education: [
      {
        degree: "Software Engineering",
        institution: "University of Technology",
        period: "2012 - 2016",
      },
    ],
    requirements: [
      { name: "React", result: "EXCEEDS" },
      { name: "Leadership", result: "MEETS" },
    ],
  },
];
