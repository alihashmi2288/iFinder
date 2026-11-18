import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { PresenterBar } from './components/PresenterBar';
import { ToastContainer } from './components/ToastContainer';
import { AgentPortalShell } from './features/agent/AgentPortalShell';
import { BuyerAppShell } from './features/buyer/BuyerAppShell';
import { LandingPage } from './features/website/LandingPage';
import { AppProvider } from './store/AppContext';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col">
            <PresenterBar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app/*" element={<BuyerAppShell />} />
                <Route path="/agent/*" element={<AgentPortalShell />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <ToastContainer />
          </div>
        </HashRouter>
      </AppProvider>
    </MotionConfig>
  );
}
