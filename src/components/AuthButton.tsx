// component for a login button that changes based on the next-auth session state

import { type Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@mantine/core";

export const AuthButton: React.FC = () => {
  const { data: session } = useSession();

  return session ? (
    <Button onClick={() => signOut()}>Sign out</Button>
  ) : (
    <Button onClick={() => signIn()}>Sign in</Button>
  );
};
