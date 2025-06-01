import { $Enums } from "@/generated/prisma";
import Role = $Enums.Role;
import { createMethodHandler } from "@/lib/api/middleware";
import { getReport, getReportQuerySchema } from "@/lib/api/reports/getReport";
import updateReport, {
  updateReportSchema,
} from "@/lib/api/reports/updateReport";
import { deleteReport } from "@/lib/api/reports/deleteReport";

export default createMethodHandler(
  {
    GET: getReport,
    PATCH: updateReport,
    DELETE: deleteReport,
  },
  {
    auth: {
      GET: { required: false },
      PATCH: { required: true, role: [Role.ADMIN] },
      DELETE: { required: true, role: [Role.ADMIN] },
    },
    validation: {
      GET: {
        query: getReportQuerySchema,
      },
      PATCH: {
        query: getReportQuerySchema,
        body: updateReportSchema,
      },
      DELETE: {
        query: getReportQuerySchema,
      },
    },
  },
);
