import { createFileRoute } from "@tanstack/react-router";
import { InventoryDashboard } from "@/components/inventory/dashboard";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <InventoryDashboard />;
}
