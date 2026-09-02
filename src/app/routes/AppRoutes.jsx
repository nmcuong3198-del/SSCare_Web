import { Route, Routes } from "react-router-dom";

import MainLayout from "@/app/layouts/MainLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute/ProtectedRoute";
import Login from "@/features/auth/pages/Login/Login";
import Register from "@/features/auth/pages/Register/Register";
import AccountManagement from "@/features/accounts/pages/AccountManagement";
import Home from "@/features/landing/pages/Home";
import About from "@/features/landing/pages/About/About";
import DownloadPage from "@/features/landing/pages/Download/DownloadPage";
import NotificationEditor from "@/features/notifications/pages/NotificationEditor";
import NotificationList from "@/features/notifications/pages/NotificationList";
import PostEditor from "@/features/posts/pages/PostEditor";
import PostList from "@/features/posts/pages/PostList";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/download" element={<DownloadPage />} />

        <Route element={<ProtectedRoute roles={["ADMIN", "CONTENT_EDITOR"]} />}>
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/new" element={<PostEditor />} />
          <Route path="/posts/:code" element={<PostEditor />} />
        </Route>

        <Route element={<ProtectedRoute roles={["ADMIN", "NOTIFICATION_MANAGER"]} />}>
          <Route path="/notifications" element={<NotificationList />} />
          <Route path="/notifications/new" element={<NotificationEditor />} />
          <Route path="/notifications/:code" element={<NotificationEditor />} />
        </Route>

        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/accounts" element={<AccountManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}
