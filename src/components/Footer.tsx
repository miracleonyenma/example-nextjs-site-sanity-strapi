import Link from "next/link";

// ./src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="site-section bg-emerald-50 border-t border-emerald-100 dark:bg-emerald-950 dark:border-emerald-800">
      <div className="wrapper">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-4">
              Jade Palace
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your destination for premium products and insightful content.
              Crafted with care for discerning customers.
            </p>
            <div className="flex gap-2">
              <Link href="/products" className="btn tertiary sm">
                Shop Now
              </Link>
              <Link href="/blog" className="btn ghost sm">
                Read Blog
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                Products
              </Link>
              <Link
                href="/blog"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <Link
                href="/help"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                Help Center
              </Link>
              <Link
                href="/shipping"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                Returns
              </Link>
              <Link
                href="/privacy"
                className="block text-muted-foreground hover:text-emerald-600 text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-200 dark:border-emerald-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Jade Palace. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-emerald-600">
                Terms of Service
              </Link>
              <span className="divider"></span>
              <Link href="/privacy" className="hover:text-emerald-600">
                Privacy Policy
              </Link>
              <span className="divider"></span>
              <Link href="/cookies" className="hover:text-emerald-600">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
