"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchInput = () => {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }

    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
  };

return (
    <form onSubmit={onSearch} className="flex justify-center">
      <input
        value={searchQuery || ""}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="px-3 py-1 w-full sm:w-64 text-gray-800 bg-white border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500 focus:border-red-500"
        placeholder="What are you looking for?"
      />
    </form>
  );
};

export default SearchInput;