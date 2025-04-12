import re
from functools import partial
from typing import Optional

def camel_case_to_english(text):
    text = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", text)
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", text)
    return text

# Generate a decorated pattern for getting singular fields from XML
def xml_field_pattern(field_name: str) -> str:
    return f'<{field_name}>\\s*(.*?)\\s*</{field_name}>'

# Return a list of each value for a field name from XML
def get_xml_field_data(
        field_name: str, 
        xml: str
    ) -> list[Optional[str]]:

    pattern = re.compile(xml_field_pattern(field_name))
    captures: list[str] = re.findall(pattern, xml)

    return captures if len(captures) > 0 else [None]

# Return a list of each value for a group of consecutive fields from XML
def get_xml_struct_field_data(
        field_names: list[str],
        xml: str
    ) -> list[list[Optional[str]]]:

    raw_pattern: str = ''.join(xml_field_pattern(name) for name in field_names)
    pattern = re.compile(raw_pattern)
    captures: list[list[str]] = [list(x) for x in re.findall(pattern, xml)]

    return captures if len(captures) > 0 else [None]

# Get first money value in string
# E.g. '$7.61 7.61' -> '$7.61'
def extract_money_value(
        raw: str
    ) -> Optional[str]:

    pattern = re.compile(r'(\$?)\s*(\d*\.?\d*)')
    match = pattern.match(raw)
    captures = match.groups()

    return ''.join(captures) if captures else None

# Transform an XML receipt to a dict (hard-coded fields)
def receipt_xml_to_dict(
        receipt_xml: str
    ) -> dict:

    receipt_field_getter = partial(get_xml_field_data, xml=receipt_xml)
    receipt_struct_field_getter = partial(get_xml_struct_field_data, xml=receipt_xml)

    store_name: str = receipt_field_getter('s_store_name')[0]
    sub_total: str = receipt_field_getter('s_subtotal')[0]
    tax: str = receipt_field_getter('s_tax')[0]
    total: str = extract_money_value(receipt_field_getter('s_total')[0])
    items: list[list[str]] = receipt_struct_field_getter([
        's_item_name', 's_item_value', 's_item_quantity'])
    for item in items:
        if item:
            item[0] = camel_case_to_english(item[0])
    
    return {
        'store_name': store_name,
        'sub_total': sub_total,
        'tax': tax,
        'total': total,
        'items': items
    }