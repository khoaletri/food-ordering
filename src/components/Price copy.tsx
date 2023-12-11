"use client";

import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Price = ({ product }: { product: Product }) => {
  const [total, setTotal] = useState<number>(Number(product.price)); //Number(product.price)
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);

  const { addToCart } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (product.options.length) {
      console.log("inside the price");
      console.log(product);
      console.log("type of total", typeof total);
      setTotal(
        quantity * Number(product.price) +
          Number(product.options[selected].additionalPrice)
      );
    }
  }, [quantity, selected, product]);

  const handleCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      img: product.img,
      price: total,
      ...(product.options?.length && {
        optionTitle: product.options[selected].title,
      }),
      quantity: quantity,
    });
    toast.success("Added to the cart");
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">${total}</h2>
      {/* Options container */}
      <div className="flex gap-4">
        {product.options?.map((option, id) => (
          <button
            key={id}
            className={`min-w-[6rem] p-2 ring-1 ring-pink-600 rounded-md ${
              selected === id ? "bg-pink-600" : "bg-white"
            } ${selected === id ? "text-white" : "text-pink-600"}`}
            onClick={() => setSelected(id)}
          >
            {option.title}
          </button>
        ))}
      </div>
      {/* Quantity and add button container */}
      <div className="flex justify-between items-center">
        {/* Quantity */}
        <div className="flex justify-between w-full p-3 ring-1 ring-pink-600">
          <span className="">Quantity</span>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"-"}
            </button>
            <span className="">{quantity}</span>
            <button
              onClick={() =>
                setQuantity((prev) => (prev < 9 ? prev + 1 : prev))
              }
            >
              {"+"}
            </button>
          </div>
        </div>
        {/* Cart Button */}
        <button
          className="uppercase w-56 bg-pink-600 text-white p-3 ring-1 ring-pink-600 rounded-md"
          onClick={handleCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
