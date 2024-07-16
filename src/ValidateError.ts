import { ValidateError } from "tsoa";
import { S3ServiceException } from "@aws-sdk/client-s3";
import { NextFunction, Request, Response } from "express";

export class CustomError {
  static handleError = async (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {

    if (error instanceof S3ServiceException) {
      return res
        .status(error.$metadata.httpStatusCode || 500)
        .json({ error: error.message });
    }

    if (error instanceof ValidateError) {
      return res.status(error.status || 422).json({
        context: "Validation Failed",
        details: error?.fields,
      });
    }

    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "Internal Server Error" });
    }

    next();
  };
}
