export const pageview = (url) => {
  if (typeof window.dataLayer !== "undefined") {
    //for production
    window.dataLayer.push({
      event: "pageview",
      page: url,
    });
  } else {
    //for development
    console.log({
      event: "pageview",
      page: url,
    });
  }
};
