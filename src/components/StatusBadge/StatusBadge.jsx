// Constants
import { getOrderStatusLabel } from "../../constants/orderStatus";

// Styles
import "./StatusBadge.css";

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-badge-${status}`}>{getOrderStatusLabel(status)}</span>
);

export default StatusBadge;
