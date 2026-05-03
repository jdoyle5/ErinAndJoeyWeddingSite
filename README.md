# Our Wedding Website

A simple, elegant one-page wedding site. Easy to customize and host for free.

## What’s included

- **Hero** – Your names, date, and location
- **Our Story** – Short story section
- **Event Details** – Ceremony and reception (time, venue, address)
- **RSVP** – Form placeholder (connect to Google Forms or your RSVP tool)
- **Registry** – Links to your registries
- **Footer** – Closing line and names

## Customize

1. **Names and date** – Edit `index.html`: update “Your Name & Partner's Name”, the date line, and location in the hero and footer.
2. **Our Story** – Replace the placeholder paragraphs in the “Our Story” section with your own text.
3. **Event Details** – Update ceremony and reception times, venue names, and addresses.
4. **RSVP** – Either link the button to an external RSVP form (Google Forms, Zola, etc.) or change the form `action` to your form endpoint. See `HOSTING.md` for options.
5. **Registry** – Replace the `#` in the registry links with your real registry URLs and label them (e.g. “Crate & Barrel”, “Amazon”).

## Run locally

Open `index.html` in a browser, or use a simple server:

```bash
# Python 3
python3 -m http.server 8000

# Then open http://localhost:8000
```

## Hosting and URL

See **HOSTING.md** for step-by-step hosting and custom URL options (GitHub Pages, Netlify, Vercel, and buying a domain).
