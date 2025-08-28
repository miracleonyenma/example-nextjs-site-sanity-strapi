// ./src/app/blog/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){
  _id, title, slug, publishedAt, image,
  authors[]->{ name },
  categories[]->{ title }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function BlogPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="site-section">
      <div className="wrapper">
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover insights, stories, and updates from our community
          </p>
        </div>

        <div className="card-grid cols-3">
          {posts.map((post) => {
            const imageUrl = post.image
              ? urlFor(post.image)?.width(400).height(250).url()
              : null;
            return (
              <article key={post._id} className="card default raised hoverable">
                <Link href={`/blog/${post.slug.current}`} className="block">
                  {imageUrl && (
                    <div className="card-media">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="card-header borderless px-2">
                    <h2 className="card-title">{post.title}</h2>
                    <p className="card-subtitle">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="card-content compact px-2 pb-4">
                    {post.authors?.length > 0 && (
                      <p className="text-sm text-muted-foreground mb-3">
                        By{" "}
                        {post.authors
                          .map((author: { name: string }) => author.name)
                          .join(", ")}
                      </p>
                    )}

                    {post.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.categories.slice(0, 2).map(
                          (
                            category: {
                              title: string;
                            },
                            index: number
                          ) => (
                            <span key={index} className="tag info xs">
                              {category.title}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
