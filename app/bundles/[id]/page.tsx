import BundleDetailClient from "@/components/bundle/BundleDetailClient";

export default function BundlePage({ params }: { params: { id: string } }) {
  return <BundleDetailClient id={params.id} />;
}