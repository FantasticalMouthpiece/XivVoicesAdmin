import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export async function deleteReport(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query?.id as string;

    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    await prisma.report.delete({ where: { id } });

    return res.status(204).json({ message: "Report deleted" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res.status(500).json({ error: "Failed to delete report" });
  }
}
