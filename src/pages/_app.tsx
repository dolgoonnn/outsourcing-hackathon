import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { Toaster } from "@/components/ui/toaster";

// import Them

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers";
import Footer from "@/components/footer";
import { SiteHeader } from "@/components/layout/site-header";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <SiteHeader />
        <Component {...pageProps} />
      </ThemeProvider>
      {/* <Footer /> */}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
