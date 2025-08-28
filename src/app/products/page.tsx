// ./src/app/products/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const PRODUCTS_QUERY = `*[
  _type == "product"
]|order(name asc){_id, name, price, available, tags, gallery}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function ProductsPage() {
  const products = await client.fetch<SanityDocument[]>(
    PRODUCTS_QUERY,
    {},
    options
  );

  return (
    <main className="site-section">
      <div className="wrapper">
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collection of premium products
          </p>
        </div>

        <div className="card-grid cols-3">
          {products.map((product) => {
            const imageUrl = product.gallery?.[0]
              ? urlFor(product.gallery[0])?.width(400).height(300).url()
              : null;
            return (
              <article
                key={product._id}
                className="card default raised hoverable"
              >
                <Link href={`/products/${product._id}`} className="block">
                  {/* Product Badge */}
                  {!product.available && (
                    <div className="card-badge">
                      <span className="tag error sm">Out of Stock</span>
                    </div>
                  )}

                  {imageUrl && (
                    <div className="card-media">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="card-header borderless px-4">
                    <h2 className="card-title">{product.name}</h2>
                    <p className="text-2xl font-bold text-emerald-600">
                      ${product.price}
                    </p>
                  </div>

                  <div className="card-content compact pt-0 p-4">
                    {product.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.tags
                          .slice(0, 3)
                          .map((tag: string, index: number) => (
                            <span key={index} className="tag secondary xs">
                              {tag}
                            </span>
                          ))}
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
