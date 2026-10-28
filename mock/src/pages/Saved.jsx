import { Link } from "react-router-dom";
import { ShareNetwork } from "@phosphor-icons/react";
import { Index } from "../components/Index.jsx";
import { Rise } from "../components/motion.jsx";
import { Toast, useToast } from "../components/Toast.jsx";
import { eventText, share } from "../lib/share.js";

export function Saved({ events, today, saved, clear }) {
  const list = events.filter((e) => saved.includes(e.slug));
  const [toast, show] = useToast();
  const onShare = async () => {
    const text = `The plan:\n${list.map((e) => `· ${eventText(e)}`).join("\n")}`;
    const r = await share("The plan", text, `${location.origin}/mock/events/`);
    show(r === "copied" ? "The plan is copied for the group chat" : r === "shared" ? "Sent" : "");
  };
  return (
    <div className="wrap measure pb-24 pt-10">
      <Rise><h1 className="h-head">Your <em>plan</em>.</h1></Rise>
      <Rise delay={0.06}><p className="lede mt-5">Saved events by day. One share sends the whole plan to the group chat, which is where the plan gets made anyway.</p></Rise>
      {list.length ? (
        <>
          <Rise delay={0.1}><div className="mt-8 flex flex-wrap gap-3"><button type="button" className="btn" onClick={onShare}><ShareNetwork size={18} />Send the plan</button><button type="button" className="btn btn-ghost" onClick={clear}>Clear</button></div></Rise>
          <div className="mt-6"><Index events={list} today={today} /></div>
        </>
      ) : (
        <div className="empty mt-6">
          <h2 className="display text-2xl">Nothing saved yet.</h2>
          <p className="text-ink-soft">Open an event and press Save. It lands here, by day.</p>
          <Link to="/events/" className="btn">Open the calendar</Link>
        </div>
      )}
      <Toast text={toast} />
    </div>
  );
}
