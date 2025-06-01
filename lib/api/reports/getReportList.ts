import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function getReportList(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Get all reports
  try {
    const reports = await prisma.report.findMany();
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ error: "Failed to fetch reports" });
  }
}
