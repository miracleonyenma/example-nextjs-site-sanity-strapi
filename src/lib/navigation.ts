// ./src/lib/navigation.ts
import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";

const PAGES_QUERY = `*[_type == "page" && defined(slug.current)]|order(title asc){
  _id, title, slug
}`;

export interface NavigationPage {
  _id: string;
  title: string;
  slug: { current: string };
}

export async function getNavigationPages(): Promise<NavigationPage[]> {
  const options = { next: { revalidate: 60 } }; // Cache for 1 minute
  return client.fetch<NavigationPage[]>(PAGES_QUERY, {}, options);
}

// Define which pages should appear in main navigation vs footer
export const MAIN_NAV_SLUGS = ["about", "contact"];
export const FOOTER_QUICK_LINKS_SLUGS = ["about", "contact"];
export const FOOTER_SUPPORT_SLUGS = ["help", "shipping", "returns", "privacy"];
export const FOOTER_LEGAL_SLUGS = ["terms", "privacy", "cookies"];
