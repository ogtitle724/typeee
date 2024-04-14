import styles from "./postDetail_skeleton.module.css";

export default async function LoadingPostDetail() {
  return (
    <>
      <section className={styles.pre + ""}>
        <h1 className={styles.title + " skeleton_bg"}></h1>
        <div className={styles.dataWrapper}>
          <Metadata />
        </div>
        <div className={styles.content}>
          <div className="skeleton_bg"></div>
          <div className="skeleton_bg"></div>
          <div className="skeleton_bg"></div>
          <div className="skeleton_bg"></div>
          <div className="skeleton_bg"></div>
        </div>
      </section>
      <RelatedPosts />
    </>
  );
}

function Metadata() {
  return (
    <section className={styles.metadata}>
      <div className={styles.profile_img + " skeleton_bg"}></div>
      <div>
        <span className="skeleton_bg"></span>
        <span className="skeleton_bg"></span>
      </div>
    </section>
  );
}

function RelatedPosts() {
  const relatedPosts = new Array(4).fill(null);

  return (
    <section className={styles.relatePosts}>
      <h3>Related Posts</h3>
      <ul>
        {relatedPosts.map((post, idx) => {
          return (
            <li
              className={styles.next + " skeleton_bg"}
              key={`next post ${idx}`}
            ></li>
          );
        })}
      </ul>
    </section>
  );
}
