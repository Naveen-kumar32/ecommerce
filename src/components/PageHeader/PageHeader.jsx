// Styles
import "./PageHeader.css";

const PageHeader = ({ actions, kicker, subtitle, title }) => (
  <section className="page-header">
    <div>
      {kicker && <span className="page-header-kicker">{kicker}</span>}
      <h1 className="page-header-title">{title}</h1>
      {subtitle && <p className="page-header-sub">{subtitle}</p>}
    </div>
    {actions && <div className="page-header-actions">{actions}</div>}
  </section>
);

export default PageHeader;
