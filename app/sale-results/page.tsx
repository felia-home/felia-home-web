// app/sale-results/page.tsx
// このページは /sell/results に統合されました
import { redirect } from "next/navigation";

export default function SaleResultsRedirect() {
  redirect("/sell/results");
}
