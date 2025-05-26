// import {
//   generateLoaderAbsoluteTemplate,
//   generateReportItemTemplate,
//   generateReportsListEmptyTemplate,
//   generateReportsListErrorTemplate,
// } from '../../templates';
 
// export default class BookmarkPage {
//   async render() {
//     return `
//       <section>
//         <div class="reports-list__map__container">
//           <div id="map" class="reports-list__map"></div>
//           <div id="map-loading-container"></div>
//         </div>
//       </section>
 
//       <section class="container">
//         <h1 class="section-title">Daftar Story yang Tersimpan</h1>
 
//         <div class="reports-list__container">
//           <div id="reports-list"></div>
//           <div id="reports-list-loading-container"></div>
//         </div>
//       </section>
//     `;
//   }
 
//   async afterRender() {
//     // TODO: initial presenter
//   }
 
//   populateBookmarkedReports(message, reports) {
//     if (reports.length <= 0) {
//       this.populateBookmarkedReportsListEmpty();
//       return;
//     }
 
//     const html = reports.reduce((accumulator, report) => {
//       return accumulator.concat(
//         generateReportItemTemplate({
//           ...report,
//           placeNameLocation: report.location.placeName,
//           reporterName: report.reporter.name,
//         }),
//       );
//     }, '');
 
//     document.getElementById('reports-list').innerHTML = `
//       <div class="reports-list">${html}</div>
//     `;
//   }
 
//   populateBookmarkedReportsListEmpty() {
//     document.getElementById('reports-list').innerHTML = generateReportsListEmptyTemplate();
//   }
 
//   populateBookmarkedReportsError(message) {
//     document.getElementById('reports-list').innerHTML = generateReportsListErrorTemplate(message);
//   }
 
//   showReportsListLoading() {
//     document.getElementById('reports-list-loading-container').innerHTML =
//       generateLoaderAbsoluteTemplate();
//   }
 
//   hideReportsListLoading() {
//     document.getElementById('reports-list-loading-container').innerHTML = '';
//   }
// }

import BookmarkPagePresenter from './bookmark-page-presenter';
import Database from '../../database.js';
import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from '../../templates';

export default class BookmarkPage {
  constructor() {
    // this.container = document.getElementById('reports-list');
    this.container = null;
  }

  async render() {
    return `
      <section>
        <div class="reports-list__map__container">
          <div id="map" class="reports-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Story yang Tersimpan</h1>

        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.container = document.getElementById('reports-list');

    const presenter = new BookmarkPagePresenter({ view: this, dbModel: Database });
    await presenter.init();
  }

  populateBookmarkedReports(message, reports) {
    // if (!reports || reports.length <= 0) {
    //   this.populateBookmarkedReportsListEmpty();
    //   return;
    // }

    if (!Array.isArray(reports)) {
      console.error('populateBookmarkedReports: data bukan array:', reports);
      this.populateBookmarkedReportsError('Data cerita tersimpan tidak valid.');
      return;
    }
  
    if (reports.length === 0) {
      this.populateBookmarkedReportsListEmpty();
      return;
    }
  

    const html = reports.reduce((accumulator, report) => {
      return accumulator.concat(
        generateReportItemTemplate({
          ...report,
          placeNameLocation: `Lat: ${report.lat}, Lon: ${report.lon}`,  // Sesuaikan dengan data kamu
          reporterName: report.name || 'Unknown Reporter',              // Pakai 'name' langsung dari report
        }),
      );
    }, '');

    document.getElementById('reports-list').innerHTML = `
      <div class="reports-list">${html}</div>
    `;
  }

  populateBookmarkedReportsListEmpty() {
    document.getElementById('reports-list').innerHTML = generateReportsListEmptyTemplate();
  }

  populateBookmarkedReportsError(message) {
    document.getElementById('reports-list').innerHTML = generateReportsListErrorTemplate(message);
  }

  showReportsListLoading() {
    document.getElementById('reports-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportsListLoading() {
    document.getElementById('reports-list-loading-container').innerHTML = '';
  }
}
