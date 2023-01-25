/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Button,
  Divider,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Textarea,
  Modal,
  Flex,
  FileButton,
  Space,
} from "@mantine/core";
import type { NextPage } from "next";
import { useForm } from "@mantine/form";
import type { LocationResult } from "../components/PlacesAutocompleteInput";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput";
// import type { CreatePropagandaReportDTO } from "../api/reports";
// import { createReport } from "../api/reports";
import { useSession } from "next-auth/react";
import { useState } from "react";

const NewReport: NextPage = () => {
  const { data: session } = useSession();

  const form = useForm<{
    title: string;
    description: string;
    images: File[];
    locationDescription: string;
    locationCountry: string;
    locationCity: string;
    locationState: string;
    locationLat: number;
    locationLng: number;
  }>({
    initialValues: {
      title: "",
      description: "",
      images: [],
      locationDescription: "",
      locationCountry: "",
      locationCity: "",
      locationState: "",
      locationLat: 0,
      locationLng: 0,
    },
  });

  const submitNewReport = async () => {
    // get user id from session

    const authorId = session?.user?.id;

    if (!authorId) {
      throw new Error("User not logged in");
    }

    const input = {
      title: form.values.title,
      description: form.values.description,
      locationPhotoUrls: [],
      locationDescription: form.values.locationDescription,
      locationCountry: form.values.locationCountry,
      locationCity: form.values.locationCity,
      locationState: form.values.locationState,
      locationLatitude: form.values.locationLat,
      locationLongitude: form.values.locationLng,
      authorId: authorId,
    };

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  };

  const [focusedImage, setFocusedImage] = useState<File | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const focusImage = (image: File) => {
    setFocusedImage(image);
    setModalOpened(true);
  };

  const onClearFocusedImage = () => {
    let imgs = form.values.images;
    imgs = imgs.filter((image) => image !== focusedImage);

    if (imgs.length === 0) {
      form.setFieldValue("images", []);
      setFocusedImage(null);
      setModalOpened(false);
      return;
    }

    form.setFieldValue("images", imgs);
    setFocusedImage(null);
    setModalOpened(false);
  };

  const handleLocationSelect = (location: LocationResult) => {
    form.setValues({
      ...form.values,
      locationCountry: location.country,
      locationCity: location.city,
      locationState: location.state,
      locationLat: location.lat,
      locationLng: location.lng,
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitNewReport();
  };

  return (
    <>
      <h1>New Report</h1>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size="xl"
      >
        <Stack>
          <div>
            <Image
              src={focusedImage ? URL.createObjectURL(focusedImage) : ""}
              alt=""
            />
          </div>
          <Flex justify="flex-end" gap="xl">
            <Button onClick={() => setModalOpened(false)}>Cancel</Button>
            <Button onClick={onClearFocusedImage}>Clear</Button>
          </Flex>
        </Stack>
      </Modal>
      <form onSubmit={handleFormSubmit}>
        <Flex px="xl" gap="xl" direction="column">
          <TextInput
            label="Title"
            size="xl"
            {...form.getInputProps("title")}
          ></TextInput>
          <Textarea
            label="Description"
            size="xl"
            {...form.getInputProps("description")}
          ></Textarea>
          <Divider mb="xl"></Divider>

          {form.values.images.length > 0 && (
            <Paper shadow="xs" p="md" withBorder>
              <SimpleGrid cols={6}>
                {form.values.images.map((image, i) => {
                  const imageUrl = URL.createObjectURL(image);
                  return (
                    <Image
                      key={i}
                      src={imageUrl}
                      alt=""
                      className="pointer-cursor"
                      onClick={() => focusImage(image)}
                    />
                  );
                })}
              </SimpleGrid>
            </Paper>
          )}
          <FileButton
            onChange={(payload) => form.setValues({ images: payload })}
            multiple
          >
            {(props) => <Button {...props}>Upload image(s)</Button>}
          </FileButton>

          <PlacesAutocompleteInput
            handleLocationSelect={handleLocationSelect}
          ></PlacesAutocompleteInput>

          <Textarea
            {...form.getInputProps("locationDescription")}
            label="Location Description"
            placeholder="Describe where it's located."
            size="xl"
          ></Textarea>

          <Space></Space>
          <Button size="xl" type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default NewReport;
