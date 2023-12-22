"use client";

import React, { useState } from "react";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeleteOrderButton from "@/components/DeleteOrderButton";

const OrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/orders").then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const input = form.elements[0] as HTMLInputElement;
  const status = input.value;


  const validStatusValues = ["Not Paid!", "Paid", "Delivered"];

  if (!validStatusValues.includes(status)) {
    toast.error("Invalid status!");
    return; 
  }

  mutation.mutate({ id, status });
  toast.success("The order status has been changed!");
};

  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const filteredOrders =
    selectedStatus === "All"
      ? data
      : data.filter((item: OrderType) => item.status === selectedStatus);

  if (isLoading || status === "loading") return "Loading...";

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      {/* Dropdown for status filter */}
      <div className="flex justify-end mb-4 items-center">
        <label htmlFor="statusFilter" className="text-lg font-semibold mr-2">
          Filter orders by status:
        </label>
        <select
          id="statusFilter"
          className="p-2 rounded-md border border-gray-300"
          value={selectedStatus}
          onChange={handleStatusFilterChange}
        >
          <option value="All">All</option>
          <option value="Not Paid!">Not Paid!</option>
          <option value="Paid">Paid</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Table for displaying orders */}
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Status</th>
            {session?.user?.isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((item: OrderType) => (
            <tr
              className={`${item.status !== "delivered" && "bg-red-50"}`}
              key={item.id}
            >
              {/* Columns for each order */}
              <td className="hidden md:block py-6 px-1">{item.id}</td>
              <td className="py-6 px-1">
                {item.createdAt.toString().slice(0, 10)}
              </td>
              <td className="py-6 px-1">{item.price}</td>
              <td className="hidden md:block py-6 px-1">
                {item.products[0].title}
              </td>
              <td className="py-6 px-1">
                {session?.user?.isAdmin ? (
                  <form
                    className="flex items-center justify-center gap-4"
                    onSubmit={(e) => handleUpdate(e, item.id)}
                  >
                    <input
                      placeholder={item.status}
                      className="p-2 ring-1 ring-red-100 rounded-md"
                    />
                    <button className="bg-red-400 p-2 rounded-full">
                      <Image src="/edit.png" alt="" width={20} height={20} />
                    </button>
                  </form>
                ) : (
                  item.status
                )}
              </td>
              {session?.user?.isAdmin && (
                <td>
                  <DeleteOrderButton id={item.id} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
