"""The device photos in public/devices/, rebuilt from their green-screen plates.

Each plate is a photo whose screen was generated as flat chroma green
(#00FF00), so the screen is found exactly instead of guessed:

  python3 build.py masks   the backdrop cut out of each plate (hands and device
                           kept) into masks/<plate>.png, with BiRefNet through
                           rembg (pip install "rembg[cpu]"); only when a plate
                           changes, the masks are committed
  python3 build.py quads   the screen's mask and four corners from the green,
                           and its aspect, into quads.json (capture.mjs reads it)
  python3 build.py         the captures warped onto the screens, written to
                           public/devices/*.webp, and a contact sheet here

The capture shows only where the plate was green, so the bezel, the rounded
corners and any finger over the glass stay in front without being measured.
Needs Python 3 with opencv-python and numpy.
"""
import json, sys
from pathlib import Path
import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
OUT = HERE.parent.parent / "public" / "devices"
W, H = 1080, 1350
CFG = json.loads((HERE / "devices.json").read_text())


def plate_frame(spec, im=None):
    """The plate (or its mask) as the photo's full frame (2160 wide for the panorama), and the slice the photo keeps."""
    if im is None:
        im = cv2.imread(str(HERE / "plates" / f"{spec['plate']}.webp"))
    if spec["frame"] == "scale":
        return cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA), slice(0, W)
    # the panorama, covered into 2160x1350 (as the post was laid out), mirrored if asked, its left half kept
    h, w = im.shape[:2]
    s = max(2 * W / w, H / h)
    im = cv2.resize(im, (round(w * s), round(h * s)), interpolation=cv2.INTER_AREA)
    y0, x0 = (im.shape[0] - H) // 2, (im.shape[1] - 2 * W) // 2
    im = im[y0:y0 + H, x0:x0 + 2 * W]
    if spec.get("mirror"):
        im = cv2.flip(im, 1)
    return im, slice(0, W)


def green_key(im, lo=25, span=70):
    """1 where the plate is chroma green, 0 elsewhere, soft at the edge."""
    f = im.astype(np.float32)
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    return np.clip((g - np.maximum(r, b) - lo) / span, 0, 1)


def screen_quad(key):
    """Four corners (TL, TR, BR, BL): a straight line fitted to the middle of each edge of the green, then where they meet."""
    m = (key > 0.5).astype(np.uint8)
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cnts, key=cv2.contourArea).reshape(-1, 2).astype(np.float32)
    s, d = c.sum(1), c[:, 0] - c[:, 1]
    tl, br, tr, bl = c[s.argmin()], c[s.argmax()], c[d.argmax()], c[d.argmin()]

    def side(p, q):
        v = q - p; L = np.linalg.norm(v); v /= L; n = np.array([-v[1], v[0]])
        t, dist = (c - p) @ v, np.abs((c - p) @ n)
        sel = c[(t > 0.25 * L) & (t < 0.75 * L) & (dist < 30)]
        vx, vy, x0, y0 = cv2.fitLine(sel, cv2.DIST_L2, 0, 0.01, 0.01).ravel()
        return np.array([x0, y0]), np.array([vx, vy])

    def meet(a, b):
        (p, u), (q, v) = a, b
        t = np.linalg.solve(np.array([u, -v]).T, q - p)
        return p + t[0] * u

    T, R, B, L = side(tl, tr), side(tr, br), side(br, bl), side(bl, tl)
    return np.float32([meet(L, T), meet(T, R), meet(R, B), meet(B, L)])


def quads():
    out = {}
    for name, spec in CFG["photos"].items():
        im, _ = plate_frame(spec)
        q = screen_quad(green_key(im))
        if spec["frame"] == "pano":
            # only the left of this screen is in the picture: the page is laid out for that part, plus a
            # little that runs past the picture's edge, so it reads as a screen going on out of frame
            vis = W - q[0][0]
            cut = W + vis * spec.get("overscan", 0.1)
            top = q[0] + (q[1] - q[0]) * (cut - q[0][0]) / (q[1][0] - q[0][0])
            bot = q[3] + (q[2] - q[3]) * (cut - q[3][0]) / (q[2][0] - q[3][0])
            q = np.float32([q[0], top, bot, q[3]])
        w = (np.linalg.norm(q[1] - q[0]) + np.linalg.norm(q[2] - q[3])) / 2
        h = (np.linalg.norm(q[3] - q[0]) + np.linalg.norm(q[2] - q[1])) / 2
        out[name] = {"quad": q.round(2).tolist(), "aspect": round(float(w / h), 4), "size": [round(float(w)), round(float(h))]}
        print(f"{name}: screen {out[name]['size']} px, aspect {out[name]['aspect']}")
    (HERE / "quads.json").write_text(json.dumps(out, indent=1) + "\n")


def place(im, key, quad, shot):
    """The capture on the screen: warped to the corners, lit like the glass it replaces, shown only where the plate was green."""
    h, w = im.shape[:2]
    # shrink the 3x capture close to its size on screen first (area filter, no shimmer), then warp
    qw = int(max(np.linalg.norm(quad[1] - quad[0]), np.linalg.norm(quad[2] - quad[3])) * 1.25)
    sh, sw = shot.shape[:2]
    shot = cv2.resize(shot, (qw, round(qw * sh / sw)), interpolation=cv2.INTER_AREA)
    sh, sw = shot.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]]), quad)
    scr = cv2.warpPerspective(shot, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
    # a camera never sees a screen as crisply as a screenshot: the slightest softening
    scr = cv2.GaussianBlur(scr, (0, 0), 0.45)
    # the plate's own light on the glass: the green's brightness varies a little (falloff, a soft
    # reflection); carry a share of it onto the screen so it sits in the photo's light
    f = im.astype(np.float32)
    lum = f[..., 1]
    inside = key > 0.95
    ref = np.median(lum[inside])
    shade = np.clip(lum / max(ref, 1), 0.8, 1.15)
    shade = cv2.GaussianBlur(np.where(inside, shade, 1.0).astype(np.float32), (0, 0), 6)
    scr *= (1 + (shade - 1) * 0.6)[..., None]
    # a faint sheen across the glass, from the upper left
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    band = np.exp(-(((xx - w * 0.2) * 0.6 + (yy - h * 0.15) * 0.8) / (w * 0.4)) ** 2)
    scr += band[..., None] * 255 * 0.035
    # the grain of the photo, so the screen doesn't look cleaner than the hand holding it
    scr += np.random.default_rng(7).normal(0, 1.6, scr.shape).astype(np.float32)
    # despill: where the key is partial (the edge of the glass), pull green back to the other channels
    edge = (key > 0.01) & (key < 0.99)
    f[..., 1] = np.where(edge, np.minimum(f[..., 1], np.maximum(f[..., 0], f[..., 2]) + 6), f[..., 1])
    a = key[..., None]
    return np.clip(f * (1 - a) + scr * a, 0, 255).astype(np.uint8)


def masks():
    """The backdrop cut out of each plate with BiRefNet (it keeps hands, fingers in shadow and the device)."""
    from PIL import Image
    from rembg import new_session, remove
    session = new_session("birefnet-general-lite")
    for plate in sorted({p["plate"] for p in CFG["photos"].values()}):
        im = Image.open(HERE / "plates" / f"{plate}.webp").convert("RGB")
        remove(im, session=session, only_mask=True).save(HERE / "masks" / f"{plate}.png")
        print(f"masks/{plate}.png")


def decontaminate(rgb, alpha):
    """The edge pixels with the backdrop's share taken back out: pixel = a * subject + (1 - a) * backdrop, so
    subject = (pixel - (1 - a) * backdrop) / a, with the backdrop's colour at each spot spread in from where it
    shows. Without it, hands carry an orange rim onto whatever colour they're laid over."""
    f = rgb.astype(np.float32)
    a = alpha.astype(np.float32) / 255
    bgm = (a < 0.03).astype(np.float32)
    B = cv2.GaussianBlur(f * bgm[..., None], (0, 0), 12) / np.maximum(cv2.GaussianBlur(bgm, (0, 0), 12), 1e-3)[..., None]
    edge = (a > 0.03) & (a < 0.97)
    F = (f - (1 - a[..., None]) * B) / np.maximum(a[..., None], 0.2)
    return np.where(edge[..., None], np.clip(F, 0, 255), f).astype(np.uint8)


def build():
    quadsj = json.loads((HERE / "quads.json").read_text())
    sheet = []
    for name, spec in CFG["photos"].items():
        im, keep = plate_frame(spec)
        key = cv2.GaussianBlur(green_key(im), (3, 3), 0)
        shot = cv2.imread(str(HERE / "captures" / f"{name}.png"))
        if shot is None:
            sys.exit(f"captures/{name}.png is missing: run capture.mjs first")
        rgb = place(im, key, np.float32(quadsj[name]["quad"]), shot)[:, keep]
        mask, _ = plate_frame(spec, cv2.imread(str(HERE / "masks" / f"{spec['plate']}.png"), cv2.IMREAD_GRAYSCALE))
        mask, k = mask[:, keep], key[:, keep]
        alpha = np.maximum(mask, (k * 255).astype(np.uint8))
        rgb = np.where((k > 0.01)[..., None], rgb, decontaminate(rgb, alpha))  # the screen keeps its own colours
        rgba = np.dstack([rgb, alpha])
        cv2.imwrite(str(OUT / f"{name}.webp"), rgba, [cv2.IMWRITE_WEBP_QUALITY, 92])
        bg = np.full_like(rgb, (110, 70, 200)[::-1])  # a stand-in accent, only for the sheet
        a = alpha[..., None] / 255.0
        sheet.append((rgb * a + bg * (1 - a)).astype(np.uint8))
        print(f"{name}.webp written")
    cv2.imwrite(str(HERE / "sheet.jpg"), cv2.resize(np.hstack(sheet), (W * len(sheet) // 2, H // 2)), [cv2.IMWRITE_JPEG_QUALITY, 85])


if __name__ == "__main__":
    {"masks": masks, "quads": quads}.get(sys.argv[1] if sys.argv[1:] else "", build)()
