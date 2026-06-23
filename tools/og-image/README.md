# OG image generation

`public/og-image.png` (1200×630) is rendered from [`og.html`](./og.html) with
headless Chrome at 2× and downscaled. Re-run after editing the template or the
brand crest:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,630 \
  --default-background-color=00000000 --virtual-time-budget=4000 \
  --screenshot=/tmp/og-2x.png "file://$(pwd)/tools/og-image/og.html"
magick /tmp/og-2x.png -resize 1200x630 public/og-image.png
pngquant --force --quality=78-94 --ext .png public/og-image.png
```

## Icon / favicon set

The favicon family in `public/` (`favicon.ico`, `favicon-16/32`,
`apple-touch-icon`, `android-chrome-192/512`) is derived from the circular "M"
badge. The brand crests `public/logo-{light,dark}.png` are the full "MU"
monogram (light = cream ground, dark = navy ground): `logo-dark` powers the og
template, and the SideRail sigil swaps between the two per active theme.
