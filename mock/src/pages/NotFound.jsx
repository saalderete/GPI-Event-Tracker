import { Link } from "react-router-dom";
export function NotFound() {
  return (
    <div className="wrap measure pb-24 pt-16">
      <h1 className="h-head">Nothing <em>here</em>.</h1>
      <p className="lede mt-5">That page is not on the calendar. The calendar is.</p>
      <div className="mt-8"><Link to="/events/" className="btn">Open the calendar</Link></div>
    </div>
  );
}
