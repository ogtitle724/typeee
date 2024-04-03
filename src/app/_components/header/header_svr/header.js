import Link from "next/link";
import { topics } from "@/config/topic";

export default function SvrHeader(topic) {
  return (
    <header className={"hide"}>
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
