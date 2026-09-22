"use client";

import { useRef, useState, type MouseEvent } from "react";
import { IconDownload, IconExternal, IconFile } from "./Icons";

// Opens a delivered PDF where the reader is. On a wide screen the link
// opens a dialog over the page with the PDF inside, a new-tab link, a
// download and a close. On a phone it stays a plain link to a new tab,
// where the phone's own viewer does the job (an embedded PDF scrolls badly
// on iPhones and downloads on Android). Without scripts it is that link
// everywhere. The frame is mounted only while the dialog is open, so the
// PDF is not fetched until asked for.
export function DocViewer({ href, title, label, download, variant = "primary" }: { href: string; title: string; label: string; download: string; variant?: "primary" | "ghost" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);

  const show = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const d = dialog.current;
    if (!d || typeof d.showModal !== "function") return;
    e.preventDefault();
    setOpen(true);
    d.showModal();
    document.documentElement.dataset.viewer = "open";
  };
  const close = () => dialog.current?.close();
  const onClose = () => {
    setOpen(false);
    delete document.documentElement.dataset.viewer;
    opener.current?.focus();
  };
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialog.current) close();
  };

  return (
    <>
      <a ref={opener} className={`btn ${variant === "ghost" ? "btn-ghost" : "btn-primary"}`} href={href} target="_blank" rel="noopener" onClick={show} title={`Open ${title}`}>
        <IconFile />
        {label}
      </a>
      <dialog ref={dialog} className="viewer" aria-label={title} onClose={onClose} onClick={onBackdrop}>
        <div className="viewer-bar">
          <span className="viewer-title">{title}</span>
          <div className="viewer-actions">
            <a className="btn btn-ghost" href={href} target="_blank" rel="noopener">
              <IconExternal />
              New tab
            </a>
            <a className="btn btn-ghost" href={href} download={download}>
              <IconDownload />
              Download
            </a>
            <button type="button" className="btn btn-ghost" onClick={close}>
              Close
            </button>
          </div>
        </div>
        {open ? <iframe className="viewer-frame" src={href} title={title} /> : null}
      </dialog>
    </>
  );
}
