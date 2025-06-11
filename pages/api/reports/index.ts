import { createMethodHandler } from "@/lib/api/middleware";
import getReportList from "@/lib/api/reports/getReportList";
import createReport, {
  createReportSchema,
} from "@/lib/api/reports/createReport";

export default createMethodHandler(
  {
    GET: getReportList,
    POST: createReport,
  },
  {
    auth: {
      GET: { required: false },
      POST: { required: false },
    },
    validation: {
      POST: {
        body: createReportSchema,
      },
    },
  },
);
