import { PageShell } from "@/components/PageShell";
import Link from "next/link";

export const metadata = { title: "Question bank info" };

export default function Page() {
  return (
    <PageShell
      title="Question bank info"
      description="Published count equals clinically reviewed items only. Example/draft seeds are labeled clearly."
    >
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">
          Scaffold page — wire to exam engine / Prisma once DATABASE_URL is configured.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/exams" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Exam selection
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Dashboard
          </Link>
          <Link href="/" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
