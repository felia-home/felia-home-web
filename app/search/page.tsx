import { Suspense } from "react";
import PropertySearchClient from "@/components/property/PropertySearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "80px 24px", textAlign: "center", color: "#888" }}>
          読み込み中...
        </div>
      }
    >
      <PropertySearchClient />
    </Suspense>
  );
}
