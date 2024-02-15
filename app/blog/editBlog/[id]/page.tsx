"use client";

import { storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { v4 } from "uuid";

const EditBlog = () => {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const params = useParams();
  const router = useRouter();

  async function fetchBlogById() {
    const res = await fetch(`/api/blog/${params.id}`);
    const data = await res.json();
    return data.post;
  }

  let imageUrl: string;
  useEffect(() => {
    toast.loading("Fetching blog details🚀", { id: "1" });
    fetchBlogById()
      .then((data) => {
        if (titleRef.current && descriptionRef.current) {
          titleRef.current.value = data.title;
          descriptionRef.current.value = data.description;
          imageUrl = data.imageUrl;
          toast.success("Fetch complete🚀", { id: "1" });
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to fetch blog details😕", { id: "1" });
      });
  });

  async function updateBlog(
    title: string,
    description: string,
    imageUrl: string
  ) {
    const res = await fetch(`/api/blog/${params.id}`, {
      method: "PUT",
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

  async function handleUpdate(e: any) {
    e.preventDefault();

    if (imageFile) {
      const fileName = imageFile.name + v4();
      const imageRef = ref(storage, `images/${fileName}`);

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
    }

    if (titleRef.current && descriptionRef.current) {
      toast.loading("Updating your blog🚀", { id: "2" });
      const res = await updateBlog(
        titleRef.current.value,
        descriptionRef.current.value,
        imageUrl
      );
      if (res.message === "OK") toast.success("Blog Updated!!🚀", { id: "2" });
      else toast.error("Couldn't update blog!😕", { id: "2" });
      router.push("/");
    }
  }

  async function handleDelete() {
    toast.loading("Deleting blog🚀", { id: "3" });
    const res = await fetch(`/api/blog/${params.id}`, { method: "DELETE" });
    const response = await res.json();
    if (response.message === "OK")
      toast.success("Blog deleted successfully!🚀", { id: "3" });
    else toast.error("Couldn't delete blog😊", { id: "3" });
    router.push("/");
  }
  return (
    <>
      <Toaster />
      <div className="flex flex-col justify-center items-center">
        <p className="text-2xl text-slate-200 font-bold p-3">Add A Blog🚀</p>
        <form onSubmit={handleUpdate}>
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
            Update
          </button>
        </form>
        <div>
          <button
            className="font-semibold px-4 py-2 bg-red-400 hover:bg-red-500 text-slate-100 mr-5"
            onClick={handleDelete}
          >
            Delete
          </button>
          <Link href="/">
            <button className="font-semibold px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-slate-100 mr-5">
              Discard
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default EditBlog;
