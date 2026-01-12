import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "dav_session";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sid) return null;
  const session = await prisma.session.findUnique({ where: { id: sid }, include: { user: true } });
  if (!session) return null;
  if (session.expiresAt && session.expiresAt < new Date()) return null;
  return session.user;
}

export async function createSession(userId: string) {
  const session = await prisma.session.create({ data: { userId } });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (sid) {
    await prisma.session.delete({ where: { id: sid } }).catch(() => {});
    cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  }
}

