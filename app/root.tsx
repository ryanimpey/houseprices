import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ToastContainer } from "react-toastify";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import toastifyStylesheetUrl from "react-toastify/dist/ReactToastify.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import mainStylesheetUrl from "./styles/index.css";
import { getUser } from "./session.server";
import Header from "./components/Header";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: toastifyStylesheetUrl },
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  { rel: "stylesheet", href: mainStylesheetUrl },
  {
    rel: "preload",
    href: "/images/undraw_handcrafts_house.svg",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "/images/building.svg",
    as: "image",
    type: "image/svg+xml",
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Loca House Prices",
  viewport: "width=device-width,initial-scale=1",
  "google-site-verification": "u7CskPSB6o52xMQwZ6ja2AYsvOXUO0BiikCLqcMha6M",
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4325636149354440"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full">
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ToastContainer />
      </body>
    </html>
  );
}

Sentry.init({
  dsn: "https://702f96a133494e47a5f4a4ab182e06d9@o1302539.ingest.sentry.io/6540151",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
});
