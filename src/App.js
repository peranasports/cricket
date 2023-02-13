import "./input.css";
import "react-toastify/dist/ReactToastify.css";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import { AlertProvider } from "./context/Alert/AlertContext";
import { CatapultAPIProvider } from "./context/CatapultAPI/CatapultAPIContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import BowlingReport from "./pages/BowlingReport";
import ActivityDetails from "./components/activities/ActivityDetails";
import DeliveriesReport from "./components/reports/DeliveriesReport";
import LoadSavedData from "./pages/LoadSavedData";

function App() {
  return (
    <CookiesProvider>
      <CatapultAPIProvider>
        <AlertProvider>
          <Router>
            <div className="flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto px-3 pb-12">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/loadsaveddata" element={<LoadSavedData />} />
                  <Route
                    path="/activities/:activityId"
                    element={<ActivityDetails />}
                  />
                  <Route path="/bowlingreport" element={<BowlingReport />} />
                  <Route path="/deliveries" element={<DeliveriesReport />} />
                  <Route path="/*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
          <ToastContainer />
        </AlertProvider>
      </CatapultAPIProvider>
    </CookiesProvider>
  );
}

export default App;
