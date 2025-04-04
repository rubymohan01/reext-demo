import { useEffect, useState } from "react";
import CryptoGrid from "./DetailedCard";
import { getTopGainerAndLosers } from "./Api";
const MainContainer = () => {
  const [error, setError] = useState(null);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [isLoading, setIsLoading] = useState({
    gainers: true,
    losers: true,
  });

  const loadTopGainersAndLosers = async () => {
    try {
      const { topGainers, topLosers } = await getTopGainerAndLosers();
      setTopGainers(topGainers)
      setTopLosers(topLosers)
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        gainers: false,
        losers: false
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadTopGainersAndLosers()
    };
    fetchData();
  }, [])

  return (
    <section className="sub-header">
      {error ? (
        <div className="error-message">
          Error loadding data: {error}
        </div>
      ) : (
        <>
          <div>
            <span style={{
              color: "#eeeeee",
              fontSize: "1.75rem",
              marginLeft: "15px"
            }}>Top Gainers</span>
            {topGainers.length > 0 && <CryptoGrid data={topGainers} />}
          </div>
          <div>
            <span style={{
              color: "#eeeeee",
              fontSize: "1.75rem",
              marginLeft: "15px"
            }}>Top Losers</span>
            {topGainers.length > 0 && <CryptoGrid data={topLosers} />}
          </div>
        </>
      )}
    </section>)
}

export default MainContainer;