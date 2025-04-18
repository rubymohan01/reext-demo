import { useEffect, useState } from "react";
import Cards from "./Cards";
import ReExt from "@sencha/reext";
import { fetchTrendingData, getTopLeaders } from "./Api";
import "./header.css";

const SubHeader = () => {
  const [trendingData, setTrendingData] = useState([]);
  const [topLeaders, setTopLeaders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState({
    trending: true,
    gainers: true,
    losers: true,
    leader: true,
    all: true,
  });

  useEffect(() => {
    const removeWatermark = () => {
      const container = document.querySelectorAll('div[name="ReExtRoot-tabpanel"]');

      if (!container) {
        console.warn("Container with name 'ReExtRoot-dataview' not found.");
        return;
      }

      container.forEach((div) => {
        const secondDiv = div.children[1];
        const firstDiv = div.children[0];
        if (secondDiv) {
          const text = secondDiv.innerText.trim();
          if (text === "ReExt tabpanel") {
            secondDiv.remove();
          }
        }
        if (firstDiv) {
          const nestedDivs = firstDiv.querySelectorAll('div');

          nestedDivs.forEach((child) => {
            if (child.innerText.trim() === "ReExt container") {
              child.remove();
            }
          });
        }
      });
    };
    setTimeout(removeWatermark, 200);
  }, []);

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
      const topLeader = await getTopLeaders();
      setTopLeaders(topLeader);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setError(error.message);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        leader: false,
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
  )
}
export default SubHeader;