/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// backend route for creating a new report
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export type CreatePropagandaReportDTO = {
  title: string;
  description: string;
  authorId: string;
  locationPhotoUrls: string[];
  locationDescription: string;
  locationLatitude: number;
  locationLongitude: number;
  locationCity: string;
  locationState: string;
  locationCountry: string;
};

export async function createReport(
  input: CreatePropagandaReportDTO
): Promise<any> {
  const users = await prisma.user.findMany();

  console.log(users);

  const report = await prisma.propagandaReport.create({
    data: {
      ...input,
    },
  });

  return report;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   const report = await createReport();

  // handle for create
  if (req.method === "POST") {
    const input = req.body as CreatePropagandaReportDTO;

    const res = await createReport(input);
  }

  res.status(200).json({ message: "hi" });
}
