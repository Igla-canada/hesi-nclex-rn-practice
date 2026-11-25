export type NavItem = {
  href: string;
  label: string;
  group: "student" | "study" | "admin" | "info";
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", group: "info" },
  { href: "/dashboard", label: "Student dashboard", group: "student" },
  { href: "/exams", label: "Exam selection", group: "student" },
  { href: "/exam", label: "Live examination", group: "student" },
  { href: "/results", label: "Results", group: "student" },
  { href: "/review", label: "Answer review", group: "student" },
  { href: "/practice", label: "Custom practice", group: "study" },
  { href: "/study", label: "Study mode", group: "study" },
  { href: "/bookmarks", label: "Bookmarks", group: "study" },
  { href: "/history", label: "Exam history", group: "student" },
  { href: "/references", label: "Clinical references", group: "info" },
  { href: "/question-bank", label: "Question bank", group: "info" },
  { href: "/admin", label: "Admin dashboard", group: "admin" },
];
