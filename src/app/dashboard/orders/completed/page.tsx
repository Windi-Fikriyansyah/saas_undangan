import OrdersView from "../OrdersView";

export default function CompletedOrdersPage() {
  return <OrdersView pageTitle="Undangan Selesai" statusFilter="EXPIRED" />;
}
