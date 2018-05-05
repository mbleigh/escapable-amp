import { render } from "./render";
import { Room, Location, Region } from "./data";
import LocationCard from "./components/LocationCard";

export function RegionPage({ region, locations, rooms }: { region: Region; locations: Location[]; rooms: Room[] }): string {
  return render({
    title: `${region.name} Escape Rooms - Escapable`,
    body: `
<h1>${region.name} Escape Rooms</h1>
<div class="cards">
  ${locations.map(l => LocationCard(l, rooms.filter(r => r.location === l.__id__))).join("")}
</div>
`,
    styles: ["region"]
  });
}

export function ListRegionsPage(regions: Region[]): string {
  return render({
    title: "Escapable - Escape Room Directory",
    body: `
    <h1>Find Escape Rooms Near You</h1>
    <div class="cards">
    <p class="card welcome">Locked in a room with nothing but your wits and friends to escape. Escapable is a community for escape artists. Find new rooms to try and keep track of your escape attempts. Pick a region below to get started!</p>
    <ul class="regions">
      ${regions
        .map(
          region => `
      <li><a href="/${region.__id__}">${region.name}</a></li>
      `
        )
        .join("")}
    </ul>
    </div>
`,
    styles: ["listregions"]
  });
}
