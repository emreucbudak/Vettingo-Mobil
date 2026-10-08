import {
  Application,
  Candidate,
  Cv,
  Job,
  Question,
  Requisition,
} from "../domain/models";

export const applications: Application[] = [
  {
    id: "stripe",
    title: "Senior Frontend Engineer",
    company: "Stripe",
    location: "San Francisco",
    status: "Interviewing",
    progress: 0.5,
    next: "Sıradaki: Teknik değerlendirme",
  },
  {
    id: "airbnb",
    title: "Staff UX Designer",
    company: "Airbnb",
    location: "Remote",
    status: "Applied",
    progress: 0.25,
    next: "Başvuru inceleniyor",
  },
  {
    id: "notion",
    title: "Product Designer",
    company: "Notion",
    location: "Remote",
    status: "Rejected",
    progress: 1,
    next: "Başvuru olumsuz sonuçlandı",
  },
];
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
export const cv: Cv = {
  summary:
    "Senior Full Stack Developer with 8+ years of experience building scalable enterprise web applications. Proficient in React, Node.js, and cloud infrastructure. Strong leadership skills demonstrated by guiding a team of 5 engineers to successfully deliver a major SaaS platform migration.",
  skills: [
    "React.js",
    "Node.js",
    "TypeScript",
    "AWS",
    "System Architecture",
    "Team Leadership",
  ],
  experiences: [
    {
      role: "Lead Developer",
      company: "TechCorp Solutions Inc.",
      period: "2020 - Present",
      description:
        "Architected and implemented microservices transition. Managed technical debt reduction initiatives.",
    },
    {
      role: "Senior Developer",
      company: "InnovateWeb Ltd.",
      period: "2017 - 2020",
      description:
        "Led frontend development using React. Improved application load times by 40%.",
    },
  ],
  education: {
    degree: "BSc Computer Science",
    institution: "University of Technology",
    period: "2013 - 2017",
  },
  completed: false,
};
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
export const requisitions: Requisition[] = [
  {
    id: "data-scientist",
    title: "Lead Data Scientist",
    department: "Engineering",
    locationType: "hybrid",
    office: "San Francisco, CA",
    skills: ["Python", "ML"],
    marketCompensation: false,
    description: "",
    status: "Sourcing",
    candidateLabel: "+12",
  },
  {
    id: "vp-engineering",
    title: "VP of Engineering",
    department: "Engineering",
    locationType: "remote",
    office: "",
    skills: ["Leadership", "Cloud"],
    marketCompensation: false,
    description: "",
    status: "Interviewing",
    candidateLabel: "+4",
  },
  {
    id: "marketing-manager",
    title: "Senior Marketing Manager",
    department: "Marketing",
    locationType: "onsite",
    office: "New York, NY",
    skills: ["Marketing"],
    marketCompensation: false,
    description: "",
    status: "Sourcing",
    candidateLabel: "New",
  },
];
export const catalog = {
  departments: ["Engineering", "Product", "Design", "Sales", "Marketing"],
  offices: ["New York, NY", "San Francisco, CA", "London, UK"],
  skills: ["Python", "Go", "System Design", "AWS", "Kubernetes"],
};
const effectOptions = [
  {
    id: "api-404",
    text: "API 404 hatası döndürdüğü için fetch sonsuza kadar tekrar eder.",
  },
  {
    id: "dependency-array",
    text: "userData bağımlılık dizisindedir. Güncellenmesi effect’i tekrar tetikler.",
  },
  {
    id: "userid-render",
    text: "userId okunması her seferinde yeniden render tetikler.",
  },
  {
    id: "missing-await",
    text: "fetch çağrısında await olmadığı için sonsuz döngü oluşur.",
  },
];
export const questions: Question[] = [
  {
    id: "react-effects",
    category: "Technical Assessment",
    difficulty: "Hard",
    prompt:
      "Aşağıdaki React bileşenindeki sonsuz döngünün en olası sebebi nedir?",
    fileName: "UserProfile.jsx",
    code: "useEffect(() => {\n  fetch(`/api/users/${userId}`)\n    .then(res => res.json())\n    .then(data => setUserData(data));\n}, [userData, userId]);",
    options: effectOptions,
  },
  {
    id: "typescript-immutability",
    category: "TypeScript",
    difficulty: "Medium",
    prompt:
      "Bir koleksiyon referansının yeniden atanmasını hangi bildirim engeller?",
    fileName: "profile.ts",
    code: "const skills = ['React Native', 'TypeScript'];",
    options: [
      { id: "var", text: "var" },
      { id: "const", text: "const" },
      { id: "let", text: "let" },
      { id: "any", text: "any" },
    ],
  },
  {
    id: "react-mount",
    category: "React Native",
    difficulty: "Medium",
    prompt:
      "Bileşen açıldığında bir kez çalışması gereken asenkron istek nerede başlatılmalıdır?",
    fileName: "Profile.tsx",
    code: "useEffect(() => {\n  loadProfile();\n}, []);",
    options: [
      { id: "render", text: "Render fonksiyonu içinde" },
      { id: "effect", text: "Boş bağımlılık dizili useEffect içinde" },
      { id: "cleanup", text: "Effect cleanup içinde" },
      { id: "global", text: "Global değişkende" },
    ],
  },
  {
    id: "current-question",
    category: "Technical Assessment",
    difficulty: "Hard",
    prompt: "userData güncellendikçe effect neden tekrar çalışır?",
    fileName: "UserProfile.jsx",
    code: "useEffect(() => {\n  fetch(`/api/users/${userId}`)\n    .then(res => res.json())\n    .then(data => setUserData(data));\n}, [userData, userId]);",
    options: [
      { id: "api-error", text: effectOptions[0].text },
      { id: "userdata-loop", text: effectOptions[1].text },
      { id: "access-render", text: effectOptions[2].text },
      { id: "await-loop", text: effectOptions[3].text },
    ],
  },
  {
    id: "react-keys",
    category: "React Native",
    difficulty: "Easy",
    prompt:
      "React listelerinde kararlı key değerleri neyi korumaya yardımcı olur?",
    fileName: "Skills.tsx",
    code: "<SkillTile key={skill.id} skill={skill} />",
    options: [
      { id: "network", text: "Ağ önbelleği" },
      { id: "identity", text: "Bileşen kimliği ve ilişkili state" },
      { id: "theme", text: "Renk teması" },
      { id: "route", text: "Route adı" },
    ],
  },
  ...Array.from({ length: 15 }, (_, i): Question => ({
    id: `question-${i + 6}`,
    category: "Software Engineering",
    difficulty: i % 2 ? "Medium" : "Hard",
    prompt: "Bakımı kolay bir uygulama için hangi yaklaşım uygundur?",
    fileName: `solution_${i + 6}.ts`,
    code: "const result = service.process(input);",
    options: [
      {
        id: "separation",
        text: "Sorumlulukları ayırın ve bağımlılıkları açık tutun.",
      },
      {
        id: "global-state",
        text: "Tüm state’i değiştirilebilir global değişkenlere taşıyın.",
      },
      {
        id: "ignore-errors",
        text: "Hataları yok sayın ve sonsuza kadar yeniden deneyin.",
      },
      { id: "duplicate", text: "Her ekranda aynı kodu kopyalayın." },
    ],
  })),
];
