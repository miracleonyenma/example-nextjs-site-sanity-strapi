/* eslint-disable @typescript-eslint/no-explicit-any */
// ./src/utils/strapi-adapter.ts

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface StrapiResponse<T = any> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id?: string | number;
  documentId?: string | number;
  attributes?: Record<string, any>;
  [key: string]: any;
}

/* -------------------------
   Helpers
------------------------- */

// Standardized slug adapter
const adaptSlug = (slug?: string) => ({ current: slug ?? "" });

// Standardized image adapter
const adaptImage = (img?: StrapiEntity) => img?.data ?? null;

// Standardized authors adapter
const adaptAuthors = (authors?: { data?: StrapiEntity[] }) =>
  authors?.data?.map(({ name, profilePicture }) => ({
    name,
    profilePicture: adaptImage(profilePicture),
  })) ?? [];

// Standardized categories adapter
const adaptCategories = (categories?: { data?: StrapiEntity[] }) =>
  categories?.data?.map(({ title, slug }) => ({
    title,
    slug: adaptSlug(slug),
  })) ?? [];

// Standardized gallery adapter
const adaptGallery = (gallery?: { data?: StrapiEntity[] }) =>
  gallery?.data?.map((img) => ({
    ...img,
    asset: { _ref: `image-${img.id}` }, // Sanity-like reference
  })) ?? [];

/* -------------------------
   Adapters
------------------------- */

export function adaptStrapiPost(post: StrapiEntity): any {
  return {
    _id: String(post.documentId),
    slug: adaptSlug(post.slug),
    image: adaptImage(post.image),
    authors: adaptAuthors(post.authors),
    categories: adaptCategories(post.categories),
    ...post, // spread last so overrides don't break critical fields
  };
}

export function adaptStrapiProduct(product: StrapiEntity): any {
  return {
    _id: String(product.documentId),
    specifications: {
      ...product.specifications, // spread instead of manual copy
    },
    gallery: adaptGallery(product.gallery),
    ...product,
  };
}

export function adaptStrapiPage(page: StrapiEntity): any {
  return {
    _id: String(page.documentId),
    slug: adaptSlug(page.slug),
    seo: {
      ...page.seo,
      image: adaptImage(page.seo?.image),
    },
    ...page,
  };
}

/* -------------------------
   Image URL builder
------------------------- */
export function getStrapiImageUrl(
  imageAttributes: any,
  baseUrl = STRAPI_URL
): string | null {
  const url = imageAttributes?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${baseUrl}${url}`;
}
