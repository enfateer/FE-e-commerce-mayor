import { Badge } from 'flowbite-react';

const statusConfig = {
  pending: { color: 'warning', label: 'Pending' },
  accepted: { color: 'info', label: 'Accepted' },
  in_progress: { color: 'purple', label: 'In Progress' },
  delivered: { color: 'indigo', label: 'Delivered' },
  completed: { color: 'success', label: 'Completed' },
  cancelled: { color: 'failure', label: 'Cancelled' },
  rejected: { color: 'failure', label: 'Rejected' },
};

const OrderStatusBadge = ({ status }) => {
  const config = statusConfig[status] || { color: 'gray', label: status };

  return (
    <Badge color={config.color} size="sm" className="capitalize">
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
