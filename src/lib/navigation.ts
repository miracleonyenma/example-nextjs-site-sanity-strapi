import { strapiRequest } from "./strapi-client";
import {
  adaptStrapiPage,
  type StrapiResponse,
  type StrapiEntity,
} from "@/utils/strapi-adapter";

export interface NavigationPage {
  _id: string;
  title: string;
  slug: { current: string };
}

export async function getNavigationPages(): Promise<NavigationPage[]> {
  try {
    const response: StrapiResponse<StrapiEntity[]> = await strapiRequest(
      "pages?fields[0]=title&fields[1]=slug&sort=title:asc",
      { next: { revalidate: 60 } }
    );

    return response.data.map(adaptStrapiPage);
  } catch (error) {
    console.error("Failed to fetch navigation pages:", error);
    return [];
  }
}

// Keep your existing navigation constants
export const MAIN_NAV_SLUGS = ["about", "contact"];
export const FOOTER_QUICK_LINKS_SLUGS = ["about", "contact"];
export const FOOTER_SUPPORT_SLUGS = ["help", "shipping", "returns", "privacy"];
export const FOOTER_LEGAL_SLUGS = ["terms", "privacy", "cookies"];
