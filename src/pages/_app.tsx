import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, signOut } from "next-auth/react";

import "../styles/globals.css";
import {
  AppShell,
  Button,
  Flex,
  Group,
  Header,
  MantineProvider,
  Navbar,
  Title,
} from "@mantine/core";
import Head from "next/head";
import { ModalsProvider } from "@mantine/modals";
import { AuthButton } from "../components/AuthButton";
import { AppHeader } from "../components/AppHeader";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
        }}
      >
        <SessionProvider session={session}>
          <ModalsProvider>
            <AppShell header={<AppHeader></AppHeader>}>
              <Component {...pageProps} />
            </AppShell>
          </ModalsProvider>
        </SessionProvider>
      </MantineProvider>
    </>
  );
};

export default MyApp;
