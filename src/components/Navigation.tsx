// ./src/components/Navigation.tsx
import Link from "next/link";
import { getNavigationPages, MAIN_NAV_SLUGS } from "@/lib/navigation";

export default async function Navigation() {
  const pages = await getNavigationPages();
  const mainNavPages = pages.filter((page) =>
    MAIN_NAV_SLUGS.includes(page.slug.current)
  );

  return (
    <nav className="site-header">
      <div className="wrapper">
        <Link
          href="/"
          className="text-2xl font-bold text-emerald-700 dark:text-emerald-300"
        >
          Jade Palace
        </Link>

        <div className="flex gap-2">
          <Link href="/" className="btn ghost sm">
            Home
          </Link>
          <Link href="/products" className="btn ghost sm">
            Products
          </Link>
          <Link href="/blog" className="btn ghost sm">
            Blog
          </Link>
          {mainNavPages.map((page) => (
            <Link
              key={page._id}
              href={`/${page.slug.current}`}
              className="btn ghost sm"
            >
              {page.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
