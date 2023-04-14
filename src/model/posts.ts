import { Post } from "@prisma/client";
import { db } from "../lib/prisma.js";
import { ReturnPromise, retData, retError } from "../util/return.js";

export async function createPost(
  userId: string,
  post: string
): ReturnPromise<Post> {
  try {
    const createdPost = await db.post.create({
      data: {
        userId,
        post,
      },
    });

    return retData(createdPost);
  } catch (error) {
    return retError(error);
  }
}

export async function deletePost(
  userId: string,
  postId: string
): ReturnPromise<void> {
  try {
    await db.post.deleteMany({
      where: {
        userId,
        id: postId,
      },
    });

    return retData(undefined);
  } catch (error) {
    return retError(error);
  }
}
