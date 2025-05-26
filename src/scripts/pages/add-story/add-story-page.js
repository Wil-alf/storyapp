export default class AddStoryPageModel {
  static async uploadStory({ description, photo, lat, lon, token }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!result.error) {
      return result.message;
    }

    throw new Error(result.message || 'Gagal mengunggah story');
  }
}