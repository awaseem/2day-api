import { User } from "@prisma/client";
import { db } from "../lib/prisma.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function createUser(email: string): ReturnPromise<User> {
  try {
    const user = await db.user.create({
      data: {
        email,
      },
    });

    return retData(user);
  } catch (error) {
    return retError(error);
  }
}

export async function getUserByEmail(email: string): ReturnPromise<User> {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error(`could not find user with email: ${email}`);
    }

    return retData(user);
  } catch (error) {
    return retError(error);
  }
}

export async function deleteUser(email: string): ReturnPromise<void> {
  try {
    await db.user.deleteMany({
      where: {
        email,
      },
    });

    return retData(undefined);
  } catch (error) {
    return retError(error);
  }
}
