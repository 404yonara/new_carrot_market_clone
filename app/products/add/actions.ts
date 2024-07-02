"use server";

import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";

const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  // cloudflare같은 것을 쓰지 않는다는 전제 하에 강의를 따라오고 싶을 때, 이 방법을 사용
  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    // fs는 file system을 위한 것, node.js 기본 라이브러리에 포함되어있다.
    // appendFile은 말 그대로 로컬의 경로에 버퍼를 읽어 파일로 저장함.
    // appendFile의 1번 인자에는 로컬 저장 경로, 2번 인자에는 buffer
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      // redirect(`/products/${product.id}`);
      redirect("/products");
    }
  }
}
