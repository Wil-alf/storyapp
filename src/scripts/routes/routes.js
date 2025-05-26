import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import AddStoryPage from '../pages/add-story/add-story-page-view';
import AddStoryPageView from '../pages/add-story/add-story-page-view';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/add-story': new AddStoryPageView(),
  '/bookmark': new BookmarkPage(),
};

export default routes;
