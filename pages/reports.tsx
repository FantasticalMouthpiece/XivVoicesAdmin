import { useState, useEffect } from "react";
import Head from "next/head";
import { Typography, Box, Alert, CircularProgress, Paper } from "@mui/material";
import { useRouter } from "next/router";
import type { Report } from "@/generated/prisma";
import Layout from "../components/Layout/Layout";
import ReportList from "../components/ReportList/ReportList";
import useSessionRedirect from "@/hooks/useSessionRedirect";

// TODO: Implement app wide toast notifications
export default function Reports() {
  const { status } = useSessionRedirect();
  const loading = status === "loading";
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      void fetchReports();
    }
  }, [loading, router]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reports");

      if (!response.ok) {
        console.error(
          "Error fetching reports",
          response.status,
          response.statusText,
        );
        setError("Failed to fetch reports.");
        return;
      }

      const data = await response.json();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(
          "Error updating report:",
          response.status,
          response.statusText,
        );
        setError("Failed to delete report.");
        return;
      }

      // Remove the deleted report from the state
      setReports(reports.filter((report) => report.id !== id));
    } catch (err) {
      console.error("Error deleting report:", err);
      setError("Failed to delete report.");
    }
  };

  const handleEditReport = async (id: string, data: Partial<Report>) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(
          "Error updating report:",
          response.status,
          response.statusText,
        );
        setError("Failed to update report. Please try again later.");
        return;
      }

      // Update the edited report in the state
      setReports(
        reports.map((report) =>
          report.id === id ? { ...report, ...data } : report,
        ),
      );
    } catch (err) {
      console.error("Error updating report:", err);
      setError("Failed to update report. Please try again later.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Reports - XIV Voices Admin</title>
        <meta name="description" content="Manage reports for XIV Voices" />
      </Head>

      <Layout title="Reports">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage user reports for XIV Voices
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : reports.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1">No reports found.</Typography>
          </Paper>
        ) : (
          <ReportList
            reports={reports}
            onDelete={handleDeleteReport}
            onEdit={handleEditReport}
          />
        )}
      </Layout>
    </>
  );
}
