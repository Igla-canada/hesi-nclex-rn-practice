export type NavItem = {
  href: string;
  label: string;
  group: "student";
};

/** Pages a student uses to start, take, and review a practice test. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", group: "student" },
  { href: "/exams", label: "Exam selection", group: "student" },
  { href: "/exam", label: "Live examination", group: "student" },
  { href: "/practice", label: "Custom practice", group: "student" },
  { href: "/results", label: "Results", group: "student" },
  { href: "/review", label: "Answer review", group: "student" },
];
