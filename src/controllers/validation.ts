import { IncomingHttpHeaders } from "http";
import { Return, retData } from "../util/return.js";
import { retError } from "../util/return.js";
import { z } from "zod";

export interface Valid {
  accountId: string;
}

const CreateSourceBody = z.object({
  url: z.string().url(),
});

export function validate(headers: IncomingHttpHeaders): Return<Valid> {
  try {
    const accountId = headers["x-account-id"];
    if (!accountId || typeof accountId !== "string") {
      throw new Error("no account Id found");
    }

    return {
      data: {
        accountId,
      },
    };
  } catch (error) {
    return retError(error);
  }
}

export function validCreateSource(
  body: unknown
): Return<z.infer<typeof CreateSourceBody>> {
  try {
    const res = CreateSourceBody.parse(body);
    return retData(res);
  } catch (error) {
    return retError(error);
  }
}
