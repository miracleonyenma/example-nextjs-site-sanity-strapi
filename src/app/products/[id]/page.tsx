// ./src/app/products/[id]/page.tsx
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const PRODUCT_QUERY = `*[_type == "product" && _id == $id][0]{
  _id, name, price, available, tags, gallery, specifications
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const product = await client.fetch<SanityDocument>(
    PRODUCT_QUERY,
    await params,
    options
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="container mx-auto max-w-6xl px-8 py-16">
      <Link href="/products" className="hover:underline mb-8 inline-block">
        ← Back to products
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          {product.gallery?.length > 0 && (
            <div className="space-y-4">
              {product.gallery.map(
                (image: SanityImageSource, index: number) => {
                  const imageUrl = urlFor(image)?.width(600).height(400).url();
                  return imageUrl ? (
                    <Image
                      key={index}
                      src={imageUrl}
                      alt={`${product.name} image ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full rounded-lg"
                    />
                  ) : null;
                }
              )}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-green-600 mb-6">
            ${product.price}
          </p>

          {!product.available && (
            <p className="text-red-600 font-semibold mb-4">Out of Stock</p>
          )}

          {product.tags?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.specifications && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Specifications:</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {product.specifications.weight && (
                  <p>
                    <strong>Weight:</strong> {product.specifications.weight}
                  </p>
                )}
                {product.specifications.dimensions && (
                  <p>
                    <strong>Dimensions:</strong>{" "}
                    {product.specifications.dimensions}
                  </p>
                )}
                {product.specifications.material && (
                  <p>
                    <strong>Material:</strong> {product.specifications.material}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={!product.available}
          >
            {product.available ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </main>
  );
}
