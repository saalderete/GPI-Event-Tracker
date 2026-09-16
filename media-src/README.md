# Media sources

The generated takes the site's media is built from, kept so the encodes can be
redone without generating again (each take is a paid render; see `AI-LOG.md`).

    CROP=1776:1000:0:40 scripts/hero-media.sh media-src/desk-1080p.mp4 media-src/board-1080p.mp4 media-src/cat-loop-720p.mp4 media-src/cat-exit-720p.mp4

rebuilds everything in `public/media/`.

- `desk-1080p.mp4`: printed sheets settling into a stack on a desk. 8 s,
  1920x1080, Seedance 2.0, with the earlier 720p draft as its motion reference.
- `board-1080p.mp4`: the camera tilting up from the finished stack to a blank
  whiteboard until the board fills the frame. 5 s, 1920x1080, Seedance 2.0,
  first frame pinned to the desk take's last frame, last frame pinned to a
  clean board surface.
- `cat-still.png`: the desk's first frame (as trimmed above) with a seal-point
  Siamese cat curled in its right third, made with Wan 2.7 image edit from a
  photo of the cat. The idle pair is pinned to it.
- `cat-loop-720p.mp4`: the cat at rest, blinking and breathing, first and
  last frames pinned to `cat-still.png` so it loops without a seam. 5 s,
  1280x720, Seedance 2.5 (720p is its ceiling; a 1080p final would replace it).
- `cat-exit-720p.mp4`: the cat standing, stretching and walking out of the
  right edge, first frame pinned to `cat-still.png`, last frame pinned to the
  desk's first frame. 5 s, 1280x720, Seedance 2.5.
