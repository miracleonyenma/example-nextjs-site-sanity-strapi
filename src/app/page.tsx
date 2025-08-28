// ./src/app/page.tsx (improved with design system)
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
      <section className="site-section bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="wrapper text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Welcome to Jade Palace
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Discover amazing products and insightful content in our curated
            collection
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="btn primary lg">
              Shop Now
            </Link>
            <Link href="/blog" className="btn secondary lg">
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      <div className="site-section">
        <div className="wrapper space-y-16">
          {/* Featured Products */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Featured Products
              </h2>
              <Link href="/products" className="btn ghost">
                View All →
              </Link>
            </div>
            <div className="card-grid cols-4">
              {products.map((product) => {
                const imageUrl = product.gallery?.[0]
                  ? urlFor(product.gallery[0])?.width(300).height(200).url()
                  : null;
                return (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="card default raised hoverable interactive"
                  >
                    {imageUrl && (
                      <div className="card-media">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <div className="card-content p-2 pb-4">
                      <h3 className="card-title sm">{product.name}</h3>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${product.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Latest Posts */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold">Latest Posts</h2>
              <Link href="/blog" className="btn ghost">
                View All →
              </Link>
            </div>
            <div className="card-grid cols-3">
              {posts.map((post) => {
                const imageUrl = post.image
                  ? urlFor(post.image)?.width(400).height(250).url()
                  : null;
                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="card default raised hoverable interactive"
                  >
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
                    <div className="card-content compact p-2 pb-4">
                      <h3 className="card-title sm">{post.title}</h3>
                      <p className="card-subtitle">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
