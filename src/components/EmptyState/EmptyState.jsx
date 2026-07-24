// Third-party
import { Link } from "react-router-dom";

// Styles
import "./EmptyState.css";

const EmptyState = ({ actionLabel, actionTo, message }) => (
  <div className="empty-state">
    <p>{message}</p>
    {actionTo && <Link to={actionTo}>{actionLabel}</Link>}
  </div>
);

export default EmptyState;
