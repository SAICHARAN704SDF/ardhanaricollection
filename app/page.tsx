export const dynamic = "force-dynamic";
import { Home } from "@/components/home/home";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "The art of timeless drapes",
  "Discover a considered collection of sarees, flowing silk and Indian textile artistry. Demo storefront.",
  "/",
);
export default function Page() {
  return <Home />;
}
