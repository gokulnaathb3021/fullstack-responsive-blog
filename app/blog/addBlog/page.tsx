"use client";

import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

// react-hot-toast is a great notification library from react.
const AddBlog = () => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  async function addBlog(title: string, description: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
    return await res.json();
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (titleRef.current && descriptionRef.current) {
      toast.loading("Posting Blog🚀", { id: "1" });
      const res = await addBlog(
        titleRef.current.value,
        descriptionRef.current.value
      );
      if (res.message === "OK")
        toast.success("Blog posted successfully🚀", { id: "1" });
      else toast.error("Couldn't post blog!😕", { id: "1" });
      router.push("/");
    }
  }
  return (
    <>
      <Toaster />
      {/* <div className="w-full my-4"> */}
      <div className="flex flex-col justify-center items-center">
        <p className="text-2xl text-slate-200 font-bold p-3">Add A Blog🚀</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={titleRef}
            type="text"
            placeholder="Enter Title"
            className="rounded-md px-4 py-2 my-2 w-full"
          />
          <textarea
            ref={descriptionRef}
            placeholder="Enter Description"
            className="rounded-md px-4 py-2 my-2 w-full"
          ></textarea>
          <button className="font-semibold px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-100">
            Submit
          </button>
        </form>
        <button
          className="font-semibold px-4 py-2 bg-red-400 hover:bg-red-500"
          onClick={() => {
            router.push("/");
          }}
        >
          Cancel
        </button>
      </div>
      {/* </div> */}
    </>
  );
};

export default AddBlog;
