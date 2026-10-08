import { Application } from "../../domain/entities/Application";

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
