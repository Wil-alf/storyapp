import HomePagePresenter from './home-page-presenter';
import HomePageView from './home-page-view';
import Database from '../../database';

class HomePage {
  async render() {
    return '<section id="main-content"><h2>Daftar Cerita</h2><div id="story-container"></div></section>';
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    const container = document.getElementById('story-container');

    if (!token) {
      container.innerHTML = '<p>Silakan login untuk melihat cerita.</p>';
      return;
    }

    const view = new HomePageView('story-container');
    // const presenter = new HomePagePresenter({ view });
    const presenter = new HomePagePresenter({ view, dbModel: Database });
    await presenter.init();
  }
}

export default HomePage;