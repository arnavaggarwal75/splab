# Splab

## Inspiration
Restaurants don't like splitting bills by item, and sometimes nobody wants to pay the whole bill.
So, there needs to be a way to keep track of who owes what without any nagging.
And while some apps do exists for this, they all have a genuine barrier to entry.

## What it does
With no downloads or sign up required, our solution lets users split tabs with ease.
Just take a picture of your receipt, send a link to your party, and everyone can mark of their items as they pay.

In detail, user's access our service through their web browser of choice.
Then, they take a picture of their receipt, and a request is sent to our back-end micro-service with the image payload.
This service passes the receipt through a pre-trained model to extract the total price, item names, etc.
Then, those details are shown to the user in an intuitive checklist format.
From there, the user can share the checklist with their party through a link.
As the group modifies their local copy of the list, live syncing is orchestrated through another separate back-end service.

## How we built it
Technologies: React, Sockets.io, FastAPI, SQLite, Hugging Face Transformer.

## Challenges we ran into
- Integrating Sockets.io for live syncing
- Doing receipt recognition in a way that balances our time and model accuracy

## Accomplishments that we're proud of
- Full architectural plan
- Scalable back-end
- No API costs
- Finding an overlooked differentiator
- Unique model validation metric

## What we learned
- Integrating Sockets.io with React and FastAPI
- Building a unit-tested back-end with FastAPI
- Finding and running Hugging Face transformer models 

## What's next for Splab
- Improve recognition accuracy for highly abnormal receipts
- Improve recognition inference time
- Implement QR Codes for sharing links