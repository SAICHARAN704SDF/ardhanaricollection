import { auth } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { AccountPanel } from "@/components/layout/forms";
const sections = [
  "profile",
  "addresses",
  "orders",
  "wishlist",
  "sign-in",
  "sign-up",
];
export const metadata = { title: "Your account" };
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  if (section === "sign-in") redirect('/sign-in');
  if (section === "sign-up") redirect('/sign-up');
  await auth.protect();
  if (section === "profile") return <section className="auth-section"><h1>Your account</h1><Suspense><UserProfile routing="hash" /></Suspense></section>;
  if (section === "wishlist") redirect("/wishlist");
  return <AccountPanel section={section} />;
}
