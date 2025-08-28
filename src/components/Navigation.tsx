// ./src/components/Navigation.tsx
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto max-w-6xl px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Your Site
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-600">
              Products
            </Link>
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
