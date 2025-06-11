import { HttpMethod, MethodHandlers } from "@/types/api";
import { $Enums } from "@/generated/prisma";
import { z, ZodError } from "zod";
import Role = $Enums.Role;
import { getServerSession } from "next-auth/next";
import { authOptions as serverAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

const methods: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface ValidationOptions {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
}

interface MethodOptions {
  auth?: {
    [key in HttpMethod]?: {
      required?: boolean;
      role?: Role | Role[];
    };
  };
  validation?: {
    [key in HttpMethod]?: ValidationOptions;
  };
}

const validateRole = ({ user }: Session, requiredRole?: Role[] | Role) => {
  const userRole = user.role;

  if (!requiredRole) return true;
  if (!userRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }

  return userRole === requiredRole;
};

const validateRequest = async (
  req: NextApiRequest,
  schema?: ValidationOptions,
) => {
  if (!schema) return;

  if (schema.body) {
    req.body = await schema.body.parseAsync(req.body);
  }
  if (schema.query) {
    req.query = await schema.query.parseAsync(req.query);
  }
};

export function createMethodHandler(
  handlers: MethodHandlers,
  options: MethodOptions = {},
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, serverAuthOptions);
    const method = req.method as HttpMethod;
    const handler = handlers[method];

    if (!handler) {
      const allowedMethods = methods.filter((method) =>
        Object.keys(handlers).includes(method),
      );
      res.setHeader("Allow", allowedMethods);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }

    const authOptions = options.auth?.[method];

    if (authOptions?.required) {
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Role check
      if (authOptions.role && !validateRole(session, authOptions.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
    }

    const validationOptions = options.validation?.[method];

    if (validationOptions) {
      try {
        await validateRequest(req, validationOptions);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            error: "Validation Error",
            details: error.errors,
          });
        }

        return res.status(500).json({ error: "Internal server error" });
      }
    }

    // TODO: Add error 500 error handling here
    return handler(req, res, session || undefined);
  };
}
