import AddStoryPagePresenter from './add-story-page-presenter.js';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default class AddStoryPageView {
  constructor() {
    this.presenter = new AddStoryPagePresenter();
  }

  async render() {
    return `
      <section class="container">
        <h1>Add New Story</h1>
        <form id="add-story-form">
          <label for="description">Description</label>
          <textarea id="description" name="description" required></textarea>

          <div>
            <label for="camera-list-select">Pilih Kamera</label>
            <select id="camera-list-select"></select>
            <video id="camera-video" autoplay playsinline style="width: 100%; max-width: 320px;"></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <button type="button" id="camera-take-button">Ambil Foto</button>
            <ul id="camera-list-output"></ul>
            <input type="hidden" id="photo-from-camera" />
          </div>

          <div>
            <label for="map">Pilih Lokasi</label>
            <div id="map" style="height: 300px;"></div>
            <input type="hidden" id="lat" name="lat" />
            <input type="hidden" id="lon" name="lon" />
          </div>

          <button type="submit">Submit</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.setupCameraFeature();
    this.setupMap();

    document.querySelector('#add-story-form')
      .addEventListener('submit', this.handleAddStory.bind(this));

    window.addEventListener('beforeunload', this.stopCurrentStream.bind(this));
    window.addEventListener('pagehide', this.stopCurrentStream.bind(this));

    this.checkAndStopCamera();
  }

  async handleAddStory(event) {
    event.preventDefault();

    const description = document.querySelector('#description').value;
    const lat = parseFloat(document.querySelector('#lat').value);
    const lon = parseFloat(document.querySelector('#lon').value);
    const photoBase64 = document.querySelector('#photo-from-camera').value;

    if (!photoBase64) {
      alert('Silakan ambil foto terlebih dahulu.');
      return;
    }

    const photo = this.dataURLtoFile(photoBase64, 'photo.png');

    try {
      const message = await this.presenter.addStory(description, photo, lat, lon);
      alert(message);
      window.location.hash = '#/';
    } catch (error) {
      alert('Gagal menambahkan story: ' + error.message);
    }
  }

  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  stopCurrentStream = () => {
    if (this.currentStream && this.currentStream.getTracks) {
      this.currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  checkAndStopCamera() {
    const currentURL = window.location.href;
    if (!currentURL.includes('#/add-story')) {
      this.stopCurrentStream();
    }
  }

  async setupCameraFeature() {
    let width = 320;
    let height = 0;
    let streaming = false;
    this.currentStream = null;

    const cameraVideo = document.getElementById('camera-video');
    const cameraCanvas = document.getElementById('camera-canvas');
    const cameraTakeButton = document.getElementById('camera-take-button');
    const cameraOutputList = document.getElementById('camera-list-output');
    const cameraListSelect = document.getElementById('camera-list-select');
    const hiddenInput = document.getElementById('photo-from-camera');

    const getStream = async () => {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: cameraListSelect.value ? { exact: cameraListSelect.value } : undefined,
        },
      });
    };

    const populateCameraList = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      cameraListSelect.innerHTML = videoDevices
        .map((device, i) => `<option value="${device.deviceId}">${device.label || 'Camera ' + (i + 1)}</option>`)
        .join('');
    };

    const stopCamera = () => {
      if (this.currentStream) {
        this.currentStream.getTracks().forEach((t) => t.stop());
      }
    };

    const takePhoto = () => {
      const ctx = cameraCanvas.getContext('2d');
      height = (cameraVideo.videoHeight * width) / cameraVideo.videoWidth;
      cameraCanvas.width = width;
      cameraCanvas.height = height;
      ctx.drawImage(cameraVideo, 0, 0, width, height);
      const dataUrl = cameraCanvas.toDataURL('image/png');
      cameraOutputList.innerHTML = `<li><img src="${dataUrl}" alt="Captured" width="150"></li>`;
      hiddenInput.value = dataUrl;
      stopCamera();
    };

    cameraVideo.addEventListener('canplay', () => {
      if (!streaming) {
        height = (cameraVideo.videoHeight * width) / cameraVideo.videoWidth;
        streaming = true;
      }
    });

    cameraTakeButton.addEventListener('click', takePhoto);

    cameraListSelect.addEventListener('change', async () => {
      stopCamera();
      this.currentStream = await getStream();
      cameraVideo.srcObject = this.currentStream;
      cameraVideo.play();
    });

    await populateCameraList();
    this.currentStream = await getStream();
    cameraVideo.srcObject = this.currentStream;
    cameraVideo.play();
  }

  setupMap() {
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const map = L.map('map').setView([-6.2, 106.8], 13);
    const marker = L.marker([-6.2, 106.8], { draggable: true }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    function updateLatLon(lat, lon) {
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lon;
    }

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      updateLatLon(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      updateLatLon(position.lat, position.lng);
    });

    updateLatLon(marker.getLatLng().lat, marker.getLatLng().lng);
  }
}
