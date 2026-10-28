# The device photos

`public/devices/*.webp` (the four slides of "What a listing looks like" on the
organizers page) are built here from green-screen plates. The general method
and its pitfalls are written up in nerrix-digital, `components/device-mockups/`.

| File | What it is |
|---|---|
| `plates/` | The photos as generated, each screen flat chroma green (#00FF00): `fold3` (the duo on a fingertip), `orange` (the tablet in two hands), `pano` (one 2160x1344 panorama; its two halves are the side-held tablets). Lossless WebP. |
| `masks/` | Each plate's backdrop cut out (hands and devices kept), made by BiRefNet. |
| `devices.json` | Which plate each photo comes from, how it is framed (scaled, or the panorama's left half, mirrored), and the page and viewport width for its screen. |
| `quads.json` | Written by `build.py quads`: each screen's four corners, found from the green, and its aspect. |
| `capture.mjs` | Captures each page at its screen's aspect, 3x, dark theme, motion off, five saved events. |
| `build.py` | Warps each capture onto its screen and writes the WebPs. |

To rebuild (for example after the pages change):

```bash
cd mock
npm run dev                                    # leave it running
python3 scripts/devices/build.py quads         # only if devices.json or a plate changed
node scripts/devices/capture.mjs http://localhost:5173
python3 scripts/devices/build.py               # writes public/devices/*.webp and sheet.jpg
```

Needs Python 3 with `opencv-python` and `numpy`, and Playwright for the
captures. `python3 build.py masks` remakes the masks and also needs
`rembg[cpu]`; it is only needed if a plate changes.

Check `sheet.jpg` and zoom in on each hand and bezel before committing.
