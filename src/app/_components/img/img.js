"use client";
import Image from "next/image";

export default function Img({ data }) {
  return (
    <figure style={{ width: `${data.pct}%` }}>
      <Image
        alt={data.alt || "typeee image"}
        src={data.src}
        style={{ aspectRatio: data.aspectRatio }}
        width={data.width}
        height={data.height}
        loading="lazy"
      />
    </figure>
  );
}
