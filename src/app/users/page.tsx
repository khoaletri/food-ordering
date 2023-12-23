"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const UsersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

  if (status === "unauthenticated") {
    router.push("/");
  }

  const { isLoading, error, data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("http://localhost:3000/api/users").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: ({ id, isAdmin }: { id: string; isAdmin: boolean }) => {
      return fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleUpdateAdminStatus = (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const isAdmin = input.value === 'true'; // Assuming the input value will be 'true' or 'false'

    mutation.mutate({ id, isAdmin });
    toast.success("The admin status has been changed!");
  };

  const deleteUser = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User has been deleted!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Something went wrong while deleting the user!");
    }
  };

  const filteredUsers = usersData ? usersData.filter((user) =>
  user.email.toLowerCase().includes(searchTerm.toLowerCase())
) : [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading || status === "loading") return "Loading...";

  return (
  <div className="p-4 lg:px-20 xl:px-40">
    {/* Search Bar with Label */}
    <div className="flex p-4 items-center">
      <label htmlFor="searchInput" className="text-lg font-semibold mr-2">Search by Email:</label>
      <input
        id="searchInput"
        type="text"
        placeholder="Enter email"
        value={searchTerm}
        onChange={handleSearch}
        className="border border-gray-300 rounded py-2 px-4"
      />
    </div>

      {/* Table for displaying users */}
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>isAdmin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              {/* Columns for each user */}
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <form onSubmit={(e) => handleUpdateAdminStatus(e, user.id)}>
                  <select className="mr-2 py-1 px-2 border border-gray-300 rounded" defaultValue={user.isAdmin ? 'true' : 'false'}>
                    <option value="true">Admin</option>
                    <option value="false">User</option>
                  </select>
                  <button className="bg-red-400 p-2 rounded-full">
                    <Image src="/edit.png" alt="" width={20} height={20} />
                  </button>
                </form>
              </td>
              <td>
                <button className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-full ml-6" onClick={() => deleteUser(user.id)}>
                  <Image src="/delete.png" alt="" width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
