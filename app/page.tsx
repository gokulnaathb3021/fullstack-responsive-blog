// import Link from "next/link";

// async function fetchBlogs() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/blog`, {
//     next: {
//       revalidate: 10,
//     },
//   });
//   const data = await res.json();
//   return data.posts;
// }

// export default async function Home() {
//   const posts = await fetchBlogs();
//   console.log(posts);
//   return (
//     <main className="w-full h-full">
//       <div className="md:w-2/4 sm:w-3/4 m-auto p-4 my-5 rounded-lg bg-slate-800 drop-shadow-xl">
//         <h1 className="text-slate-200 text-center text-2xl font-extrabold font-[verdana]">
//           My FULL STACK Blog App With Next.js
//         </h1>
//       </div>
//       <div className="md:w-1/6 sm:w-2/4 text-center rounded-md p-2 m-auto bg-slate-200 font-semibold my-5">
//         <Link href="/blog/addBlog">Add New Blog🚀</Link>
//       </div>
//       <div className="w-full flex flex-col justify-center items-center">
//         {posts?.map((post: any) => (
//           <div
//             className="w-3/4 p-4 rounded-md mx-3 my-2 bg-slate-200 flex flex-col justify-center"
//             key={post.id}
//           >
//             {/* Title and Action */}
//             <div className="flex items-center my-3">
//               <div className="mr-auto">
//                 <h1 className="font-semibold">{post.title}</h1>
//               </div>
//               <Link
//                 href={`/blog/editBlog/${post.id}`}
//                 className="px-4 py-1 bg-slate-900 rounded-md font-semibold text-slate-200 text-center text-xl"
//               >
//                 Edit
//               </Link>
//             </div>
//             {/* Date and Description */}
//             <div className="mr-auto my-1">
//               <blockquote className="font-bold text-slate-700">
//                 {new Date(post.date).toDateString()}
//               </blockquote>
//             </div>
//             <div className="mr-auto my-1">
//               <h2>{post.description}</h2>
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

async function fetchBlogs() {
  const res = await fetch(`/api/blog`, {
    next: {
      revalidate: 10,
    },
  });
  const data = await res.json();
  return data.posts;
}
type postObject = {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
};
export default function Home() {
  const [posts, setPosts] = useState<postObject[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(true);
  // const posts = await fetchBlogs();
  // let posts: postObject[] | null = [];
  useEffect(() => {
    setIsLoading(true);
    fetchBlogs()
      .then((data) => {
        setIsLoading(false);
        setPosts(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  console.log(posts);
  return (
    <main className="w-full h-full">
      <div className="md:w-2/4 sm:w-3/4 m-auto p-4 my-5 rounded-lg bg-slate-800 drop-shadow-xl">
        <h1 className="text-slate-200 text-center text-2xl font-extrabold font-[verdana]">
          My FULL STACK Blog App With Next.js
        </h1>
      </div>
      <div className="md:w-1/6 sm:w-2/4 text-center rounded-md p-2 m-auto bg-slate-200 font-semibold my-5">
        <Link href="/blog/addBlog">Add New Blog🚀</Link>
      </div>
      {isLoading && (
        <h1 className="text-center text-slate-200 text-3xl font-[verdana] my-20 font-normal">
          Fetching your blogs🚀🚀🚀
        </h1>
      )}
      {!isLoading && (
        <div className="w-full flex flex-col justify-center items-center">
          {posts?.map((post: any) => (
            <div
              className="w-3/4 p-4 rounded-md mx-3 my-2 bg-slate-200 flex flex-col justify-center"
              key={post.id}
            >
              {/* Title and Action */}
              <div className="flex items-center my-3">
                <div className="mr-auto">
                  <h1 className="font-semibold">{post.title}</h1>
                </div>
                <Link
                  href={`/blog/editBlog/${post.id}`}
                  className="px-4 py-1 bg-slate-900 rounded-md font-semibold text-slate-200 text-center text-xl"
                >
                  Edit
                </Link>
              </div>
              {/* Date and Description */}
              <div className="mr-auto my-1">
                <blockquote className="font-bold text-slate-700">
                  {new Date(post.date).toDateString()}
                </blockquote>
              </div>
              <Image
                src={post.imageUrl}
                alt={post.imageUrl}
                width="300"
                height="200"
              ></Image>
              <div className="mr-auto my-1">
                <h2>{post.description}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
