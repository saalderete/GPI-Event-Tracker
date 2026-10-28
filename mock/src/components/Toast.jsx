import { useEffect, useState } from "react";

export function useToast() {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!text) return;
    const t = setTimeout(() => setText(""), 2600);
    return () => clearTimeout(t);
  }, [text]);
  return [text, setText];
}

export function Toast({ text }) {
  if (!text) return null;
  return <div className="toast" role="status" aria-live="polite">{text}</div>;
}
