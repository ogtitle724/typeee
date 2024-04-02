import { topics } from "@/config/topic";
import fetchIns from "@/lib/fetch";

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
      const res = await fetchIns.get(
        process.env.NEXT_PUBLIC_URL_PAGING +
          `?page=${1}&query=${JSON.stringify({
            topic: topic.toLowerCase(),
          })}&select=${select}&size=Infinity`
      );
      const pagingData = await res.json();

      pagingData.posts.forEach((post) => {
        URLs.push({
          url: process.env.URL + `/post/${post.id}`,
          lastModified: post.re_date,
          changeFrequency: "always",
          priority: 0.8,
        });
      });

      for (let page = 1; page <= pagingData.totalPage; page++) {
        URLs.push({
          url: process.env.URL + `/topic/${topic}?page=${page}`,
          lastModified: new Date(),
          changeFrequency: "always",
          priority: 0.7,
        });
      }
    } catch (err) {
      console.error("ERROR(app/sitemap.js > sitemap):", err.message);
    }
  }

  return URLs;
}
