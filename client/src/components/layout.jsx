import { Fragment } from "react";

import NavBar from "@/components/nav-bar";

export default function RootLayout({ children }) {
  return (
    <Fragment>
      <NavBar />
      <main className="min-h-screen bg-background">{children}</main>
    </Fragment>
  );
}
