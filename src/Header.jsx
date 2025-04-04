import { Link, useLocation } from "react-router-dom";
import "./header.css";

import { useEffect, useState } from "react";
import Cards from "./Cards";
import ReExt from "@sencha/reext";
import { fetchTrendingData, getTopLeaders } from "./Api";

const Header = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false);
  const [trendingData, setTrendingData] = useState([]);
  const [topLeaders, setTopLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState({
    trending: true,
    gainers: true,
    losers: true,
    leader: true,
    all: true,
  });
  const [error, setError] = useState(null);


  const loadTrendingData = async () => {
    try {
      const fetchData = await fetchTrendingData();
      setTrendingData(fetchData);
    } catch (error) {
      console.error("Error fetching trending data:", error);
      setError(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, trending: false }));
    }
  };

  const loadMarketLeaders = async () => {
    try {
      const topLeader = await getTopLeaders()
      setTopLeaders(topLeader);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setError(error.message);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        leader: false
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([loadTrendingData(), loadMarketLeaders()]);
    };
    fetchData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const tabs = [
    {
      id: "tab1",
      title: "Market Leaders",
      data: topLeaders.map((item) => ({
        ...item,
        price: formatPrice(item.price),
      })),
      loading: isLoading.leader,
    },
    {
      id: "tab2",
      title: "Top Trending",
      data: trendingData.map((item) => ({
        ...item,
        price: formatPrice(item.price),
      })),
      loading: isLoading.trending,
    },
  ];

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src={"/growth.png"} alt="Site Icon" className="header-icon" />
          <span className="header-title">CryptoInsights</span>
          <img
            src="/hamburger.png"
            className="hamburger-menu"
            alt="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          <div className={`menu ${menuOpen ? "show-menu" : "hide-menu"}`}>
            <Link to="/">
              <button className={`header-btn ${location.pathname === "/" ? "active-tab" : ""}`} onClick={() => setMenuOpen(false)}>Explore</button>
            </Link>
            <Link to="/dashboard">
              <button className={`header-btn ${location.pathname === "/dashboard" ? "active-tab" : ""}`} onClick={() => setMenuOpen(false)}>Dashboard</button>
            </Link>
          </div>
        </div>
      </header>

      <section className="sub-header">
        {error ? (
          <div className="error-message">Error loading data: {error}</div>
        ) : (
          <>
            <ReExt
              xtype="tabpanel"
              style={{ width: "100%", minHeight: "200px" }}
              cls="custom-tab-panel"
              config={{
                activeTab: 0,
                tabBar: {
                  style: {
                    backgroundColor: "transparent",
                    height: "53px",
                    wdith: "100%",
                    boxShadow: "0 6px 5px rgba(0, 0, 0, 0.1)",
                  },
                },
              }}
            >
              {tabs.map((tab) => (
                <ReExt
                  xtype="container"
                  title={tab.title}
                  itemId={tab.id}
                  key={tab.id}
                >
                  {tab.loading ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : (
                    <Cards data={tab.data} />
                  )}
                </ReExt>
              ))}
            </ReExt>
          </>
        )}
      </section>
    </>
  );
};

export default Header;
