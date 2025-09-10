// src/lib/strapi-client.ts
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiRequestOptions {
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  fields?: string[];
  publicationState?: "live" | "preview";
}

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export class StrapiClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL = STRAPI_URL, token = STRAPI_TOKEN) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private buildQueryString(options: StrapiRequestOptions = {}): string {
    const params = new URLSearchParams();

    // Handle populate
    if (options.populate) {
      if (typeof options.populate === "string") {
        params.append("populate", options.populate);
      } else if (Array.isArray(options.populate)) {
        options.populate.forEach((field) => params.append("populate", field));
      } else {
        Object.entries(options.populate).forEach(([key, value]) => {
          params.append(`populate[${key}]`, String(value));
        });
      }
    }

    // Handle filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([operator, filterValue]) => {
            params.append(`filters[${key}][${operator}]`, String(filterValue));
          });
        } else {
          params.append(`filters[${key}]`, String(value));
        }
      });
    }

    // Handle sort
    if (options.sort) {
      if (Array.isArray(options.sort)) {
        options.sort.forEach((sortField) => params.append("sort", sortField));
      } else {
        params.append("sort", options.sort);
      }
    }

    // Handle pagination
    if (options.pagination) {
      Object.entries(options.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(`pagination[${key}]`, String(value));
        }
      });
    }

    // Handle fields
    if (options.fields) {
      options.fields.forEach((field) => params.append("fields", field));
    }

    // Handle publication state
    if (options.publicationState) {
      params.append("publicationState", options.publicationState);
    }

    return params.toString();
  }

  async fetch<T>(
    endpoint: string,
    options: StrapiRequestOptions = {},
    requestOptions: { next?: { revalidate?: number } } = {}
  ): Promise<T> {
    const queryString = this.buildQueryString(options);
    const url = `${this.baseURL}/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...requestOptions,
    });

    if (!response.ok) {
      throw new Error(
        `Strapi request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Convenience methods for common operations
  async findMany<T>(
    contentType: string,
    options: StrapiRequestOptions = {}
  ): Promise<StrapiResponse<T[]>> {
    return this.fetch<StrapiResponse<T[]>>(contentType, options);
  }

  async findOne<T>(
    contentType: string,
    id: string | number,
    options: StrapiRequestOptions = {}
  ): Promise<StrapiResponse<T>> {
    return this.fetch<StrapiResponse<T>>(`${contentType}/${id}`, options);
  }

  async findBySlug<T>(
    contentType: string,
    slug: string,
    options: StrapiRequestOptions = {}
  ): Promise<T | null> {
    const response = await this.findMany<T>(contentType, {
      ...options,
      filters: { slug: { $eq: slug } },
      pagination: { limit: 1 },
    });

    return response.data[0] || null;
  }
}

export const strapiClient = new StrapiClient();
