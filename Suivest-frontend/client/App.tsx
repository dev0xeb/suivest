import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import Pools from "./pages/Pools";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Docs from "./pages/Docs";

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pools" element={<Pools />} />

      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
      <Route
        path="/how-it-works"
        element={
          <PlaceholderPage
            title="How It Works"
            description="Get a detailed walkthrough of Suivest's saving mechanisms and reward system."
          />
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
