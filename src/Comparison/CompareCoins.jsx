import React, { useState } from "react";
import CryptoChart from "../Chart";

const coinOptions = [
  { label: "Lido Staked Ether", value: "staked-ether" },
  { label: "Ethereum", value: "ethereum" },
  { label: "Cardano", value: "cardano" },
  { label: "Solana", value: "solana" },
  { label: "pendle", value: "pendle" },
  { label: "Restaked Swell ETH", value: "restaked-swell-eth" },
  { label: "litecoin", value: "litecoin" },
  { label: "monero", value: "monero" }

];

const CompareCoins = () => {
  const [selectedCoin1, setSelectedCoin1] = useState("bitcoin");
  const [selectedCoin2, setSelectedCoin2] = useState("ethereum");
  const [comparedCoins, setComparedCoins] = useState([]);

  const handleCompare = () => {
    if (selectedCoin1 !== selectedCoin2) {
      setComparedCoins([selectedCoin1, selectedCoin2]);
    } else {
      alert("Please select two different coins to compare.");
    }
  };

  const filteredOptions2 = coinOptions.filter(
    (coin) => coin.value !== selectedCoin1
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Compare Cryptocurrencies</h2>

      <div style={styles.dropdownContainer}>
        <div style={styles.selectWrapper}>
          <label>Select Coin 1</label>
          <select
            value={selectedCoin1}
            onChange={(e) => setSelectedCoin1(e.target.value)}
            style={styles.select}
          >
            {coinOptions.map((coin) => (
              <option key={coin.value} value={coin.value}>
                {coin.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.selectWrapper}>
          <label>Select Coin 2</label>
          <select
            value={selectedCoin2}
            onChange={(e) => setSelectedCoin2(e.target.value)}
            style={styles.select}
          >
            {filteredOptions2.map((coin) => (
              <option key={coin.value} value={coin.value}>
                {coin.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleCompare} style={styles.button}>
            Compare
          </button>
        </div>
      </div>



      {comparedCoins.length === 2 && <CryptoChart id={comparedCoins} />}
    </div>
  );
};

const styles = {
  container: {
    padding: "10px",
    fontFamily: "Arial, sans-serif",
    // : "50px",
    color: "#fff",
    maxWidth: "1200px",
    margin: "50px auto"
  },
  header: {
    padding: "20px",
    color: "#ffa559",
    fontSize: "30px",
    textAlign: "center",
    marginBottom: "-40px",
  },
  dropdownContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "-100px",
    // justifyContent: "center",
    marginTop: "60px",
  },
  selectWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
    marginTop: "4px",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#ffa559",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CompareCoins;
