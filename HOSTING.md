# Hosting Your Wedding Website & Getting a URL

Your site is just static files (`index.html`, `styles.css`, `script.js`). You can host it for **free** and optionally use a custom URL (e.g. `yournameswedding.com`).

---

## Option 1: GitHub Pages (free, easy)

**URL you get:** `https://yourusername.github.io/WeddingSite/`  
**Custom URL:** You can add your own domain later.

### Steps

1. **Create a GitHub account** at [github.com](https://github.com) if you don’t have one.

2. **Create a new repository**
   - Click **New repository**
   - Name it e.g. `WeddingSite` (or `yournames-wedding`)
   - Public, no need to add README or .gitignore
   - Create repository

3. **Push your project**
   - In Terminal, from your project folder:
   ```bash
   cd /Users/josephdoyle/WeddingSite
   git init
   git add index.html styles.css script.js README.md HOSTING.md
   git commit -m "Wedding website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/WeddingSite.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `WeddingSite` with your GitHub username and repo name.

4. **Turn on GitHub Pages**
   - Repo → **Settings** → **Pages**
   - Under “Source”, choose **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → Save
   - In 1–2 minutes the site will be at:  
     `https://YOUR_USERNAME.github.io/WeddingSite/`

---

## Option 2: Netlify (free, drag-and-drop)

**URL you get:** `https://random-name-123.netlify.app` (you can change the “random-name” in site settings)  
**Custom URL:** You can connect a domain in Netlify.

### Steps

1. Go to [netlify.com](https://www.netlify.com) and sign up (free).

2. **Deploy**
   - **Sites** → **Add new site** → **Deploy manually**
   - Drag your **WeddingSite** folder (the one that contains `index.html`) into the drop zone.
   - Netlify will give you a URL like `https://something.netlify.app`.

3. **Custom subdomain (optional)**  
   Site **Domain settings** → **Options** → **Edit site name** → choose e.g. `joe-and-jane-wedding`.

---

## Option 3: Vercel (free)

**URL you get:** `https://wedding-site-xxx.vercel.app`  
**Custom URL:** You can add your own domain in the project settings.

### Steps

1. Install Vercel CLI: `npm i -g vercel` (requires Node.js).

2. From your project folder:
   ```bash
   cd /Users/josephdoyle/WeddingSite
   vercel
   ```
   Follow the prompts (log in if needed). You’ll get a live URL right away.

---

## Getting a custom URL (e.g. yournameswedding.com)

You have two parts: **hosting** (above) and **domain name**.

### A. Buy a domain

- **Registrars:** [Namecheap](https://www.namecheap.com), [Google Domains](https://domains.google), [Cloudflare](https://www.cloudflare.com/products/registrar/), [Porkbun](https://porkbun.com).
- Search for a name (e.g. `joeandjanewedding.com`, `smiths-get-married.com`). Typical cost: **about $10–15/year**.

### B. Point the domain to your host

- **GitHub Pages:** Repo → **Settings** → **Pages** → **Custom domain** → enter your domain, then at your registrar add the DNS records GitHub shows (usually an A record or CNAME).
- **Netlify:** **Domain settings** → **Add custom domain** → enter domain → follow Netlify’s DNS instructions at your registrar.
- **Vercel:** Project → **Settings** → **Domains** → add your domain and use the DNS records Vercel gives you.

Your registrar’s “DNS” or “Nameservers” section is where you add those records. Changes can take from a few minutes up to 48 hours.

---

## RSVP and forms

The current RSVP section is a placeholder. To collect responses:

1. **Google Forms** – Create a form, add questions (name, email, number attending, etc.), then either:
   - Link the “Send RSVP” button to the form URL, or  
   - Use the form’s embed code in place of the current form (paste into `index.html` in a new section).
2. **Wedding platforms** – Zola, The Knot, Joy, etc. often provide an RSVP page. Link your button to that page.
3. **Typeform / Tally** – Build a form and link the button to it.

---

## Quick comparison

| Option        | Free? | URL you get                    | Custom domain? |
|---------------|-------|---------------------------------|----------------|
| GitHub Pages  | Yes   | username.github.io/repo-name    | Yes            |
| Netlify       | Yes   | something.netlify.app          | Yes            |
| Vercel        | Yes   | project.vercel.app             | Yes            |

Start with one of the free hosts to get a URL live, then add a custom domain if you want a “real” wedding URL.

---

## Footer background video (GitHub file size)

GitHub blocks files **larger than 100 MB**. The full screen recording should stay **out of Git** (see `.gitignore`: `assets/footer-bg.mov`). The site uses a **compressed** `assets/footer-bg.m4v` in the repo.

To re-export after changing the recording on your Mac:

```bash
/usr/bin/avconvert --source "/path/to/your/recording.mov" --preset PresetAppleM4VWiFi \
  --output "/Users/josephdoyle/WeddingSite/assets/footer-bg.m4v" --replace --progress
```

For higher quality (larger file), try e.g. `PresetAppleM4V720pHD` or `PresetMediumQuality` (still keep the output under **100 MB** before committing).