import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import ReportCreateInput = Prisma.ReportCreateInput;
import { z } from "zod";

export const createReportSchema = z.object({
  speaker: z.string(),
  sentence: z.string(),
  npcid: z.string(),
  skeletonid: z.string(),
  folder: z.string(),
  user: z.string(),
  comment: z.string().optional(),
  body: z.string(),
  gender: z.string(),
  race: z.string(),
  tribe: z.string(),
  eyes: z.string(),
});

export default async function createReport(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Create a new report
  try {
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

    const data: ReportCreateInput = {
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

    // Look for reports about the same line regardless of user/comment.
    const { user: _, comment: __, ...queryData } = data;
    const existingEntry = await prisma.report.findFirst({
      where: queryData,
    });

    // Return the existing entry if it already exists
    if (existingEntry) {
      return res.status(200).json(existingEntry);
    }

    const report = await prisma.report.create({ data });

    return res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({ error: "Failed to create report" });
  }
}
