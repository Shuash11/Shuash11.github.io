# Joashua — Portfolio

Motion-first, dark portfolio. Built with pure HTML, CSS, and JavaScript.

**Live:** https://shuash11.github.io

## Pages
- `index.html` — Home (hero with scroll-morphing image, marquee, featured work, stats)
- `about.html` — About (portrait, skill bars, services, timeline)
- `work.html` — Work (filterable, 3D-tilt project grid)
- `contact.html` — Contact (form + details)

## Structure
```
css/style.css     design system + all animations
js/main.js        preloader, smooth scroll, cursor, reveals, morphs
assets/img/       SVG placeholder artwork
assets/favicon.svg
```

## How to customize
1. **Images** — replace the `.svg` files in `assets/img/` with your own photos/screenshots (same filenames, or update the `src` attributes in the HTML). Also swap `hero-1.svg` (home hero) and `portrait.svg` (about page).
2. **Projects** — edit the project titles/tags/link in `work.html` and the featured 3 in `index.html`.
3. **Name/brand** — change `Joashua` text in the header logo, hero title, and footer.
4. **Email/phone/socials** — update in `contact.html` and the footers (GitHub link already points to `Shuash11`).
5. **Accent color** — change `--accent` in `css/style.css` (`#d7ff3e`).

## Motion features
- Preloader with counter + curtain lift
- Lenis smooth scrolling (CDN)
- Hero image morphs from ellipse to full-bleed as you scroll
- Clip-path "morphing" reveals per section
- Letter-by-letter headline reveals, magnetic buttons, custom cursor
- Animated counters, skill bars, 3D tilt cards, work filters, marquee

## Run locally
```
python -m http.server 8000
```
or open the HTML files directly in a browser.
