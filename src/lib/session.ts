import "server-only";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
};

export const AUTHORING_ROLES: Role[] = ["AUTHOR", "CLINICAL_REVIEWER", "ADMIN"];
export const REVIEW_ROLES: Role[] = ["CLINICAL_REVIEWER", "ADMIN"];

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };
}

export async function requireUser(nextPath?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  return user;
}

export async function requireRole(
  roles: Role[],
  nextPath?: string,
): Promise<CurrentUser> {
  const user = await requireUser(nextPath);
  if (!roles.includes(user.role)) redirect("/");
  return user;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** For Route Handlers: throws HttpError instead of redirecting. */
export async function requireApiUser(roles?: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "Sign in required");
  if (roles && !roles.includes(user.role)) throw new HttpError(403, "Forbidden");
  return user;
}
