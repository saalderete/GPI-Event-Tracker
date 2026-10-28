// Sample events for the mock: El Paso and Juárez, fictional organizers,
// real kinds of places. Days are offsets from today, so the calendar always
// has something on tonight and this weekend. Nothing here is a real listing;
// the page says so.
import { todayKey, addDays } from "../lib/dates.js";

export const CATEGORIES = [
  { id: "music", name: "Music", hue: 282 },
  { id: "markets", name: "Markets", hue: 44 },
  { id: "cars", name: "Car meets", hue: 20 },
  { id: "food", name: "Food", hue: 354 },
  { id: "family", name: "Family", hue: 150 },
  { id: "sports", name: "Sports", hue: 214 },
  { id: "arts", name: "Arts", hue: 318 },
  { id: "nightlife", name: "Nightlife", hue: 254 }
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);

const E = (o) => ({ status: "confirmed", confirmedDaysAgo: 2, price: 0, know: [], featured: false, ...o });

export const EVENTS = [
  E({ slug: "sunset-strings-san-jacinto", title: "Sunset strings at San Jacinto Plaza", category: "music", day: 0, start: "18:30", end: "20:00",
    venue: "San Jacinto Plaza", area: "Downtown", address: "Mills Ave at Oregon St", price: 0, whoFor: "All ages. Bring the kids, bring the dog on a leash.",
    know: ["Free parking on the street after 6 PM", "The plaza has shade but little seating; bring a blanket", "If it rains it moves to the same Sunday"],
    organizer: { name: "Sun City Sound Collective", handle: "suncitysound" }, confirmedDaysAgo: 0, featured: true,
    blurb: "A string quartet on the plaza steps playing film scores and cumbias as the sun goes down behind the Franklins." }),
  E({ slug: "franklin-night-market", title: "Franklin Night Market", category: "markets", day: 0, start: "19:00", end: "23:00",
    venue: "Union Plaza warehouse", area: "Downtown", address: "Anthony St at W San Antonio Ave", price: 0, whoFor: "Everyone. Most stalls take cards, a few are cash only.",
    know: ["Parking fills by 7; the garage on Santa Fe St is two blocks east", "Food trucks on the Anthony St side", "Dogs welcome outside the warehouse"],
    organizer: { name: "Franklin Night Market", handle: "franklinnightmarket" }, confirmedDaysAgo: 1, featured: true,
    blurb: "Sixty makers, four food trucks and a DJ in the old produce warehouse. The first Friday market of the fall." }),
  E({ slug: "late-night-tacos-cincinnati", title: "Late night tacos on Cincinnati", category: "food", day: 0, start: "21:00", end: "01:00",
    venue: "Cincinnati Street patio", area: "Kern Place", address: "Cincinnati Ave at Mesa St", price: 8, priceNote: "Tacos from $8, drinks separate", whoFor: "21 and over after 10 PM.",
    know: ["Street parking only", "The line moves fast; order at the window, eat on the patio"],
    organizer: { name: "Texas Avenue Social Club", handle: "texasavesocial" }, confirmedDaysAgo: 3,
    blurb: "Three taqueros, one patio, a record player. Every other Friday until the weather turns." }),
  E({ slug: "scenic-drive-sunrise-run", title: "Scenic Drive sunrise run", category: "sports", day: 1, start: "06:30", end: "08:00",
    venue: "Scenic Drive overlook", area: "Central", address: "Scenic Dr at Rim Rd", price: 0, whoFor: "Anyone who can run or walk 3 miles. Walkers start 15 minutes early.",
    know: ["The road is closed to cars until 9 AM", "Water at the overlook, nothing else: bring your own"],
    organizer: { name: "El Paso Trail Runners", handle: "eptrailrunners" }, confirmedDaysAgo: 2,
    blurb: "A 3-mile out and back along the rim with the city waking up below. No timing, no bibs." }),
  E({ slug: "segundo-barrio-mercado", title: "Segundo Barrio mercado", category: "markets", day: 1, start: "09:00", end: "14:00",
    venue: "Sacred Heart lot", area: "Segundo Barrio", address: "S Oregon St at E 7th Ave", price: 0, whoFor: "Everyone. Spanish and English spoken at every stall.",
    know: ["Cash is faster at the produce stalls", "Street parking on 7th; the lot is for vendors"],
    organizer: { name: "Segundo Barrio Food Co-op", handle: "segundobarriocoop" }, confirmedDaysAgo: 1,
    blurb: "Produce from the Lower Valley, pan dulce, tamales by the dozen and a mariachi at noon." }),
  E({ slug: "borderland-cars-and-coffee", title: "Borderland cars and coffee", category: "cars", day: 1, start: "08:00", end: "11:00",
    venue: "Union Plaza garage roof", area: "Downtown", address: "Santa Fe St at W Main Dr", price: 0, whoFor: "Anyone with a car worth looking at, and anyone who likes looking.",
    know: ["Enter from Santa Fe St; the roof opens at 7:30 for show cars", "Coffee cart until 10", "No burnouts, no revving in the ramp"],
    organizer: { name: "Borderland Car Club", handle: "borderlandcarclub" }, confirmedDaysAgo: 0, status: "changed",
    change: { daysAgo: 1, text: "Moved from the Mesa St lot to the Union Plaza garage roof. Same time." }, featured: true,
    blurb: "Imports, lowriders and whatever else turns up. Spectators free, show cars sign in on the roof." }),
  E({ slug: "union-plaza-art-walk", title: "Union Plaza art walk", category: "arts", day: 1, start: "18:00", end: "22:00",
    venue: "Union Plaza galleries", area: "Downtown", address: "W San Antonio Ave, Anthony St to Durango St", price: 0, whoFor: "All ages. Some galleries serve wine, bring ID.",
    know: ["Start at the Anthony St end and walk west", "Most spaces close at 10 sharp"],
    organizer: { name: "Union Plaza Art Walk", handle: "unionplazaartwalk" }, confirmedDaysAgo: 2, featured: true,
    blurb: "Nine studios and galleries open their doors for one night, with the artists in the room." }),
  E({ slug: "chuco-record-fair", title: "Chuco record fair", category: "music", day: 1, start: "11:00", end: "17:00",
    venue: "Texas Avenue hall", area: "Five Points", address: "Texas Ave at N Piedras St", price: 5, priceNote: "$5 at the door, free after 3 PM", whoFor: "Diggers, DJs, and anyone with a turntable gathering dust.",
    know: ["Cash for most sellers", "Listening stations near the stage"],
    organizer: { name: "Chuco Record Fair", handle: "chucorecordfair" }, confirmedDaysAgo: 4,
    blurb: "Twenty-two sellers from both sides of the border, a DJ set at 2 and a listening corner." }),
  E({ slug: "lucha-libre-ascarate", title: "Lucha libre at Ascarate", category: "sports", day: 1, start: "19:30", end: "22:00",
    venue: "Ascarate Park pavilion", area: "East El Paso", address: "6900 Delta Dr", price: 15, priceNote: "$15 general, kids under 10 free", whoFor: "Families. Loud, in a good way.",
    know: ["Park at the pavilion lot off Delta Dr", "Masks sold at the door, bring a kid who wants one"],
    organizer: { name: "Lucha Chuco", handle: "luchachuco" }, confirmedDaysAgo: 1, featured: true,
    blurb: "Six matches under the pavilion lights. Técnicos, rudos and a battle royal to close." }),
  E({ slug: "parque-central-cine-al-aire-libre", title: "Cine al aire libre in Parque Central", category: "family", day: 2, start: "19:00", end: "21:30",
    venue: "Parque Central", area: "Ciudad Juárez", address: "Av. Paseo de la Victoria, Juárez", price: 0, whoFor: "Families. The film is in Spanish with English subtitles.",
    know: ["Bring a blanket or a folding chair", "Food carts at the east gate", "Allow time at the bridge if you are crossing"],
    organizer: { name: "Cine Club Juárez", handle: "cineclubjuarez" }, confirmedDaysAgo: 3,
    blurb: "A classic Mexican comedy on the big screen by the lake, with the city on both sides of it." }),
  E({ slug: "sunday-pan-dulce-tour", title: "Sunday pan dulce tour", category: "food", day: 2, start: "09:00", end: "12:00",
    venue: "Starts at the Alameda bakery row", area: "Central", address: "Alameda Ave at N Piedras St", price: 25, priceNote: "$25, pastries included", whoFor: "Anyone who can walk a mile slowly. Vegetarian throughout.",
    know: ["Twelve spots; the organizer confirms by text", "Wear shoes you can walk in"],
    organizer: { name: "Borderland Bites", handle: "borderlandbites" }, confirmedDaysAgo: 2,
    blurb: "Four bakeries, one morning, a conchas-versus-cuernos debate that never gets settled." }),
  E({ slug: "franklin-mountains-family-hike", title: "Family hike at Tom Mays", category: "family", day: 2, start: "08:00", end: "10:30",
    venue: "Tom Mays Unit, Franklin Mountains State Park", area: "Westside", address: "Transmountain Rd, Tom Mays entrance", price: 5, priceNote: "$5 park entry per adult, kids free", whoFor: "Kids 5 and up with an adult. About 2 easy miles.",
    know: ["Park entry fee is paid at the gate, card or cash", "No shade on the trail; hats and water", "Dogs on leash are fine"],
    organizer: { name: "Westside Trail Families", handle: "westsidetrailfamilies" }, confirmedDaysAgo: 5,
    blurb: "A guided loop for kids with a ranger talk about the plants that bite." }),
  E({ slug: "monday-open-mic-five-points", title: "Open mic at Five Points", category: "nightlife", day: 3, start: "20:00", end: "23:00",
    venue: "Five Points coffeehouse back room", area: "Five Points", address: "Montana Ave at N Piedras St", price: 0, whoFor: "18 and over. Sign up for five minutes at the door.",
    know: ["List opens at 7:30, twelve slots", "Street parking on Montana"],
    organizer: { name: "Mesa Comedy Collective", handle: "mesacomedy" }, confirmedDaysAgo: 6,
    blurb: "Comedy, poems and one person who always brings a ukulele." }),
  E({ slug: "taco-tuesday-food-truck-round-up", title: "Food truck round up at Memorial Park", category: "food", day: 4, start: "17:30", end: "21:00",
    venue: "Memorial Park", area: "Central", address: "Copper Ave at N Piedras St", price: 0, whoFor: "Everyone. Free to enter, pay per plate.",
    know: ["Trucks park along Copper Ave", "Bring chairs; the lawn is the seating"],
    organizer: { name: "Sun City Trucks", handle: "suncitytrucks" }, confirmedDaysAgo: 2,
    blurb: "Nine trucks, a lawn, and the sun setting behind the water tower." }),
  E({ slug: "border-bike-union-night-ride", title: "Night ride with Border Bike Union", category: "sports", day: 4, start: "20:00", end: "22:00",
    venue: "Starts at San Jacinto Plaza", area: "Downtown", address: "Mills Ave at Oregon St", price: 0, whoFor: "Anyone with a bike and lights. Easy pace, nobody gets dropped.",
    know: ["Lights are required, front and back", "About 8 miles, flat, through Sunset Heights and back"],
    organizer: { name: "Border Bike Union", handle: "borderbikeunion" }, confirmedDaysAgo: 1,
    blurb: "A slow social loop through downtown and the heights, with a stop for paletas." }),
  E({ slug: "cumbia-night-at-the-hangar", title: "Cumbia night at the hangar", category: "nightlife", day: 5, start: "21:00", end: "02:00",
    venue: "The hangar on Montana", area: "East El Paso", address: "Montana Ave near Hawkins Blvd", price: 12, priceNote: "$12 before 11 PM, $18 after", whoFor: "21 and over.",
    know: ["Free lot behind the hangar", "Cash and cards at the bar", "Rideshare pickup on the Montana side"],
    organizer: { name: "Sonidero Chuco", handle: "soniderochuco" }, confirmedDaysAgo: 2,
    blurb: "Two sonideros, one live band and a dance floor the size of a hangar." }),
  E({ slug: "thursday-jazz-at-the-plaza-theatre-steps", title: "Jazz on the theatre steps", category: "music", day: 5, start: "19:00", end: "21:00",
    venue: "Pioneer Plaza", area: "Downtown", address: "W Mills Ave at N El Paso St", price: 0, whoFor: "All ages.",
    know: ["Bring a chair; the steps fill early", "The garage on Santa Fe St is a block west"],
    organizer: { name: "Sun City Sound Collective", handle: "suncitysound" }, confirmedDaysAgo: 0, status: "canceled",
    change: { daysAgo: 0, text: "Canceled by the organizer: the trio is stuck in Albuquerque. Back next month." },
    blurb: "A piano trio on the plaza, the trolley passing behind them." }),
  E({ slug: "lowrider-sunday-chamizal", title: "Lowrider Sunday at Chamizal", category: "cars", day: 6, start: "12:00", end: "17:00",
    venue: "Chamizal National Memorial lawn", area: "South Central", address: "800 S San Marcial St", price: 0, whoFor: "All ages. Show cars register at the gate.",
    know: ["Parking on Paisano Dr; the lot fills by noon", "Food vendors by the amphitheatre"],
    organizer: { name: "Sun City Lowriders", handle: "suncitylowriders" }, confirmedDaysAgo: 3, featured: true,
    blurb: "Fifty cars on the lawn, hop contest at 3, oldies all afternoon." }),
  E({ slug: "friday-futbol-watch-party", title: "Fútbol watch party at the plaza", category: "sports", day: 7, start: "18:00", end: "21:00",
    venue: "Plaza de Armas", area: "Ciudad Juárez", address: "Av. 16 de Septiembre, Centro, Juárez", price: 0, whoFor: "Everyone. Big screen, bigger crowd.",
    know: ["Standing room; get there early for the benches", "Cross early: the bridge lines are long on Fridays"],
    organizer: { name: "Barra Fronteriza", handle: "barrafronteriza" }, confirmedDaysAgo: 4,
    blurb: "The match on a screen in the plaza, with the cathedral bells for halftime." }),
  E({ slug: "second-saturday-night-market", title: "Franklin Night Market, second Saturday", category: "markets", day: 8, start: "18:00", end: "22:00",
    venue: "Union Plaza warehouse", area: "Downtown", address: "Anthony St at W San Antonio Ave", price: 0, whoFor: "Everyone.",
    know: ["Same warehouse as the first Friday market", "Garage on Santa Fe St, two blocks east"],
    organizer: { name: "Franklin Night Market", handle: "franklinnightmarket" }, confirmedDaysAgo: 2,
    blurb: "The second market of the month, with the vintage sellers taking the north wall." }),
  E({ slug: "kids-mural-day-lincoln-park", title: "Kids mural day at Lincoln Park", category: "family", day: 8, start: "10:00", end: "13:00",
    venue: "Lincoln Park", area: "South Central", address: "Under the Spaghetti Bowl, Durazno Ave", price: 0, whoFor: "Kids 6 to 14 with an adult. Paint provided, wear old clothes.",
    know: ["Park on Durazno Ave", "Shade under the overpass, water at the table"],
    organizer: { name: "Lincoln Park Conservation Committee", handle: "lincolnparkmurals" }, confirmedDaysAgo: 3,
    blurb: "Kids paint a panel with the muralists who painted the pillars." }),
  E({ slug: "saturday-ride-and-shine", title: "Ride and shine on Transmountain", category: "cars", day: 8, start: "07:00", end: "10:00",
    venue: "Transmountain east overlook", area: "Northeast", address: "Woodrow Bean Transmountain Dr, east overlook", price: 0, whoFor: "Drivers and riders. Spectators welcome at the overlook.",
    know: ["No racing; the park police are on the road", "Coffee at the overlook until 9"],
    organizer: { name: "Borderland Car Club", handle: "borderlandcarclub" }, confirmedDaysAgo: 1,
    blurb: "A sunrise cruise over the mountain, then coffee and the view." }),
  E({ slug: "backyard-concert-sunset-heights", title: "Porch concert in Sunset Heights", category: "music", day: 9, start: "18:00", end: "20:00",
    venue: "A porch on Rio Grande Ave", area: "Sunset Heights", address: "Rio Grande Ave, address texted after RSVP", price: 10, priceNote: "$10 suggested, all to the band", whoFor: "Neighbours and friends of neighbours. Ask before bringing a crowd.",
    know: ["RSVP for the address", "Bring a chair and something to share"],
    organizer: { name: "Sunset Heights Porch Shows", handle: "porchshowsep" }, confirmedDaysAgo: 2,
    blurb: "A folk duo on a hundred-year-old porch, forty people on the lawn." }),
  E({ slug: "pop-up-dinner-in-the-valley", title: "Pop-up dinner in the Mission Valley", category: "food", day: 10, start: "19:00", end: "22:00",
    venue: "A pecan orchard in San Elizario", area: "Mission Valley", address: "Socorro Rd, San Elizario, address on booking", price: 65, priceNote: "$65, five courses, drinks included", whoFor: "Adults. Vegetarian menu on request when you book.",
    know: ["Thirty seats, booked through the organizer", "Carpool: the orchard road is dirt"],
    organizer: { name: "Borderland Bites", handle: "borderlandbites" }, confirmedDaysAgo: 5,
    blurb: "A long table under the pecans, a chef from Juárez, a sunset over the fields." }),
  E({ slug: "gallery-night-kern-place", title: "Gallery night in Kern Place", category: "arts", day: 11, start: "18:00", end: "21:00",
    venue: "Three galleries on Cincinnati", area: "Kern Place", address: "Cincinnati Ave between Mesa St and Stanton St", price: 0, whoFor: "All ages.",
    know: ["Street parking; the lots belong to the restaurants"],
    organizer: { name: "Kern Place Arts", handle: "kernplacearts" }, confirmedDaysAgo: 4,
    blurb: "Three openings on one block, one night." }),
  E({ slug: "halloween-trunk-or-treat-northeast", title: "Trunk or treat at the Northeast gym", category: "family", day: 12, start: "17:00", end: "20:00",
    venue: "Northeast gym parking lot", area: "Northeast", address: "Dyer St at Hondo Pass Dr", price: 0, whoFor: "Kids and their adults. Costumes expected.",
    know: ["Enter from Hondo Pass", "Allergy-friendly table near the gym doors"],
    organizer: { name: "Northeast Neighbours", handle: "northeastneighbours" }, confirmedDaysAgo: 1,
    blurb: "Forty decorated trunks and a costume parade at 7." }),
  E({ slug: "late-set-at-the-hangar", title: "Late set at the hangar", category: "nightlife", day: 13, start: "22:00", end: "03:00",
    venue: "The hangar on Montana", area: "East El Paso", address: "Montana Ave near Hawkins Blvd", price: 20, whoFor: "21 and over.",
    know: ["Free lot behind the hangar", "Last entry 1 AM"],
    organizer: { name: "Sonidero Chuco", handle: "soniderochuco" }, confirmedDaysAgo: 6,
    blurb: "A DJ from Monterrey and the resident sonidero until the lights come up." })
];

/** The sample set with real dates attached, relative to today. */
export function eventsFor(today = todayKey()) {
  return EVENTS.map((e) => ({
    ...e,
    date: addDays(today, e.day),
    confirmedOn: addDays(today, -e.confirmedDaysAgo),
    changedOn: e.change ? addDays(today, -e.change.daysAgo) : null,
    cat: categoryById(e.category)
  })).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}

export const findEvent = (events, slug) => events.find((e) => e.slug === slug);

export function filterEvents(events, { days = null, categories = [], free = false, query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return events.filter((e) => {
    if (days && !days.includes(e.date)) return false;
    if (categories.length && !categories.includes(e.category)) return false;
    if (free && e.price !== 0) return false;
    if (q && ![e.title, e.venue, e.area, e.cat.name, e.organizer.name, e.blurb].join(" ").toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Interests first within each day, the rest after, dates and times kept. */
export function forYou(events, interests = []) {
  if (!interests.length) return events;
  const rank = (e) => (interests.includes(e.category) ? 0 : 1);
  return [...events].sort((a, b) => a.date.localeCompare(b.date) || rank(a) - rank(b) || a.start.localeCompare(b.start));
}

export function groupByDay(events) {
  const map = new Map();
  for (const e of events) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date).push(e);
  }
  return [...map.entries()];
}

export function priceLabel(e) {
  if (e.price === 0) return "Free";
  return e.priceNote ? e.priceNote : `$${e.price}`;
}

export function shortPrice(e) {
  return e.price === 0 ? "Free" : `From $${e.price}`;
}
