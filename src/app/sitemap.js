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
  const select = "_id re_date";

  for (const topic of topics) {
    try {
      const url =
        process.env.NEXT_PUBLIC_URL_PAGING +
        `?page=${1}&query=${JSON.stringify({
          topic: topic.toLowerCase(),
        })}&select=${select}&size=Infinity`;
      const options = {
        method: "GET",
        headers: { Accept: "application/json" },
      };

      const res = await fetch(url, options);
      const pagingData = await res.json();

      for (let page = 1; page <= pagingData.totalPage; page++) {
        URLs.push({
          url:
            process.env.URL +
            `/topic/${topic.toLocaleLowerCase()}?page=${page}`,
          lastModified: new Date(),
          changeFrequency: "always",
          priority: 0.7,
        });
      }

      pagingData.posts.forEach((post) => {
        URLs.push({
          url: process.env.URL + `/post/${post.id}`,
          lastModified: post.re_date,
          changeFrequency: "always",
          priority: 0.8,
        });
      });
    } catch (err) {
      console.error("ERROR(app/sitemap.js > sitemap):", err.message);
    }
  }

  return URLs;
}
