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
    <main className="container mx-auto max-w-6xl px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const imageUrl = product.gallery?.[0]
            ? urlFor(product.gallery[0])?.width(400).height(300).url()
            : null;
          return (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ${product.price}
                </p>
                {!product.available && (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
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
