import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { Role } from "../../../features/auth/domain/entities/Session";

type BarItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: Href;
};

export type BarItemId = BarItem["id"];

const CandidateBar: readonly BarItem[] = [
  {
    id: "dashboard",
    icon: "home-outline",
    label: "Ana Sayfa",
    href: "/candidate-dashboard",
  },
  {
    id: "applications",
    icon: "briefcase-outline",
    label: "Başvurularım",
    href: "/candidate-applications",
  },
  {
    id: "search",
    icon: "search-outline",
    label: "Arama",
    href: "/job-search",
  },
  {
    id: "profile",
    icon: "person-circle-outline",
    label: "Profil",
    href: "/candidate-profile",
  },
];

const EmployerBar: readonly BarItem[] = [
  {
    id: "dashboard",
    icon: "home-outline",
    label: "Ana Sayfa",
    href: "/employer-dashboard",
  },
  {
    id: "jobs",
    icon: "briefcase-outline",
    label: "İlanlar",
    href: "/employer-jobs",
  },
  {
    id: "candidates",
    icon: "people-outline",
    label: "Adaylar",
    href: "/employer-candidates",
  },
  {
    id: "profile",
    icon: "person-circle-outline",
    label: "Profil",
    href: "/employer-profile",
  },
];

const HrBar: readonly BarItem[] = [
  {
    id: "dashboard",
    icon: "home-outline",
    label: "Ana Sayfa",
    href: "/hr-dashboard",
  },
  {
    id: "jobs",
    icon: "briefcase-outline",
    label: "İlanlar",
    href: "/hr-jobs",
  },
  {
    id: "candidates",
    icon: "people-outline",
    label: "Adaylar",
    href: "/hr-candidates",
  },
  {
    id: "profile",
    icon: "person-circle-outline",
    label: "Profil",
    href: "/hr-profile",
  },
];

export const barItemsByRole: Record<Role, readonly BarItem[]> = {
  candidate: CandidateBar,
  employer: EmployerBar,
  hr: HrBar,
};
