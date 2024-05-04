import Link from "next/link";
import { IoArrowForwardCircle } from "react-icons/io5";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.pre + " type_a"}>
      <p className={styles.bg}>404</p>
      <div className={styles.content}>
        <p>To someone,</p>
        <p>
          {
            "Who landed on our 404 page. It seems like you've entered wrong place. There is no such page you entered. But don't worry here the EXIT for you"
          }
        </p>
        <Link href={"/"}>
          <span>Home Page</span>
          <IoArrowForwardCircle size={30} />
        </Link>
      </div>
    </div>
  );
}
