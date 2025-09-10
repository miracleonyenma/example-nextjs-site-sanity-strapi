// ./src/app/products/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { strapiRequest } from "@/lib/strapi-client";
import { adaptStrapiProduct, getStrapiImageUrl } from "@/utils/strapi-adapter";

const options = { next: { revalidate: 30 } };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await strapiRequest(`products/${id}`, options);
  const product = adaptStrapiProduct(response.data);

  if (!product) {
    return (
      <main className="site-section">
        <div className="wrapper text-center">
          <div className="card error lg">
            <h1 className="card-title lg">Product not found</h1>
            <div className="card-content">
              <p>The product you&apos;re looking for doesn&apos;t exist.</p>
            </div>
            <div className="card-footer actions-center">
              <Link href="/products" className="btn primary">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="site-section">
      <div className="wrapper max-w-6xl">
        {/* Breadcrumb */}
        <Link href="/products" className="btn ghost sm mb-8 inline-flex">
          ← Back to products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            {product.gallery?.length > 0 && (
              <>
                {product.gallery.map(
                  (image: SanityImageSource, index: number) => {
                    const imageUrl = getStrapiImageUrl(image);
                    return imageUrl ? (
                      <div
                        key={index}
                        className="card borderless p-0 overflow-hidden"
                      >
                        <Image
                          src={imageUrl}
                          alt={`${product.name} image ${index + 1}`}
                          width={600}
                          height={400}
                          className="w-full rounded-3xl"
                        />
                      </div>
                    ) : null;
                  }
                )}
              </>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="card primary lg">
              <div className="card-header">
                <h1 className="card-title xl">{product.name}</h1>
                <p className="text-3xl font-bold text-emerald-600">
                  ${product.price}
                </p>
              </div>

              <div className="card-content">
                {/* Availability Status */}
                {!product.available && (
                  <div className="alert error">
                    <div className="wrapper">
                      <p className="alert-title">Out of Stock</p>
                      <p>This product is currently unavailable.</p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, index: number) => (
                        <span key={index} className="tag info">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {product.specifications && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Specifications:</h3>
                    <div className="card secondary">
                      <div className="card-content p-4 compact space-y-3">
                        {product.specifications.weight && (
                          <div className="flex justify-between">
                            <span className="font-medium">Weight:</span>
                            <span>{product.specifications.weight}</span>
                          </div>
                        )}
                        {product.specifications.dimensions && (
                          <div className="flex justify-between">
                            <span className="font-medium">Dimensions:</span>
                            <span>{product.specifications.dimensions}</span>
                          </div>
                        )}
                        {product.specifications.material && (
                          <div className="flex justify-between">
                            <span className="font-medium">Material:</span>
                            <span>{product.specifications.material}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-footer actions-center">
                <button
                  className={`btn lg ${product.available ? "primary" : "secondary"}`}
                  disabled={!product.available}
                >
                  {product.available ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
