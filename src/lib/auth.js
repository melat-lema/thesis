import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const currentUser = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { userId },
  });

  return user;
};

export const currentRole = async () => {
  const user = await currentUser();
  return user?.role;
};

export const isAdmin = async () => {
  const role = await currentRole();
  return role === "ADMIN";
};

export const isTeacher = async () => {
  const role = await currentRole();
  return role === "TEACHER";
};

export const isStudent = async () => {
  const role = await currentRole();
  return role === "STUDENT";
};
