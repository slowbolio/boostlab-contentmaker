import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import RequireAuth from '@/components/auth/require-auth';
import RootLayout from '@/components/layout/root-layout';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import ABTesting from '@/pages/ab-testing';
import ABTestDetails from '@/pages/ab-test-details';
import ContentCreator from '@/pages/content-creator';
import ContentEnhancer from '@/pages/content-enhancer';
import AdvancedContentEditor from '@/pages/advanced-content-editor';
import SavedProjects from '@/pages/saved-projects';
import Templates from '@/pages/templates';
import Analytics from '@/pages/analytics';
import SEOAnalysis from '@/pages/seo-analysis';
import Settings from '@/pages/settings';
import Team from '@/pages/team';
import NotFound from '@/pages/not-found';
import { BackendInitialization } from '@/components/initialization';

function App() {
  return (
    <>
      {/* Backend initialization component - auto-connects if enabled */}
      <BackendInitialization />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <RequireAuth>
              <RootLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="ab-testing" element={<ABTesting />} />
          <Route path="ab-testing/:id" element={<ABTestDetails />} />
          <Route path="content-creator" element={<ContentCreator />} />
          <Route path="advanced-editor" element={<AdvancedContentEditor />} />
          <Route path="content-enhancer" element={<ContentEnhancer />} />
          <Route path="saved-projects" element={<SavedProjects />} />
          <Route path="templates" element={<Templates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="seo-analysis" element={<SEOAnalysis />} />
          <Route path="settings" element={<Settings />} />
          <Route path="team" element={<Team />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;