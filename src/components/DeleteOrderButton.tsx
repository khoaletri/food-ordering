import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

const DeleteOrderButton = ({ id }: { id: string }) => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    return null; // Or you can render a message or an empty div
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.success("The order has been deleted!");
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Something went wrong while deleting the order.");
    }
  };

  return (
    <button
      className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-full ml-6"
      onClick={handleDelete}
    >
      <Image src="/delete.png" alt="" width={20} height={20} />
    </button>
  );
};

export default DeleteOrderButton;