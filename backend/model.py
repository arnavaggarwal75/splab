from transformers import pipeline
import os

if not os.path.isdir('model'):
    pipe = pipeline("image-to-text", model="selvakumarcts/sk_invoice_receipts")
    pipe.save_pretrained('model')
else:
    pipe = pipeline('image-to-text', 'model')