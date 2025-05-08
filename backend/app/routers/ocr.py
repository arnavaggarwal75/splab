from fastapi import APIRouter, UploadFile, File
import io
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
# v1 dependencies
from PIL import Image
from transformers import pipeline

# v2 dependencies
import json
from google import genai
from google.genai import types

from ..utils import parse_xml

# v1 setup
if not os.path.isdir('receipt_model'):
    # pipe = pipeline("image-to-text", model="selvakumarcts/sk_invoice_receipts")
    # pipe.save_pretrained('receipt_model')
    pass
else:
    # pipe = pipeline('image-to-text', 'receipt_model')
    pass

def extract_receipt_info(file_data: bytes, filename: str):
    image = Image.open(io.BytesIO(file_data))
    xml_text = pipe(images=image)[0]['generated_text']
    receipt_dict = parse_xml.receipt_xml_to_dict(xml_text)
    return {"filename": filename, "data": receipt_dict}

# v2 setup
load_dotenv()
if os.getenv('GEMINI_API_KEY'):
    gemini_client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
prompt_v2 = """
Extract all the items and shared fees ordered from this receipt in the format of a list of dictionaries
items refers to things the customer bought such as food or drink (note that item amounts should be floating point numbers and should not have a $ symbol)
fees refers to fees that are subjected to the whole table which includes but is not limited to, service charge, tax, gratuity fee, restraunt fee, delivery fee, etc.
discounts are added to items if it for a specific item, otherwise it is added to fees
Necessary format:
{
    "items": [
        {
            "name": "itemA",
            "price": 5,
        },
        {
            "name": "itemB",
            "price": 2.5,
        },
        {
            "name": "discountA"
            "price": -2,
        }
    ],
    "fees": [
        {
            "name": "Tax",
            "amount": 0.25
        },
        {
            "name": "Service Charge",
            "amount": 0.5
        }
    ]
}
Please provide the response in the form of a JSON string compatible with the json.loads method.
It should begin with "{" and end with "}".
"""

def parse_llm_output(response_text):
    start, end = (0, 0)
    for i in range(len(response_text)):
        if response_text[i] == "{":
            start = i
            break
    for i in range(len(response_text)):
        if response_text[len(response_text) - i - 1] == "}":
            end = i
            break
    response_text = response_text[start : -end]
    return json.loads(response_text)


# Router code #
router = APIRouter(
    prefix="/ocr",
    tags=["ocr"]
)

@router.post("/v1/extract")
async def extract_receipt_v1(file: UploadFile):
    image_data = await file.read()
    result = extract_receipt_info(image_data, file.filename or "")
    return result['data']

@router.post("/v2/extract")
async def extract_receipt_v2(file: UploadFile):
    if not gemini_client:
        return JSONResponse(
            status_code=301,
            content={"error": "Extraction version not properly initialized"}
        )
    image_bytes = await file.read()
    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash", 
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type='image/jpeg',
            ),
            prompt_v2,
        ]
    )
    receipt_dict = parse_llm_output(response.text)
    # additional data processing
    index = 0
    while index < len(receipt_dict['items']):
        item = receipt_dict['items'][index]
        if not item['price'] or not item['name'] or item['price'] == 0:
            del receipt_dict['items'][index]
            index -= 1
        else:
            index += 1
    return JSONResponse(
        status_code=200,
        content=receipt_dict
    )

@router.get("/")
async def test_root():
    return {"Hello from the ocr !"}
