import { Location, Room } from "../data";

export default function(location: Location, rooms: Room[]): string {
  return `
<div class="location card${location.featured ? " featured" : ""}">
  ${LocationFeatured(location)}
  <h2>${location.name}</h2>
  <div class="address">${location.address}</div>
  <amp-accordion>
      ${rooms.map(room => LocationCardRoom(room)).join("")}
    </section>
  </amp-accordion>
  <ul class="actions">
    <li><a target="_blank" href="${location.website}"><i class="material-icons md-18">open_in_new</i> Website</a></li>
    <li><a target="_blank" href="${location.urls.google}"><i class="material-icons md-18">directions</i> Directions</a></li>
    ${location.tel ? `<li><a target="_blank" href="tel:${location.tel}"><i class="material-icons md-18">phone</i> ${location.tel}</a></li>` : ""}
  </ul>
</div>
`;
}

function LocationCardRoom(room: Room): string {
  return `
  <section>
    <h3><span class="name">${room.name}</span> <span class="players"><i class="material-icons">group</i> ${room.playersMin}-${room.playersMax}</span></h3>
    <div>
      <p>${room.description}</p>
      <ul class="aspects">
        ${room.duration ? `<li><i class="material-icons md-18">timer</i> ${room.duration} min.</li>` : ""}
        ${room.reviewScore ? `<li class="${room.reviewScore > 70 ? "positive" : ""}"><i class="material-icons md-18">thumbs_up_down</i> ${room.reviewScore}% recommended</li>` : ""}
      </ul>
    </div>
  </section>
  `;
}

function LocationFeatured(location: Location) {
  if (!location.featured) return "";
  return `<div class="featured">
    <span><i class="material-icons">star</i> Featured</span>
    <amp-img src="${location.featuredImage}" layout="responsive" width="2.33" height="1">
      <amp-img placeholder src="${location.featuredImageUri}" layout="fill"></amp-img>
    </amp-img>
  </div>`;
}
