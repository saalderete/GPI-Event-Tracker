// Which encode of a film to load: the H.264 mp4 that ships, or the VP9 webm
// proxy for browsers that cannot play it and for test runs (the house hook:
// add ?vext=webm to the address). The proxies are gitignored.
export function filmSrc(base, name) {
  let ext = "mp4";
  try {
    if (new URLSearchParams(location.search).get("vext") === "webm") ext = "webm";
    else { const v = document.createElement("video"); if (v.canPlayType('video/mp4; codecs="avc1.640028"') === "") ext = "webm"; }
  } catch {}
  return `${base}film/${name}.${ext}`;
}
