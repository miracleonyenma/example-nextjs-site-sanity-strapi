// ./src/app/blog/[slug]/page.tsx
import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options
  );

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(800).height(400).url()
    : null;

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
        {postImageUrl && (
          <div className="mb-8">
            <Image
              src={postImageUrl}
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
            {Array.isArray(post.body) && <PortableText value={post.body} />}
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
