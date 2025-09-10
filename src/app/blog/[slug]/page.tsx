// ./src/app/blog/[slug]/page.tsx
import { PortableText } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { strapiRequest } from "@/lib/strapi-client";
import { adaptStrapiPost, getStrapiImageUrl } from "@/utils/strapi-adapter";
import { notFound } from "next/navigation";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await strapiRequest(
    `posts?populate*&filters[slug][$eq]=${slug}`,
    options
  );

  const post = response.data[0] ? adaptStrapiPost(response.data[0]) : null;
  const imageUrl = getStrapiImageUrl(post?.image);

  if (!post) {
    notFound();
  }
  return (
    <main className="site-section">
      <div className="wrapper max-w-4xl">
        {/* Back Navigation */}
        <Link href="/blog" className="btn ghost sm mb-8 inline-flex">
          ← Back to blog
        </Link>

        {/* Article Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <time className="text-sm">
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
          </div>
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="mb-8">
            <Image
              src={imageUrl}
              alt={post.title}
              className="w-full aspect-video rounded-3xl object-cover"
              width={800}
              height={400}
            />
          </div>
        )}

        {/* Article Content */}
        <article className="card default lg">
          <div className="prose prose-lg prose-emerald max-w-none">
            {Array.isArray(post.body) && <BlocksRenderer content={post.body} />}
          </div>
        </article>

        {/* Back to Blog CTA */}
        <div className="mt-12 text-center">
          <Link href="/blog" className="btn primary">
            Read More Articles
          </Link>
        </div>
      </div>
    </main>
  );
}
