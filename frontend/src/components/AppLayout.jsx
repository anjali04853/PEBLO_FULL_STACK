import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

/** Authenticated app shell: persistent sidebar + routed main content. */
export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
