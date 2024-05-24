"use client";

import BtnDelete from "@comps/btn/delete/delete";
import BtnEdit from "@comps/btn/edit/edit";
import { useSession } from "next-auth/react";
import styles from "./manage.module.css";

export default function BtnWrapper({ id, topic, uid }) {
  const session = useSession();

  return (
    <>
      {session.status === "authenticated" && session.data.user.uid === uid && (
        <div className={styles.pre + " type_a"}>
          <BtnEdit targetId={id} size={22} />
          <BtnDelete
            topic={topic}
            url={process.env.NEXT_PUBLIC_URL_POST + `/${id}`}
            size={20}
          />
        </div>
      )}
    </>
  );
}
