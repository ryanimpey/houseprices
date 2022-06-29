import { Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import * as Sentry from "@sentry/node";

export const loader: LoaderFunction = async ({ request }) => {
    Sentry.captureMessage("REACHED_ERROR_PAGE", {
        tags: {
            url: request.url
        },
        level: 'error'
    })
}

export default function Error() {
  return (
    <main className="container flex h-full justify-center">
      <section className="flex max-w-md flex-col justify-center">
        <div className="pb-6">
          <h1 className="pb-4 text-left font-sans text-3xl font-bold text-[#363636]">
            Hmm.
          </h1>
        </div>
        <div className="pb-6">
          <h3 className="text-1xl pb-4 text-left font-sans font-bold text-[#363636]">
            That shouldn't have happened. Sorry. If you've encountered this page
            by trying to break stuff, nice job!
            <br />
          </h3>
          <h3 className="text-1xl pb-4 text-left font-sans font-bold text-[#363636]">
            If you didn't try to break stuff, again, sorry. We've made a note of
            this error to see what caused it.
          </h3>
        </div>
        <div className="pb-6">
          <Link
            to={{ pathname: "/" }}
            className="rounded-3xl border-8 border-[#36B3FF] bg-[#9bd9ff] px-20 py-2 font-sans font-bold text-[#363636] shadow-custom"
          >
            head home
          </Link>
        </div>
      </section>
    </main>
  );
}
