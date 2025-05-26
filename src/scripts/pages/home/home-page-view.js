import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

class HomePageView {
  constructor(containerId = 'story-container') {
    this.container = document.getElementById(containerId);
    this.container.innerHTML = '';
  }

  renderStories(stories) {
    if (!stories.length) {
      this.container.innerHTML = '<p>Tidak ada cerita tersedia.</p>';
      return;
    }

    const storyListHtml = stories.map((story) => `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}" width="200">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <small>${new Date(story.createdAt).toLocaleString()}</small>
        <div class="bookmark-actions" id="bookmark-actions-${story.id}">
          <button class="btn btn-save" id="report-detail-save-${story.id}" data-id="${story.id}">Simpan Story</button>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div id="map" style="height: 400px;"></div>
      ${storyListHtml}
    `;

    this.initMap(stories);
  }

  showSaveSuccess(message) {
    alert(message); // Kamu bisa ganti ini dengan UI toast/popup lain
  }

  showSaveFailed(message) {
    alert(message); // Sama, bisa diganti sesuai desain UI-mu
  }

  showError(message) {
    this.container.innerHTML = `<p>${message}</p>`;
  }

  initMap(stories) {
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=e0QSqZc8hYrwWbNtQ8LH', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.maptiler.com/">MapTiler</a>',
    }).addTo(map);

    L.Marker.prototype.options.icon = L.icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const bounds = [];

    stories.forEach(({ lat, lon, name, description }) => {
      if (lat != null && lon != null) {
        const coordinate = [lat, lon];
        bounds.push(coordinate);
        L.marker(coordinate)
          .addTo(map)
          .bindPopup(`<b>${name}</b><br>${description}`);
      }
    });

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}

export default HomePageView;