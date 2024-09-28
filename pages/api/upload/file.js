import { signedDownloadUrl } from "@/lib/storage/server";
import withApiWrapper from "@/lib/with-api-wrapper";
import HttpError from "http-errors";

async function fileDownloadUrl(req, res) {
  const { key } = req.query;

  if (!key) throw new HttpError.BadRequest("Key is reuired");

  const signedUrl = await signedDownloadUrl(key);

  res.redirect(307, signedUrl);
}

export default withApiWrapper(fileDownloadUrl);
