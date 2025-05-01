import React, { useState, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { Fill, ReExtProvider } from "@sencha/reext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./Header";
import MainContainer from "./MainContainer";
import "./index.css";
import Table from "./AllCoinTable";
import CryptoChart from "./Chart";
import LoginContainer from "./LoginContainer";
import CompareCoins from "./Comparison/CompareCoins";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
Fill();
var reactroot = ReactDOM.createRoot(document.getElementById("root"));
var ReExtData = {
  sdkversion: "7.8.0",
  toolkit: "classic",
  theme: "",
  packages: {
    charts: true,
    fontawesome: true,
    ux: false,
    calendar: false,
    d3: false,
    exporter: false,
    pivot: false,
    pivotd3: false,
    pivotlocale: false,
    froalaeditor: false,
  },
  rtl: false,
  locale: "en",
  debug: false,
  urlbase: "./",
  location: "remote",
  overrides: false,
};
window.__IS_REEXT_RUNNING__ = true;

// eslint-disable-next-line react-refresh/only-export-components
const AppWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const hideHeaderRoutes = ["/login"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  const handleLoginSuccess = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    navigate("/");
  };
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };
  if (!isAuthenticated) {
    return <LoginContainer onLoginSuccess={handleLoginSuccess} />;
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogout }}>
      <div style={{ minHeight: "100vh", margin: "0px auto" }}>
        {shouldShowHeader && <Header />}
        <Routes>
          <Route path="/" element={<MainContainer />} />
          <Route path="/dashboard" element={<Table />} />
          <Route path="/comparison" element={<CompareCoins />} />
          <Route path="/chart/:id" element={<CryptoChart />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
};
reactroot.render(
  <ReExtProvider
    ReExtData={ReExtData}
    reextkey={
      "QW9YUHNPZkl1d3Z2N1JZdWx6clE2bWlKcWJwVzBOcUxlVFlUTUFjbm0tTS45UkROMlF6TTBnRE4zRWpPaUFIZWxKQ0xpUVRaMWNtZTJsWE4wNUdOMGd6Wm9OR2M1bFRPMWszY3FGRE1mUldhc0ppT2lJV2R6SnllLjlKaU4xSXpVSUppT2ljR2JoSnll"
    }
    splash={true}
    style={{ overflow: "auto" }}
  >
    <Router>
      <AppWrapper />
    </Router>
  </ReExtProvider>
);
