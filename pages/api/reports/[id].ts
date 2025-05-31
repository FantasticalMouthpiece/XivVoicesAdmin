import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import {$Enums} from "@/generated/prisma";
import Role = $Enums.Role;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'You must be signed in to access this endpoint' });
  }

  // Check if user is an admin
  if (session.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: 'You must be an admin to perform this operation' })
  }

  // Get the report ID from the URL
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid report ID' });
  }

  switch (req.method) {
    case 'GET':
      // Get a specific report by ID
      try {
        const report = await prisma.report.findUnique({
          where: { id }
        });

        if (!report) {
          return res.status(404).json({ error: 'Report not found' });
        }

        return res.status(200).json(report);
      } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ error: 'Failed to fetch report' });
      }

    case 'PUT':
      // Update a report
      try {
        const {
          speaker,
          sentence,
          npcId,
          skeletonId,
          body,
          gender,
          race,
          tribe,
          eyes,
          folder,
          user,
          comment
        } = req.body;

        // Check if report exists
        const existingReport = await prisma.report.findUnique({
          where: { id }
        });

        if (!existingReport) {
          return res.status(404).json({ error: 'Report not found' });
        }

        // Update the report
        const updatedReport = await prisma.report.update({
          where: { id },
          data: {
            speaker,
            sentence,
            npcId,
            skeletonId,
            body,
            gender,
            race,
            tribe,
            eyes,
            folder,
            user,
            comment
          }
        });

        return res.status(200).json(updatedReport);
      } catch (error) {
        console.error('Error updating report:', error);
        return res.status(500).json({ error: 'Failed to update report' });
      }

    case 'DELETE':
      // Delete a report
      try {
        // Check if report exists
        const existingReport = await prisma.report.findUnique({
          where: { id }
        });

        if (!existingReport) {
          return res.status(404).json({ error: 'Report not found' });
        }

        // Delete the report
        await prisma.report.delete({
          where: { id }
        });

        return res.status(204).send(null);
      } catch (error) {
        console.error('Error deleting report:', error);
        return res.status(500).json({ error: 'Failed to delete report' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}