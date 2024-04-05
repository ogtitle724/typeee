import Link from "next/link";
import { topics } from "@/config/topic";

export default function SvrHeader(topic) {
  return (
    <header className={"hide"}>
      <nav>
        <ul>
          <li>
            <Link href={`/`}>{"Home"}</Link>
          </li>
          {topics.map((topic) => {
            return (
              <li key={`menuItem_${topic.toLowerCase()}`}>
                <Link href={`/topic/${topic.toLowerCase()}?page=1`}>
                  {topic}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
