import { Link } from "@remix-run/react";
import React from "react";

export default function Index() {
  return (
    <main>
      <section className="grid h-full grid-cols-1 lg:grid-cols-2">
        <article className="index--background--clip h-screen bg-[#E9F4FF] p-4 lg:flex lg:justify-center">
          <div className="flex h-screen max-w-sm flex-col items-start justify-center">
            <h1 className="pb-4 text-2xl font-bold">Find prices around you</h1>
            <p className="">
              It's a well-known fact that the cost of buying a house in the
              United Kingdom has been rising steadily for years. But what might
              not be as obvious is how quickly that cost has increased over
              time.
            </p>
            <br />
            <p className="mb-6">
              Find out the cost of buying in your area, and see how the cost
              compares to buying in the past.
            </p>
            <Link
              to="/where"
              className="inline-block rounded-md bg-[#607FF2] py-3 px-8 font-bold tracking-widest text-white"
            >
              Get Started
            </Link>
          </div>
        </article>
        <article className="h-1/2 lg:flex lg:h-full lg:items-center lg:justify-center">
          <img
            src="/images/buying_illustration.svg"
            className="mt-4 p-2 lg:max-w-lg"
          />
        </article>
      </section>
    </main>
  );
}

// export default function Index() {
//   return (
//     <main className="h-full lg:flex">
//       <section className="index--background--clip h-full bg-[#E9F4FF] lg:bg-stone-50 flex items-center lg:w-1/2 sm:justify-center sm:items-center">
//         <div className="px-4 pr-8 max-w-sm lg:max-w-md">
//           <h1 className="pb-4 text-2xl font-bold">Find prices around you</h1>
//           <p className="">
//             It's a well-known fact that the cost of buying a house in the United
//             Kingdom has been rising steadily for years. But what might not be as
//             obvious is how quickly that cost has increased over time.
//           </p>
//           <br />
//           <p className="mb-6">
//             Find out the cost of buying in your area, and see how the cost
//             compares to buying in the past.
//           </p>
//           <Link to="/where" className="bg-[#607FF2] inline-block py-3 px-8 font-bold text-white tracking-widest rounded-md">Get Started</Link>
//         </div>
//       </section>
//       <section className="h-full lg:w-1/2 lg:flex lg:bg-[#E9F4FF] justify-center items-center">
//         <img src="/images/buying_illustration.svg" className="p-2 mt-4 lg:max-w-lg"/>
//       </section>
//     </main>
//   );
// }

export const links = () => [
  {
    rel: "preload",
    href: "/images/buying_illustration.svg",
    as: "image",
    type: "image/svg+xml",
  },
];
