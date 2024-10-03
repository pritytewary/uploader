import { verifyUser } from "@/lib/jwt";
import { signedUploadUrl } from "@/lib/storage/server";
import withApiWrapper from "@/lib/with-api-wrapper";
import HttpError from "http-errors";

async function generateUploadUrlApi(req, res) {
  const token = req.cookies.token;
  const user = verifyUser(token);
  

  const { contentType, extension = "bin" } = req.body;

  if (!contentType) throw new HttpError.BadRequest("Content type is reuired");

  const key = `uploads/${crypto.randomUUID()}.${extension}`;

  const signed = await signedUploadUrl({
    contentType,
    key,
  });

  res.status(200).json({
    message: "Generated signed upload url",
    data: signed,
  });
}

export default withApiWrapper(generateUploadUrlApi);
