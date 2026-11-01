import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status.toLowerCase()) {
    case "scheduled":
      return <Badge variant="default">Scheduled</Badge>;
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "paid":
      return <Badge variant="success">Paid</Badge>;
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "available":
      return <Badge variant="success">Available</Badge>;
    case "unavailable":
      return <Badge variant="secondary">Unavailable</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

