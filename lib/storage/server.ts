import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

export async function signedUploadUrl({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}) {
  const headers = {};

  const signedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      ACL: "private",
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Metadata: {
        created: Math.floor(new Date().getTime() / 1000).toString(),
      },
    }),
    {
      expiresIn: 30 * 60, // 30 minutes
    }
  );

  return {
    signedUrl,
    headers: headers,
    key: key,
  };
}

export async function signedDownloadUrl(
  key: string,
  ttlSeconds = 15 * 60
): Promise<string> {
  const signedUrl = await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
    {
      expiresIn: ttlSeconds,
    }
  );

  return signedUrl;
}
