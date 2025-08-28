// ./src/app/(pages)/[slug]/page.tsx
import { PortableText, type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { notFound } from "next/navigation";

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id, title, slug, body, seo
}`;

const options = { next: { revalidate: 30 } };

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await client.fetch<SanityDocument>(
    PAGE_QUERY,
    { slug },
    options
  );

  if (!page) {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-4xl px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      {page.body && (
        <div className="prose prose-lg max-w-none">
          <PortableText value={page.body} />
        </div>
      )}
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
  const page = await client.fetch<SanityDocument>(
    PAGE_QUERY,
    { slug },
    options
  );

  return {
    title: page?.seo?.title || page?.title || "Page",
    description: page?.seo?.description || "",
  };
}
