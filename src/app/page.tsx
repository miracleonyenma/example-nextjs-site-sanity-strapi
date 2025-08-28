// ./src/app/page.tsx (updated homepage)
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...3]{_id, title, slug, publishedAt, image}`;

const PRODUCTS_QUERY = `*[
  _type == "product"
  && available == true
]|order(_createdAt desc)[0...4]{_id, name, price, gallery}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function HomePage() {
  const [posts, products] = await Promise.all([
    client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options),
    client.fetch<SanityDocument[]>(PRODUCTS_QUERY, {}, options),
  ]);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-6xl px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to Your Site</h1>
            <p className="text-xl mb-8 opacity-90">
              Discover amazing products and insightful content
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Shop Now
              </Link>
              <Link
                href="/blog"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-8 py-16">
        {/* Featured Products */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              href="/products"
              className="text-blue-600 hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = product.gallery?.[0]
                ? urlFor(product.gallery[0])?.width(300).height(200).url()
                : null;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Latest Posts */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <Link
              href="/blog"
              className="text-blue-600 hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
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
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
