"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

const UsersButton = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user?.isAdmin && (
        <Link href="/users">Users</Link>
      )}    
    </>
  );
};

export default UsersButton;
