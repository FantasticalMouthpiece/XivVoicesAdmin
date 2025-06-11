import React, { useState } from "react";
import type { Report } from "@/generated/prisma";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

interface ReportListProps {
  reports: Report[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, data: Partial<Report>) => void;
}

export default function ReportList({
  reports,
  onDelete,
  onEdit,
}: ReportListProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editComment, setEditComment] = useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setEditComment(report.comment || "");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedReport && onEdit) {
      onEdit(selectedReport.id, { comment: editComment });
    }
    setEditDialogOpen(false);
  };

  const handleDeleteReport = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reports.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow>
                <TableCell>Speaker</TableCell>
                <TableCell>Sentence</TableCell>
                <TableCell>NPC ID</TableCell>
                <TableCell>Race</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow
                    hover
                    key={report.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {report.speaker}
                    </TableCell>
                    <TableCell>
                      {report.sentence.length > 30
                        ? `${report.sentence.substring(0, 30)}...`
                        : report.sentence}
                    </TableCell>
                    <TableCell>{report.npcId}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${report.race} ${report.tribe}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.gender}</TableCell>
                    <TableCell>{report.user}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleViewReport(report)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Comment">
                        <IconButton onClick={() => handleEditReport(report)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        aria-labelledby="view-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="view-dialog-title">Report Details</DialogTitle>
        <DialogContent dividers>
          {selectedReport && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Speaker</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.speaker}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">NPC ID</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.npcId}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Sentence</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.sentence}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2">Race</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.race}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2">Tribe</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.tribe}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2">Gender</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.gender}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Skeleton ID</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.skeletonId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Body</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.body}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Eyes</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.eyes}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Folder</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.folder}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Submitted By</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.user}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Comment</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.comment || "No comment provided"}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
