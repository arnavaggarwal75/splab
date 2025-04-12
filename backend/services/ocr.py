from ..model import pipe
from ..utils import parse_xml
from PIL import Image
import io

def extract_receipt_info(file_data: bytes, filename: str):
    image = Image.open(io.BytesIO(file_data))
    xml_text = pipe(images=image)[0]['generated_text']
    receipt_dict = parse_xml.receipt_xml_to_dict(xml_text)
    return {"filename": filename, "data": receipt_dict}
