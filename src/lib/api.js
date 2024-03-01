import fetchIns from "@/lib/fetch";

export const getPosts = async (query) => {
  let qs = Object.entries(query).reduce((acc, query, idx) => {
    return acc + `${idx ? "&" : ""}${query[0]}=${query[1]}`;
  }, "");

  try {
    const res = await fetchIns.get(
      process.env.NEXT_PUBLIC_URL_PAGING + `?${qs}`
    );
    const resData = await res.json();
    return resData;
  } catch (err) {
    console.log(err.message);
  }
};
