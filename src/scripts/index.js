import '../styles/styles.css';
import App from './pages/app';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();
  await registerServiceWorker();

  // for demonstration purpose-only
  console.log('Berhasil mendaftarkan service worker.');

  window.addEventListener('hashchange', async () => {
    await app.renderPage(app);
  });

  window.addEventListener('load', () => {
    app.renderPage();
  });

  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-link');

  if (mainContent && skipLink) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
});

async function renderWithTransition(app) {
  if (!document.startViewTransition) {
    await app.renderPage();
    return;
  }

  document.startViewTransition(async () => {
    await app.renderPage();
  });
}
