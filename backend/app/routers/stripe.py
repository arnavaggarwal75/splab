import os
import stripe 
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.db import set_stripe_account_id, get_stripe_account_id

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(prefix="/stripe", tags=["stripe"])

@router.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()
    tab_owner_stripe_id = get_stripe_account_id(data["tab_id"])

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
            success_url="http://localhost:5173/member-success?code=" + data["tab_id"] + "&memberId=" + data["member_id"],
            cancel_url="http://localhost:5173/member-final?code=" + data["tab_id"],
            metadata={
                "tab_id": data["tab_id"],
                "member_id": data["member_id"]
            },
            payment_intent_data={
                'transfer_data': {
                    'destination': tab_owner_stripe_id,  # From your DB
                },
            }
        )
        return {"url": checkout_session.url}
    
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/onboard")
async def create_account_link(request: Request):
    data = await request.json()
    tab_id = data.get("tab_id")
    member_id = data.get("member_id")  # You can pass this from frontend to track
    account = stripe.Account.create(type="express", country="US",  
                                    capabilities={"transfers": {"requested": True}}, 
                                    business_type="individual",
                                    business_profile={
                                        "product_description": "Splitting the tab with friends at restaurants",
                                    })
    account_link = stripe.AccountLink.create(
        account=account.id,
        refresh_url="http://localhost:5173/",
        return_url=f"http://localhost:5173/get-link?code={tab_id}",
        type="account_onboarding",
    )
    set_stripe_account_id(tab_id, member_id, account.id)
    return JSONResponse({"url": account_link.url, "account_id": account.id})