import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import EventDetailPage from "@/pages/EventDetailPage";
import EventsPage from "@/pages/EventsPage";
import LandingPage from "@/pages/LandingPage";
import LiveRoomPage from "@/pages/LiveRoomPage";
import LoginPage from "@/pages/LoginPage";
import MyPage from "@/pages/MyPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SettingsPage from "@/pages/SettingsPage";
import SignupPage from "@/pages/SignupPage";

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailPage />} />
              <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            {/* 没入感を優先し、ライブ会場と認証画面は共通ヘッダー無しのレイアウト */}
            <Route path="/live/:eventId" element={<LiveRoomPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}
