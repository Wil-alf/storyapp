import { openDB } from 'idb';
 
const DATABASE_NAME = 'StoryApp';
const DATABASE_VERSION = 3;

const STORY_STORE = 'stories';
 
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(STORY_STORE)) {
      database.createObjectStore(STORY_STORE, { keyPath: 'id' });
    }
  },
});

const Database = {
  async putStory(story) {
    if (!Object.hasOwn(story, 'id')) {
      throw new Error('`id` is required to save.');
    }
    return (await dbPromise).put(STORY_STORE, story);
  },

  async getStory(id) {
    return (await dbPromise).get(STORY_STORE, id);
  },

  async getAllStories() {
    const db = await dbPromise;
    const allStories = await db.getAll(STORY_STORE);
    console.log('Database.getAllStories:', allStories);
    return allStories;
  },

  async deleteStory(id) {
    // return (await dbPromise).delete(STORY_STORE, id);

    if (!id) return;

    const db = await dbPromise;
    return db.delete('stories', id);
  },
};

export default Database;