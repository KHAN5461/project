import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import Projects from '@/pages/Projects';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Projects />,
      },
      {
        path: '/editor/:id',
        element: <div>Editor Page</div>,
      },
    ],
  },
]);