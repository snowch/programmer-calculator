# Programmer Calculator

An offline-first programmer calculator that installs as an app on Android, iOS and desktop.
Hex / dec / oct / bin, bitwise ops, shifts, rotates, byte swaps, CPU-style C/V/Z/N flags, Unicode lookup, and a set of
digital-design exercises with progress saved on the device. The ? button in the title row opens
an in-app help page.

**Live app:** https://snowch.github.io/programmer-calculator/

**Two's complement tutorial (PDF):** https://snowch.github.io/programmer-calculator/docs/twos-complement.pdf
— a standalone seven-page explainer (reading and writing negatives, the NOT operation, modulo
arithmetic, overflow, width changes, hex, shifts, practice problems and a cheat sheet) that the
calculator's exercise groups follow.

**Bit Lab (gates, bits and flags):** https://snowch.github.io/programmer-calculator/docs/bit-lab.html
— an interactive gate-level view of a miniature ALU: tap bits, pick an operation, and watch the wires,
the carries and the N Z C V flags, with a table of example instructions, guided exercises, and a
breadboard build guide with a schematic. Two companion pages are its prerequisites:
[From gates to an ALU](https://snowch.github.io/programmer-calculator/docs/gates-to-alu.html) (a full
adder from five gates, four of them chained, the ripple) and
[From gates to a register](https://snowch.github.io/programmer-calculator/docs/gates-to-register.html)
(a latch from NOR gates, the clock, a 4-bit register).

## Files

Everything is static and lives at the repository root (all paths are relative, so the app
works from any sub-path):

| File | Purpose |
| --- | --- |
| `index.html` | The calculator and the exercises (single file, no build step) |
| `manifest.webmanifest` | App name, icons, screenshots, standalone display |
| `sw.js` | Service worker: caches the app shell so it works offline |
| `icon-*.png` | 192 px / 512 px icons, plus maskable variants for Android |
| `screenshots/` | Images shown in the install dialog (Android / desktop) |
| `docs/twos-complement.html`, `docs/twos-complement.pdf` | The two's complement tutorial: print-ready HTML source and the PDF rendered from it |
| `docs/bit-lab.html` | Bit Lab: an interactive gate-level lab on bitwise operations, binary arithmetic and the N Z C V flags |
| `docs/gates-to-alu.html`, `docs/gates-to-register.html` | The Bit Lab's companion pages: a full adder and a 4-bit ripple adder from gates; a latch, a clock and a register from gates |
| `docs/adding-to-subtracting.html` | From adding to subtracting: wrap-around on a 16-position wheel, negation as NOT then add 1, and the adder subtracting with the borrow read off the carry, with bits you can tap |
| `docs/flag-drills.html` | Flag drills: randomised predict-then-check exercises on CMP flags, ARM signed/unsigned branches, recovering a type from compiled code, and widening loads |
| `.github/workflows/pages.yml` | Deploys the site to GitHub Pages on every push to `main` |
| `.nojekyll` | Tells GitHub Pages to publish the files as-is |

## Deployment (GitHub Pages)

Every push to `main` runs the **Deploy to GitHub Pages** workflow, which uploads the repository
root as the site and publishes it at https://snowch.github.io/programmer-calculator/.

The repository must be set to deploy from GitHub Actions (one-time setting):
**Settings → Pages → Build and deployment → Source: GitHub Actions**.
You can also start a deploy by hand from the Actions tab (*Run workflow*).

## Installing as an app

The site is served over HTTPS with a web app manifest and a service worker, so browsers offer
to install it:

- **Android (Chrome / Edge / Samsung Internet):** tap the **install app** button in the header,
  or ⋮ → **Install app** / **Add to Home screen**. The app opens full-screen in its own window,
  gets its own icon and splash screen, and works offline.
- **iOS / iPadOS (Safari):** Share → **Add to Home Screen** (iOS does not show an install prompt).
- **Desktop (Chrome / Edge):** click the install icon at the right end of the address bar.

### Publishing to Google Play (optional)

The installed PWA already behaves like a native app. If you also want a listing on Google Play,
wrap the site in a Trusted Web Activity:

1. Open https://www.pwabuilder.com/, enter `https://snowch.github.io/programmer-calculator/`
   and choose **Android** to generate a signed Android package.
2. Put the generated `assetlinks.json` (it contains your signing key's SHA-256 fingerprint) at
   `.well-known/assetlinks.json` in this repository so the app launches without a browser bar.
3. Upload the package to the Play Console.

## Updating the app

Edit `index.html`, then bump `VERSION` in `sw.js` (for example `pc-v1` → `pc-v2`). Installed
copies pick up the new version the next time they launch with a network connection.

## Testing locally

Service workers do not register from `file://`, so serve the folder over HTTP:

```sh
python3 -m http.server 8000
```

then open http://localhost:8000/ (localhost counts as a secure context).
