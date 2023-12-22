"use client";

import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

type Inputs = { title: string; desc?: string; price: string; catSlug: string };

type Option = { title: string; additionalPrice: number };

const UpdateProduct = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: "0",
    catSlug: "pizzas",
  });

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });

  const [file, setFile] = useState<File>();

  const [options, setOptions] = useState<Option[]>([]);

  if (status === "loading") {
    return <p>Loading....</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };

  //CLOUDINARY_URL=cloudinary://957323929832296:3Q_TazdHKLJ4D9678y3UcvgRZNc@dp5axfdaj
  //https://api.cloudinary.com/v1_1/dp5axfdaj/image/upload
  const uploadToCloudinary = async () => {
    const data = new FormData();

    data.append("file", file!);
    data.append("upload_preset", "restaurant");
    // data.append("timestamp");
    // data.append("api_key", process.env.CLOUDINARY_API_KEY!);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dulvpadgl/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const response = await res.json();
      console.log("responsedata", response);
      return response.url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    console.log(e.target.value);

    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const optionsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    // const str = [e.target.name];
    // const str2: string = str.charAt(0).toUpperCase() + str.slice(1);
    setOption((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const imgUrl = await uploadToCloudinary();
      console.log(
        "--------------------------what is going on-----------------------"
      );
      console.log(inputs);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`, {
        method: "POST",
        body: JSON.stringify({
          title: inputs.title,
          desc: inputs.desc,
          catSlug: inputs.catSlug,
          price: Number(inputs.price),
          img: imgUrl,
          options,
        }),
      });

      const data = await res.json();

      setInputs({
        title: "",
        desc: "",
        price: "0",
        catSlug: "",
      });

      setOption({
        title: "",
        additionalPrice: 0,
      });

      setOptions([]);

      if (data) toast.success("Successfuly added");
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  // h-[calc(100vh-9rem)]
  //h-[calc(100vh-6rem)]
  return (
    <div className="p-4 lg:px-20 xl:px-40 mt-5 max-h-full flex items-center justify-center">
      <form
        className="flex flex-wrap gap-4 shadow-lg p-8 md:w-1/2"
        onSubmit={onSubmitHandler}
      >
        <h3 className="text-3xl">Update Product</h3>
        <div className="w-full flex flex-col gap-2 ">
          <label htmlFor="image">Image</label>
          <input
            className="ring-1 ring-pink-500 p-2 rounded-sm"
            name="image"
            type="file"
            onChange={handleChangeImage}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label htmlFor="title">Title</label>
          <input
            className="ring-1 ring-pink-500 p-2 rounded-sm"
            name="title"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label htmlFor="desc">Description</label>
          <textarea
            name="desc"
            className="ring-1 ring-pink-500 p-2 rounded-sm"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label htmlFor="price">Price</label>
          <input
            className="ring-1 ring-pink-500 p-2 rounded-sm"
            name="price"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label htmlFor="catSlug">Category</label>
          <input
            className="ring-1 ring-pink-500 p-2 rounded-sm"
            name="catSlug"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label>Options (e.g. small, medium)</label>
          <div className="flex flex-col gap-2">
            <input
              className="ring-1 ring-pink-500 p-2 rounded-sm"
              name="title"
              type="text"
              placeholder="Title"
              onChange={optionsHandler}
            />
            <input
              className="ring-1 ring-pink-500 p-2 rounded-sm"
              name="additionalPrice"
              type="number"
              placeholder="Additional Price"
              onChange={optionsHandler}
            />
            <div
              className="w-40 ring-1 ring-pink-600 rounded-md bg-pink-600 text-white p-2 text-center self-center cursor-pointer hover:bg-white hover:text-pink-600"
              onClick={() => setOptions((prev) => [...prev, option])}
            >
              Add Option
            </div>
          </div>
        </div>

        <div className="w-full">
          {options.map((item, id) => {
            return (
              <div key={id} className="flex items-center gap-3">
                <div className="w-[9rem] ring-1 ring-pink-500 rounded-md p-3 mt-3 mb-3">
                  <span>{item.title}: </span>
                  <span>${item.additionalPrice}</span>
                </div>
                <AiOutlineDelete
                  className="text-2xl text-red-600 cursor-pointer font-bold hover:rotate-[30deg] transition-all duration-300"
                  onClick={() => {
                    setOptions((prev) =>
                      prev.filter((opt) => opt.title !== item.title)
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="ring-1 ring-pink-600 p-2 bg-pink-600 text-white rounded-md cursor-pointer hover:bg-white hover:text-pink-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
