"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function pathRevalidation(path, option = null) {
  return new Promise((resolve, reject) => {
    console.log("path revalidate", path);
    resolve(revalidatePath(path, option));
  });
}

export async function tagRevalidation(tag) {
  return new Promise((resolve, reject) => {
    resolve(revalidateTag(tag));
  });
}
