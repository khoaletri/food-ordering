"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const UpdateButton = ({ id }: { id: string }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    return;
  }

  const handleUpdate = () => {
    // Replace this with your update logic, for example:
    router.push(`/update/${id}`);
    // In this example, it navigates to a route for updating a product with the given ID
    toast("Redirecting to update page...");
  };

  return (
    <button
      className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-full ml-6"
      onClick={handleUpdate}
    >
      <Image src="/edit.png" alt="" width={20} height={20} />
    </button>
  );
};

export default UpdateButton;
