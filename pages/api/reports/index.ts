import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma, Report } from "@/generated/prisma";
import ReportCreateInput = Prisma.ReportCreateInput;

type CreateReportDTO = Omit<Report, "id">;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      // Get all reports
      try {
        const reports = await prisma.report.findMany();
        return res.status(200).json(reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        return res.status(500).json({ error: "Failed to fetch reports" });
      }

    case "POST":
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

        // Validate required fields
        const requiredFields = [
          "speaker",
          "sentence",
          "npcid",
          "skeletonid",
          "body",
          "gender",
          "race",
          "tribe",
          "eyes",
          "folder",
          "user",
        ];

        for (const field of requiredFields) {
          if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is required` });
          }
        }

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

        // Return the existing entry if it already exists
        const existingEntry = await prisma.report.findFirst({
          where: { ...data },
        });

        if (existingEntry) {
          return res.status(200).json(existingEntry);
        }

        const report = await prisma.report.create({ data });

        return res.status(201).json(report);
      } catch (error) {
        console.error("Error creating report:", error);
        return res.status(500).json({ error: "Failed to create report" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}
