import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <p>404 | Not Found</p>
    </div>
  );
}
