export async function uploadObject({
  key,
  signedUrl,
  blobUrl,
  headers = {},
}: {
  key: string;
  signedUrl: string;
  blobUrl: string;
  headers?: Record<string, string>;
}) {
  const blob = await fetch(blobUrl).then((res) => res.blob());

  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": blob.type,
      ...headers,
    },
    body: blob,
  });

  if (!response.ok) {
    throw new Error("Failed to upload data");
  }

  return key;
}
