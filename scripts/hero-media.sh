#!/usr/bin/env bash
# Turns the generated hero clip into what the page ships:
#   public/media/hero.mp4        H.264, no audio, fast start
#   public/media/hero.webm       VP9
#   public/media/hero-poster.jpg first frame (shown before playback)
#   public/media/hero-still.jpg  last frame (phones, reduced motion)
# The source is never upscaled: the hero renders at about 640px wide, so a
# 720p source is already oversampled there. Usage:
#   scripts/hero-media.sh <source.mp4>
set -euo pipefail
src="${1:?usage: scripts/hero-media.sh <source.mp4>}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$out"

ffmpeg -y -hide_banner -loglevel error -i "$src" -an -vf "scale=-2:'min(1080,ih)':flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -profile:v high -level 4.1 -movflags +faststart "$out/hero.mp4"
ffmpeg -y -hide_banner -loglevel error -i "$src" -an -vf "scale=-2:'min(1080,ih)':flags=lanczos" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 "$out/hero.webm"
ffmpeg -y -hide_banner -loglevel error -i "$src" -vf "select=eq(n\,0),scale=-2:'min(1080,ih)'" -frames:v 1 -q:v 4 "$out/hero-poster.jpg"
ffmpeg -y -hide_banner -loglevel error -sseof -0.1 -i "$src" -vf "scale=-2:'min(1080,ih)'" -frames:v 1 -q:v 4 "$out/hero-still.jpg"

ls -la "$out"
