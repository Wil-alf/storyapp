import Database from '../../database.js';
import StoryApi from '../../data/api';

class BookmarkPagePresenter {
  #dbModel;
  _view;

  constructor({ view, dbModel }) {
    this._view = view;
    this.#dbModel = dbModel;
  }

  async init() {
    try {
      this._view.showReportsListLoading();
      // Ambil story yang tersimpan di IndexedDB
      const savedStories = await this.#dbModel.getAllStories();
      this._view.hideReportsListLoading();

      if (!savedStories || savedStories.length === 0) {
        this._view.populateBookmarkedReportsListEmpty();
      } else {
        this._view.populateBookmarkedReports('Berhasil mengambil data', savedStories);
        this.bindRemoveButtonClick();
      }
    } catch (error) {
      console.error('Error loading saved stories:', error);
      this._view.hideReportsListLoading();
      this._view.populateBookmarkedReportsError('Gagal memuat cerita tersimpan.');
    }
  }

  bindRemoveButtonClick() {
    // Asumsikan ada tombol hapus simpan di tiap card dengan class '.btn-remove'
    const removeButtons = this._view.container.querySelectorAll('.btn-remove');
    removeButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const storyId = button.dataset.id;
        try {
          await this.#dbModel.deleteStory(storyId);
          // Refresh list setelah dihapus
          await this.init();
        } catch (error) {
          console.error('Error deleting story:', error);
          alert('Gagal menghapus cerita tersimpan');
        }
      });
    });
  }
}

export default BookmarkPagePresenter;
