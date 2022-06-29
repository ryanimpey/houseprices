import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ToastContainer } from 'react-toastify';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import toastifyStylesheetUrl from 'react-toastify/dist/ReactToastify.css';
import tailwindStylesheetUrl from "./styles/tailwind.css";
import mainStylesheetUrl from "./styles/index.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: toastifyStylesheetUrl },
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  { rel: "stylesheet", href: mainStylesheetUrl },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cabin:wght@400;700&display=swap"},
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Loca House Prices",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
          <script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4325636149354440" crossOrigin="anonymous" />
      </head>
      <body className="h-full">
        <ToastContainer />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

Sentry.init({
  dsn: "https://702f96a133494e47a5f4a4ab182e06d9@o1302539.ingest.sentry.io/6540151",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1
});