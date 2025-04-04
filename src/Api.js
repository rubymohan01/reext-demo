export const fetchTrendingData = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/search/trending"
    );
    if (!response.ok) throw new Error("Failed to fetch trending data");
    const data = await response.json();
    return data.coins.map((coin) => ({
      name: coin.item.name,
      image: coin.item.thumb,
      price: coin.item.data.price,
      symbol: coin.item.symbol.toUpperCase(),
      change: coin.item.data.price_change_percentage_24h,
    }));
  } catch (error) {
    console.error("Error fetching trending data:", error);
    throw error;
  }
};

export const fetchMarketData = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
    );
    if (!response.ok) throw new Error("Failed to fetch market data");
    const allData = await response.json();

    return allData;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};

export const getTopGainerAndLosers = async () => {
  try {
    const allData = await fetchMarketData();
    const sortedCoins = [...allData].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    const topGainers = sortedCoins
      .filter((coin) => coin.price_change_percentage_24h > 0)
      .slice(0, 6)
      .map((coin) => ({
        name: coin.name,
        image: coin.image,
        price: coin.current_price,
        symbol: coin.symbol.toUpperCase(),
        volume: coin.total_volume,
        changePer24h: coin.price_change_percentage_24h,
      }));

    const topLosers = sortedCoins
      .filter((coin) => coin.price_change_percentage_24h < 0)
      .slice(0, 6)
      .map((coin) => ({
        name: coin.name,
        image: coin.image,
        price: coin.current_price,
        symbol: coin.symbol.toUpperCase(),
        volume: coin.total_volume,
        changePer24h: coin.price_change_percentage_24h,
      }));

    return { topGainers, topLosers };
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};

export const getTopLeaders = async () => {
  try {
    const allData = await fetchMarketData();
    const topLeaders = allData.slice(0, 10).map((coin) => ({
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      symbol: coin.symbol.toUpperCase(),
      volume: coin.total_volume,
      changePer24h: coin.price_change_percentage_24h,
    }));

    return topLeaders;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};
