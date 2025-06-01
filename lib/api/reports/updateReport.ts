import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { z } from "zod";
import ReportUpdateInput = Prisma.ReportUpdateInput;

export const updateReportSchema = z.object({
  speaker: z.string().optional(),
  sentence: z.string().optional(),
  npcid: z.string().optional(),
  skeletonid: z.string().optional(),
  folder: z.string().optional(),
  user: z.string().optional(),
  comment: z.string().optional(),
  body: z.string().optional(),
  gender: z.string().optional(),
  race: z.string().optional(),
  tribe: z.string().optional(),
  eyes: z.string().optional(),
});

export default async function updateReport(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Create a new report
  try {
    const id = req.query?.id as string;

    const {
      speaker,
      sentence,
      npcid,
      skeletonid,
      body,
      gender,
      race,
      tribe,
      eyes,
      folder,
      user,
      comment,
    } = req.body;

    const data: ReportUpdateInput = {
      speaker,
      sentence,
      npcId: npcid,
      skeletonId: skeletonid,
      body,
      gender,
      race,
      tribe,
      eyes,
      folder,
      user,
      comment,
    };

    // Check if entry exists
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const updatedReport = await prisma.report.update({ data, where: { id } });

    return res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({ error: "Failed to create report" });
  }
}
