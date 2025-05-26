import AddStoryPageModel from './add-story-page.js';

export default class AddStoryPagePresenter {
  async addStory(description, photo, lat, lon) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Anda harus login terlebih dahulu');

    return await AddStoryPageModel.uploadStory({ description, photo, lat, lon, token });
  }
}