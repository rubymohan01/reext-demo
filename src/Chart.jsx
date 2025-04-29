import ReExt from "@sencha/reext";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

const CryptoChart = () => {
  const { id } = useParams();
  const location = useLocation();
  const [cryptoDatas, setCryptoDatas] = useState(null);
  const selectedData = location.state?.selectedData;
  const [chartInterval, setChartInterval] = useState("30");
  const [isLoading, setIsLoading] = useState(false);

  const intervalOptions = [
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
    { label: "3 Months", value: "90" },
    { label: "6 Months", value: "180" },
    { label: "1 Year", value: "365" },
  ];

  const handleButtonClick = (value) => {
    setChartInterval(value);
  };

  useEffect(() => {
    let isMounted = true;

    const getChartData = async () => {
      try {
        setIsLoading(true);
        const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${chartInterval}&interval<daily&precision=3`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-zmpnoJX4TvWtzEV5FNAQUVfp",
          },
        };

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.prices;
      } catch (error) {
        console.error("Error fetching chart data:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    const fetchData = async () => {
      const data = await getChartData();
      if (isMounted) {
        setCryptoDatas(data);
      }
    };

    fetchData();
    const removeWatermark = () => {
      const container = document.querySelector(
        'div[name="ReExtRoot-cartesian"]'
      );
      console.log(container, "iudsiuiud");
      if (!container) {
        console.warn("Container with name 'ReExtRoot-cartesian' not found.");
        return;
      }

      const secondDiv = container.children[1];
      if (secondDiv) {
        const text = secondDiv.innerText.trim();
        if (text === "ReExt cartesian") {
          secondDiv.remove();
        }
      }
    };

    setTimeout(removeWatermark, 200);

    return () => {
      isMounted = false;
    };
  }, [chartInterval, id]);

  return (
    <>
      <div
        className="heading"
        style={{
          color: "#eeeeee",
          fontSize: "1.5rem",
          position: "relative",
          top: "100px",
          maxWidth: "1200px",
          width: "100%",
          padding: "10px 15px",
          margin: "0 auto",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between", // This will space out the left and right sections
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        {/* Left section - Coin details */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={selectedData?.image}
              alt="none"
              style={{
                width: "80%",
                height: "80%",
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#eeeeee",
              }}
            >
              {selectedData?.name}
            </span>
            <span style={{ color: "#eeeeee" }}>${selectedData?.price}</span>
          </div>
        </div>

        {/* Right section - Hour price */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "15px",
            marginRight:"10px "
          }}
        >
          <div style={{ display: "flex", gap: "8px", 
              fontSize: "1rem",

           }}>
            <span style={{fontSize:"1rem", fontWeight:"bold", marginTop:"3px"}} >24h</span>
            <img
              src="/high.png"
              alt="icon"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <span
            style={{marginTop:"3px"}}
            > ${selectedData?.high_24h}</span>

          
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "1rem",
              // color: "#aaaaaa",
            }}
          >
            <span style={{fontSize:"1rem", fontWeight:"bold", marginTop:"3px"}} >24h</span>

              <img
              src="/low.png"
              alt="icon"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <span
            style={{marginTop:"3px"}}
            
            > ${selectedData?.low_24h} 
            
            </span>
          </div>
          <div
          style={{color:selectedData?.price_change_percentage_24h < 0 ? "#E74C3C":"#27AE60", fontSize:"1rem"}}
          >({selectedData?.price_change_percentage_24h}%)</div>
        </div>
      </div>

      <div className="button-group-container">
        <div className="name">Crypto Insights</div>
        <div className="buttons">
          {intervalOptions.map((option) => (
            <button
              key={option.value}
              className={`button ${
                chartInterval === option.value ? "selected" : ""
              }`}
              onClick={() => handleButtonClick(option.value)}
              disabled={isLoading}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          position: "relative",
          top: "120px",
        }}
      >
        {isLoading ? (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        ) : cryptoDatas ? (
          <ReExt
            xtype="cartesian"
            key={chartInterval}
            config={{
              width: "100%",
              height: "70vh",
              marginBottom: "20px",
              background: "#5a6f7c",
              store: {
                fields: ["time", "price"],
                data: cryptoDatas.map((item) => ({
                  time: new Date(item[0]),
                  price: item[1],
                })),
              },
              theme: "blue",
              axes: [
                {
                  type: "time",
                  position: "bottom",
                  fields: ["time"],
                  title: "Date",
                  dateFormat: "M d, Y",
                  label: {
                    rotate: {
                      degrees: -45,
                    },
                  },
                  majorUnit: {
                    days:
                      chartInterval <= 30 ? 5 : chartInterval <= 90 ? 15 : 30,
                  },
                },
                {
                  type: "numeric",
                  position: "left",
                  fields: ["price"],
                  title: "Price (USD)",
                  renderer: (axis, label) => `$${label.toFixed(2)}`,
                  increment: 10000,
                },
              ],
              series: [
                {
                  type: "line",
                  xField: "time",
                  yField: "price",
                  title: "Bitcoin Price",
                  style: {
                    stroke: "#32CD32",
                    lineWidth: 2,
                  },
                  highlight: true,
                  tooltip: {
                    trackMouse: true,
                    renderer: (tooltip, record) => {
                      const time = record.get("time").toLocaleDateString();
                      const price = record.get("price");
                      tooltip.setHtml(
                        `Date: ${time}<br>Price: $${price.toFixed(2)}`
                      );
                    },
                  },
                },
              ],
            }}
          />
        ) : (
          <div>No data available</div>
        )}
      </div>
    </>
  );
};

export default CryptoChart;