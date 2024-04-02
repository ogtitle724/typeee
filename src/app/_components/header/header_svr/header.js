import Link from "next/link";
import { topics } from "@/config/topic";
import styles from "./header.module.css";

export default function SvrHeader(topic) {
  return (
    <header className={styles.pre + " card"}>
      <h1>{process.env.SITE_NAME}</h1>
      <Link href={`/`}>{"Home"}</Link>
      {topics.map((topic) => {
        return (
          <Link
            key={`menuItem_${topic.toLowerCase()}`}
            href={`/topic/${topic.toLowerCase()}?page=1`}
          >
            {topic}
          </Link>
        );
      })}
    </header>
  );
}
