import { createClient, type QueryParams, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = process.env.SANITY_API_VERSION ?? "2024-01-01";

// Personal portfolio publishing cadence is low, so a short, single shared
// interval keeps newly published content visible quickly without any
// webhook/on-demand revalidation infrastructure (see design.md).
const REVALIDATE_SECONDS = 60;

let client: SanityClient | null = null;

function getClient(): SanityClient | null {
  if (!projectId || !dataset) {
    return null;
  }

  if (!client) {
    client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN,
    });
  }

  return client;
}

// Sanity is not provisioned in every environment (e.g. before the CMS
// project is created). Falling back instead of throwing keeps the build and
// the public pages working, rendering their documented empty/not-found
// states until real content is available.
export async function sanityFetch<T>(
  query: string,
  params: QueryParams,
  fallback: T,
): Promise<T> {
  const sanityClient = getClient();
  if (!sanityClient) {
    return fallback;
  }

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (error) {
    console.error("Sanity fetch failed", error);
    return fallback;
  }
}
