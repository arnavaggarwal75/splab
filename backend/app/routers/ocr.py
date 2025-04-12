from fastapi import APIRouter, UploadFile
from PIL import Image
import io
from transformers import pipeline
import os

from ..utils import parse_xml


if not os.path.isdir('receipt_model'):
    pipe = pipeline("image-to-text", model="selvakumarcts/sk_invoice_receipts")
    pipe.save_pretrained('receipt_model')
else:
    pipe = pipeline('image-to-text', 'receipt_model')

def extract_receipt_info(file_data: bytes, filename: str):
    image = Image.open(io.BytesIO(file_data))
    xml_text = pipe(images=image)[0]['generated_text']
    receipt_dict = parse_xml.receipt_xml_to_dict(xml_text)
    return {"filename": filename, "data": receipt_dict}

router = APIRouter(
    prefix="/ocr",
    tags=["ocr"]
)

@router.post("/extract")
async def extract_receipt(file: UploadFile):
    image_data = await file.read()
    result = extract_receipt_info(image_data, file.filename)
    return result

@router.get("/")
async def test_root():
    return {"Hello from the ocr !"}
