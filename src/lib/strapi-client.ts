const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function strapiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${STRAPI_URL}/api/${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.statusText}`);
  }

  return response.json();
}
