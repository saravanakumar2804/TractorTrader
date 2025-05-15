import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tractors from "@/pages/tractors";
import TractorDetails from "@/pages/tractor-details";
import SellTractor from "@/pages/sell-tractor";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Register from "@/pages/register";

// Layout
import MainLayout from "@/components/layout/MainLayout";

// Load font awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tractors" component={Tractors} />
      <Route path="/tractors/:id" component={TractorDetails} />
      <Route path="/sell" component={SellTractor} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
