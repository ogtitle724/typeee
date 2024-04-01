import Link from "next/link";
import { topics } from "@/config/topic";
import styles from "./header.module.css";

export default function SvrHeader(props) {
  return (
    <header className={styles.pre + " card"}>
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
