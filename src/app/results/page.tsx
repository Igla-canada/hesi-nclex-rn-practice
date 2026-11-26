import { PageShell } from "@/components/PageShell";
import Link from "next/link";

export const metadata = { title: "Results" };

export default function Page() {
  return (
    <PageShell
      title="Results"
      description="Points and accuracy are reported separately. Default practice benchmark 85%. No HESI/NCLEX pass probability."
    >
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">
          Scaffold page — wire to exam engine / Prisma once DATABASE_URL is configured.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/exams" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Exam selection
          </Link>
          <Link href="/review" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Answer review
          </Link>
          <Link href="/" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
