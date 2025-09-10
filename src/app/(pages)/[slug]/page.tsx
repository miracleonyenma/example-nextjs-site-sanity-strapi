// ./src/app/(pages)/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiRequest } from "@/lib/strapi-client";
import { adaptStrapiPage } from "@/utils/strapi-adapter";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const options = { next: { revalidate: 30 } };

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await strapiRequest(
    `pages?populate=*&filters[slug][$eq]=${slug}`,
    options
  );

  const page = response.data[0] ? adaptStrapiPage(response.data[0]) : null;

  if (!page) {
    notFound();
  }
  return (
    <main className="site-section">
      <div className="wrapper max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {page.title}
          </h1>
        </div>

        {/* Page Content */}
        {page.body && (
          <article className="card default lg">
            <div className="prose prose-lg prose-emerald max-w-none">
              {page.body && <BlocksRenderer content={page.body} />}
            </div>
          </article>
        )}

        {/* Navigation Footer */}
        <div className="mt-12 text-center">
          <Link href="/" className="btn tertiary">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await strapiRequest(
    `pages?populate=*&filters[slug][$eq]=${slug}`,
    options
  );

  const page = response.data[0] ? adaptStrapiPage(response.data[0]) : null;

  return {
    title: page?.seo?.title || page?.title || "Page",
    description: page?.seo?.description || "",
  };
}
