import { topics } from "@/config/topic";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const URLs = [
    {
      url: process.env.URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
  ];

  for (const topic of topics) {
    URLs.push({
      url: process.env.URL + `/topic/${topic.toLocaleLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.7,
    });
  }

  try {
    const select = "_id re_date";
    const url =
      process.env.NEXT_PUBLIC_URL_PAGING +
      `?page=${1}&query=${JSON.stringify({})}&select=${select}&size=Infinity`;
    const options = {
      method: "GET",
      headers: { Accept: "application/json" },
    };

    const res = await fetch(url, options);
    const pagingData = await res.json();

    pagingData.posts.forEach((post) => {
      URLs.push({
        url: process.env.URL + `/post/${post.id}`,
        lastModified: post.re_date,
        changeFrequency: "always",
        priority: 0.8,
      });
    });
  } catch (err) {
    console.error("ERROR(/sitemap.js > sitemap):", err.message);
  }

  return URLs;
}
