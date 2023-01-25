import { Flex, Group, Header, Title } from "@mantine/core";
import { AuthButton } from "./AuthButton";
import { useSession } from "next-auth/react";

export const AppHeader: React.FC = () => {
  const { data: session } = useSession();

  return (
    <Header height={60} p="xs">
      <Flex justify="space-between">
        <Title>PropagandaWatch</Title>
        <Group>
          <AuthButton></AuthButton>
        </Group>
      </Flex>
    </Header>
  );
};
