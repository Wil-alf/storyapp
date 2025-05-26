import CONFIG from '../config';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

const ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  STORIES: `${BASE_URL}/stories`,
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

export function getAccessToken() {
  return localStorage.getItem('token');
}

export async function addStory(description, photo, lat, lng) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('You must be logged in first');

  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  formData.append('latitude', lat);
  formData.append('longitude', lng);

  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (!result.error) {
    return result.message;
  }
  throw new Error('Failed to add story');
}

export async function login(email, password) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login gagal');
  }

  return response.json();
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });
 
  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
 
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
 
export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });
 
  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
 
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// const StoryApi = {
//   async getStories() {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('You must be logged in first');

//     const response = await fetch(ENDPOINTS.STORIES, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch stories');
//     }

//     const responseJson = await response.json();
//     return responseJson.listStory;
//   },
// };

async function getStories() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('You must be logged in first');

  const response = await fetch(ENDPOINTS.STORIES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }

  const responseJson = await response.json();
  return responseJson.listStory;
}

async function getStoryById(id) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('You must be logged in first');

  const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch story detail');
  }

  const result = await response.json();
  return result.story;
}

const StoryApi = {
  getStories,
  getStoryById,
};

export default StoryApi;
