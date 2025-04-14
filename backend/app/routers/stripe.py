import os
import stripe 
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(prefix="/stripe", tags=["stripe"])

@router.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": int(data["amount"] * 100),  # convert dollars to cents
                        "product_data": {
                            "name": data["item_name"]
                        },
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url="http://localhost:5173/member-final?code=" + data["tab_id"],
            cancel_url="http://localhost:5173/member-final?code=" + data["tab_id"],
            metadata={
                "tab_id": data["tab_id"],
                "member_id": data["member_id"]
            }
        )
        return {"url": checkout_session.url}
    
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"error": str(e)})
