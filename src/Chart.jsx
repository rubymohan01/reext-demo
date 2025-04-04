import ReExt from '@sencha/reext';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CryptoChart = () => {
  const { id } = useParams();
  const [cryptoDatas, setCryptoDatas] = useState(null);
  const [chartInterval, setChartInterval] = useState("30");
  const [isLoading, setIsLoading] = useState(false);

  const intervalOptions = [
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
    { label: "3 Months", value: "90" },
    { label: "6 Months", value: "180" },
    { label: "1 Year", value: "365" }
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
            "x-cg-demo-api-key": "CG-zmpnoJX4TvWtzEV5FNAQUVfp"
          }
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

    return () => {
      isMounted = false;
    };
  }, [chartInterval, id]);

  return (
    <>
      <div className="heading">Cryptocurrency Price Chart</div>
      <div className="button-group-container">
        <div className="name">Crypto Insights</div>
        <div className="buttons">
          {intervalOptions.map((option) => (
            <button
              key={option.value}
              className={`button ${chartInterval === option.value ? 'selected' : ''}`}
              onClick={() => handleButtonClick(option.value)}
              disabled={isLoading}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: 'auto', position: "relative", top: "120px" }}>
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
              background: '#5a6f7c',
              store: {
                fields: ['time', 'price'],
                data: cryptoDatas.map(item => ({
                  time: new Date(item[0]),
                  price: item[1]
                })),
              },
              theme: "blue",
              axes: [
                {
                  type: 'time',
                  position: 'bottom',
                  fields: ['time'],
                  title: 'Date',
                  dateFormat: 'M d, Y',
                  label: {
                    rotate: {
                      degrees: -45
                    }
                  },
                  majorUnit: {
                    days: chartInterval <= 30 ? 5 : chartInterval <= 90 ? 15 : 30
                  }
                },
                {
                  type: 'numeric',
                  position: 'left',
                  fields: ['price'],
                  title: 'Price (USD)',
                  renderer: (axis, label) => `$${label.toFixed(2)}`,
                  increment: 10000
                },
              ],
              series: [{
                type: 'line',
                xField: 'time',
                yField: 'price',
                title: 'Bitcoin Price',
                style: {
                  stroke: '#32CD32',
                  lineWidth: 2,
                },
                highlight: true,
                tooltip: {
                  trackMouse: true,
                  renderer: (tooltip, record) => {
                    const time = record.get("time").toLocaleDateString();
                    const price = record.get("price");
                    tooltip.setHtml(`Date: ${time}<br>Price: $${price.toFixed(2)}`);
                  },
                },
              }]
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