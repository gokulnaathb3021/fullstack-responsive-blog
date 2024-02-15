"use client";

import { storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { v4 } from "uuid";

// react-hot-toast is a great notification library from react.
const AddBlog = () => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  async function addBlog(title: string, description: string, imageUrl: string) {
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, imageUrl }),
    });
    return await res.json();
  }

  let imageFile: File;
  function setFile(f: File) {
    imageFile = f;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    let imageUrl;
    const fileName = imageFile.name + v4();
    const imageRef = ref(storage, `images/${fileName}`);
    // uploadBytes(imageRef, imageFile).then((snapshot) => {
    //   getDownloadURL(snapshot.ref).then((url) => {
    //     imageUrl = url;
    //   });
    // });

    try {
      toast.loading("Uploading image🚀", { id: "0" });
      const snapshot = await uploadBytes(imageRef, imageFile);
      const url = await getDownloadURL(snapshot.ref);
      imageUrl = url;
      toast.success("Image uploaded🚀", { id: "0" });
    } catch (e) {
      alert("Error uploading image!");
      console.log("Error uploading image!");
      return;
    }

    if (titleRef.current && descriptionRef.current) {
      toast.loading("Posting Blog🚀", { id: "1" });
      const res = await addBlog(
        titleRef.current.value,
        descriptionRef.current.value,
        imageUrl as string
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
            className="rounded-md px-4 py-2 my-2 bg-white"
            type="file"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];
              if (selectedFile) setFile(selectedFile);
            }}
          />
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
