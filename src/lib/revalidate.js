"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function pathRevalidation(paths, option = null) {
  for (const path of paths) {
    revalidatePath(path, option);
  }
}

export async function tagRevalidation(tags) {
  for (const tag of tags) {
    revalidateTag(tag);
  }
}
