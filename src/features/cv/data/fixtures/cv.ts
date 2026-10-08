import { Cv } from "../../domain/entities/Cv";

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
