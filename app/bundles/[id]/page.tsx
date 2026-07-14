import BundleDetailClient from "@/components/bundle/BundleDetailClient";

export default async function BundlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BundleDetailClient id={id} />;
}