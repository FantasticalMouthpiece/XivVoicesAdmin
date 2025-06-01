import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export const getReportQuerySchema = z.object({
  id: z.string(),
});

export async function getReport(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query?.id as string;

    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("Error getting report:", error);
    return res.status(500).json({ error: "Failed to get report" });
  }
}
