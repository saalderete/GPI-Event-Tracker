# Media sources

The generated takes the site's media is built from, kept so the encodes can be
redone without generating again (each take is a paid render; see `AI-LOG.md`).

    scripts/hero-media.sh media-src/desk-1080p.mp4 media-src/board-1080p.mp4

rebuilds everything in `public/media/`.

- `desk-1080p.mp4`: printed sheets settling into a stack on a desk. 8 s,
  1920x1080, Seedance 2.0, with the earlier 720p draft as its motion reference.
- `board-1080p.mp4`: the camera tilting up from the finished stack to a blank
  whiteboard until the board fills the frame. 5 s, 1920x1080, Seedance 2.0,
  first frame pinned to the desk take's last frame, last frame pinned to a
  clean board surface.
