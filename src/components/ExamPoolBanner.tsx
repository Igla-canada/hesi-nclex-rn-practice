export function ExamPoolBanner({
  notice,
  source,
}: {
  notice: string;
  source: "database" | "bank-file" | "example-fallback";
}) {
  const tone =
    source === "example-fallback"
      ? "border-[var(--warn)] bg-[var(--surface)] text-[var(--ink)]"
      : "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]";
  return (
    <p className={`mb-4 rounded-lg border px-4 py-3 text-sm leading-relaxed ${tone}`} role="status">
      {notice}
    </p>
  );
}
