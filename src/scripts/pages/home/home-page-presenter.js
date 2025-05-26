import StoryApi from '../../data/api';
import HomePageView from './home-page-view';

class HomePagePresenter {
  #dbModel;
  _view;

  constructor({ view, dbModel }) {
    this._view = view;
    this.#dbModel = dbModel;
  }

  async init() {
    try {
      const stories = await StoryApi.getStories();
      this._view.renderStories(stories);
      this.bindSaveButtonClick();
    } catch (error) {
      this._view.showError('Gagal memuat cerita.');
    }
  }

  async saveStory(story) {
    if (!story || !story.id) {
      throw new Error('Story object with id is required to save.');
    }
    await this.#dbModel.putStory(story);
  }

  bindSaveButtonClick() {
    const saveButtons = this._view.container.querySelectorAll('.btn-save');
    saveButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const storyId = button.dataset.id;
        try {
          const story = await StoryApi.getStoryById(storyId);
          await this.saveStory(story);
          this._view.showSaveSuccess(`Berhasil menyimpan cerita (ID: ${storyId})`);
        } catch (error) {
          console.error('Gagal menyimpan cerita:', error);
          if (typeof this._view.showSaveFailed === 'function') {
            this._view.showSaveFailed(`Gagal menyimpan cerita: ${error.message}`);
          } else {
            alert(`Gagal menyimpan cerita: ${error.message}`);
          }
        }
      });
    });
  }
}

export default HomePagePresenter;