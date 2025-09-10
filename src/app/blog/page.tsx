/* eslint-disable @typescript-eslint/no-explicit-any */
// ./src/app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import { strapiRequest } from "@/lib/strapi-client";
import { adaptStrapiPost, getStrapiImageUrl } from "@/utils/strapi-adapter";

const options = { next: { revalidate: 30 } };

export default async function BlogPage() {
  const response = await strapiRequest(
    "posts?populate=*&sort=publishedAt:desc",
    options
  );

  const posts = response.data.map(adaptStrapiPost);
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
          {posts.map((post: any) => {
            const imageUrl = post.image ? getStrapiImageUrl(post.image) : null;
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
