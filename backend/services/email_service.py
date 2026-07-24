import logging

logger = logging.getLogger("email")


def send_invoice_email(to_email: str, order) -> bool:
    """Stub — logs the invoice instead of sending real email. Swap in real SMTP/SendGrid here."""
    lines = [f"Invoice for order #{order.id} — total ${order.total_amount}"]
    for item in order.items:
        lines.append(f"  {item.quantity} x {item.product_name_snapshot} @ ${item.price_at_purchase}")

    logger.info("[invoice-email] To: %s\n%s", to_email, "\n".join(lines))
    return True
