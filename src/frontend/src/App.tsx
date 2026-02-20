import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TutorialsPage from './pages/TutorialsPage';
import TutorialDetailPage from './pages/TutorialDetailPage';
import ProjectsGalleryPage from './pages/ProjectsGalleryPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import PublishProjectPage from './pages/PublishProjectPage';
import MyProjectsPage from './pages/MyProjectsPage';
import TrackProjectPage from './pages/TrackProjectPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const tutorialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutorials',
  component: TutorialsPage,
});

const tutorialDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutorials/$name',
  component: TutorialDetailPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectsGalleryPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$title',
  component: ProjectDetailPage,
});

const publishRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/publish',
  component: PublishProjectPage,
});

const myProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-projects',
  component: MyProjectsPage,
});

const trackProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/track/$title',
  component: TrackProjectPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tutorialsRoute,
  tutorialDetailRoute,
  projectsRoute,
  projectDetailRoute,
  publishRoute,
  myProjectsRoute,
  trackProjectRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
