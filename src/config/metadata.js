export const getMetadata = (title, description, canonical, imgSrc) => {
  const newMetadata = structuredClone(defaultMetadata);

  if (title) {
    newMetadata.title = title;
    newMetadata.openGraph.title = title;
    newMetadata.twitter.title = title;
  }

  if (description) {
    newMetadata.description = description;
    newMetadata.openGraph.description = description;
    newMetadata.twitter.description = description;
  }

  if (canonical) {
    newMetadata.alternates.canonical = canonical;
    newMetadata.openGraph.url = canonical;
  }

  if (imgSrc) {
    const ogImgs = newMetadata.openGraph.images;
    newMetadata.openGraph.images = ogImgs.map((ele) => (ele.url = imgSrc));

    const twImgs = newMetadata.twitter.images;
    newMetadata.twitter.images = twImgs.map((ele) => imgSrc);
  }

  return newMetadata;
};

export const defaultMetadata = {
  title: {
    //title of doc. consisited with default, template, absolute(ignore other)
    default: process.env.SITE_NAME, // fallback title
    template: `%s | ${process.env.SITE_NAME}`, //prefix or suffix to titles defined in 'child' route segments
  },
  description: process.env.DESCRIPTION,
  alternates: {
    canonical: process.env.URL,
    languages: {
      "en-US": "/en-US",
      "ko-KR": "/ko-KR",
    },
  },
  openGraph: {
    title: process.env.SITE_NAME,
    description: process.env.DESCRIPTION,
    url: process.env.URL,
    siteName: process.env.SITE_NAME,
    images: [
      {
        url: process.env.URL + process.env.LOGO_PATH,
        width: 800,
        height: 600,
        alt: `${process.env.SITE_NAME} logo`,
      },
      {
        url: process.env.URL + process.env.LOGO_PATH,
        width: 1800,
        height: 1600,
        alt: `${process.env.SITE_NAME} logo`,
      },
    ],
    locale: ["en-US", "ko-KR"],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": 100,
      "max-image-preview": "large",
      "max-snippet": 160,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.SITE_NAME,
    description: process.env.DESCRIPTION,
    images: [process.env.URL + process.env.LOGO_PATH],
  },
  generator: "Next.js",
  applicationName: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: ["Next.js", "React", "JavaScript"],
  authors: [{ name: "Wonje Jang" }],
  creator: "Wonje Jang",
  publisher: "Wonje Jang",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "google-site-verification": "5D4yc6zMocQx2ZOFtT_uH57wACrmwmlckyXRtYndbIc",
    "naver-site-verification": "629aea8a7118ed3809b2e498f08e000668b1ea89",
  },
};
