import OrdersView from "../OrdersView";

export default function PendingOrdersPage() {
  return <OrdersView pageTitle="Menunggu Klien" statusFilter="PENDING" />;
}
