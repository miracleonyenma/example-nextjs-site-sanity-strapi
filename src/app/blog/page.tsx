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
    <main className="container mx-auto max-w-6xl px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const imageUrl = post.image
            ? urlFor(post.image)?.width(400).height(250).url()
            : null;
          return (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                {post.authors?.length > 0 && (
                  <p className="text-gray-600 text-sm mb-2">
                    By{" "}
                    {post.authors
                      .map((author: { name: string }) => author.name)
                      .join(", ")}
                  </p>
                )}
                {post.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.categories.slice(0, 2).map(
                      (
                        category: {
                          title: string;
                        },
                        index: number
                      ) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {category.title}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
