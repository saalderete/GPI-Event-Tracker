#!/usr/bin/env bash
# Builds everything public/media ships from the two generated takes:
#   scripts/hero-media.sh <desk.mp4> <board.mp4>
# desk: printed sheets settling into a stack (8 s). board: the camera tilting
# up from that stack to the whiteboard until the board fills the frame (5 s);
# its first frame is the desk's last. Both 1920x1080 at 24 fps. Written:
#   hero-scrub.mp4 / .webm  desk + board joined, a keyframe every 4 frames
#                           and no B-frames, so a seek lands within a frame
#                           or two: the scroll position scrubs this one
#   hero.mp4 / .webm        the desk clip alone, normal GOP: card mode plays it once
#   hero-poster.jpg         first frame (the empty desk), shown before the video loads
#   hero-still.jpg          the finished stack: the cover on phones and reduced motion
#   board-still.jpg         the board filling the frame: the page background there
# The sources are never upscaled, apart from the optional CROP below.
set -euo pipefail
desk="${1:?usage: scripts/hero-media.sh <desk.mp4> <board.mp4>}"
board="${2:?usage: scripts/hero-media.sh <desk.mp4> <board.mp4>}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$out"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
ff="ffmpeg -y -hide_banner -loglevel error"
# CROP=w:h:x:y trims both takes the same way before anything else, so the
# seam between them stays continuous (the shipped build trims the right edge,
# where a chair back strays into the tilt). The crop is scaled back to 1080p,
# the one upscale here.
if [ -n "${CROP:-}" ]; then fit="crop=${CROP},scale=1920:1080:flags=lanczos"; else fit="scale=-2:'min(1080,ih)':flags=lanczos"; fi
last() { ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$1"; }

# One continuous clip, joined once at high quality; both scrub encodes read it.
$ff -i "$desk" -i "$board" -filter_complex "[0:v]$fit,fps=24[a];[1:v]$fit,fps=24[b];[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -preset veryfast -crf 10 "$tmp/joined.mp4"

$ff -i "$tmp/joined.mp4" -an -c:v libx264 -preset slow -crf 25 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
  -profile:v high -level 4.2 -pix_fmt yuv420p -movflags +faststart "$out/hero-scrub.mp4"
$ff -i "$tmp/joined.mp4" -an -c:v libvpx-vp9 -b:v 0 -crf 35 -g 4 -keyint_min 4 -row-mt 1 -deadline good -cpu-used 4 "$out/hero-scrub.webm"

$ff -i "$desk" -an -vf "$fit,format=yuv420p" -c:v libx264 -preset slow -crf 24 -profile:v high -level 4.1 -movflags +faststart "$out/hero.mp4"
$ff -i "$desk" -an -vf "$fit" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 "$out/hero.webm"

$ff -i "$desk" -vf "select=eq(n\,0),$fit" -frames:v 1 -q:v 3 "$out/hero-poster.jpg"
$ff -i "$desk" -vf "select=eq(n\,$(( $(last "$desk") - 1 ))),$fit" -vsync 0 -frames:v 1 -q:v 3 "$out/hero-still.jpg"
$ff -i "$board" -vf "select=eq(n\,$(( $(last "$board") - 1 ))),$fit" -vsync 0 -frames:v 1 -q:v 3 "$out/board-still.jpg"

ls -la "$out"
