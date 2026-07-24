from decimal import Decimal

import razorpay

from config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET


class PaymentGatewayError(Exception):
    pass


def get_client() -> razorpay.Client:
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise PaymentGatewayError("Razorpay is not configured (missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET)")

    return razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


def create_order(amount: Decimal, currency: str = "INR") -> dict:
    client = get_client()

    try:
        order = client.order.create(
            {
                "amount": int(amount * 100),  # Razorpay expects the amount in paise
                "currency": currency,
                "payment_capture": 1,
            }
        )
    except razorpay.errors.BadRequestError as exc:
        raise PaymentGatewayError(str(exc)) from exc

    return order


def verify_payment(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> dict:
    client = get_client()

    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            }
        )
    except razorpay.errors.SignatureVerificationError as exc:
        raise PaymentGatewayError("Payment could not be verified") from exc

    return {"payment_id": razorpay_payment_id, "order_id": razorpay_order_id, "status": "captured"}
