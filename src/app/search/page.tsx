// pages/search.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductType } from "@/types/types";

type Product = {
  id: string;
  img: string;
  title: string;
  price: number;
};

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const query = searchParams.get("q");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex flex-wrap text-red-500">
      {products.length === 0 ? (
        <div>No products found for "{query}"</div>
      ) : (
        products.map((item: ProductType) => (
          <Link
            className="w-full h-[60vh] border-r-2 border-b-2 border-red-500 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-fuchsia-50"
            href={`/product/${item.id}`}
            key={item.id}
          >
            {/* IMAGE CONTAINER */}
            {item.img && (
              <div className="relative h-[80%]">
                <Image src={item.img} alt="" fill className="object-contain" />
              </div>
            )}
            {/* TEXT CONTAINER */}
            <div className="flex items-center justify-between font-bold">
              <h1 className="text-2xl uppercase p-2">{item.title}</h1>
              <h2 className="group-hover:hidden text-xl">${item.price}</h2>
              <button className="hidden group-hover:block uppercase bg-red-500 text-white p-2 rounded-md">
                Add to Cart
              </button>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default SearchResultsPage;
    