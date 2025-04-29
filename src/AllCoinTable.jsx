import ReExt from "@sencha/reext";
import "./table.css";
import React, { useEffect, useState } from "react";
import { fetchMarketData, fetchTrendData } from "./Api";
import { useNavigate } from "react-router-dom";

const Table = () => {
  const [allData, setAllData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [callApi, setCallApi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const pageSize = 100;

  useEffect(() => {
    const removeWatermark = () => {
      const container = document.querySelector('div[name="ReExtRoot-grid"]');
      console.log(container, "iudsiuiud")
      if (!container) {
        console.warn("Container with name 'ReExtRoot-grid' not found.");
        return;
      }

      const secondDiv = container.children[1];
      if (secondDiv) {
        const text = secondDiv.innerText.trim();
        if (text === "ReExt grid") {
          secondDiv.remove();
        }
      }
    };

    setTimeout(removeWatermark, 200);
  }, []);

  const loadTableData = async () => {
    setIsLoading(true);
    try {
      const allData = [];
      for (let page = 1; page < 5; page++) {
        const pageData = await fetchMarketData(page);
        allData.push(...pageData);
      }
      setAllData(allData);
      setTotalCount(allData.length);
      setDisplayData(allData.slice(0, pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setCallApi(false);
    }
  };

  const categoriesData = async () => {
    try {
      const fetchData = await fetchTrendData();
      setTrendData(fetchData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategory = (data1) => {
    if (!data1) {
      setDisplayData(allData.slice(0, pageSize));
      setTotalCount(allData.length);
      return;
    }
    const validSymbols = Object.keys(data1.market_cap_change_percentage_24h || {})
      .reduce((acc, key) => {
        acc[key.toLowerCase()] = data1.market_cap_change_percentage_24h[key];
        return acc;
      }, {});
    const filteredData = allData.map(item => {
      const symbolLower = item?.symbol?.toLowerCase();
      if (validSymbols[symbolLower]) {
        return {
          ...item,
          market_cap_change_24h: validSymbols[symbolLower]
        };
      }
      return null;
    }).filter(Boolean);
    setDisplayData(filteredData.slice(0, pageSize));
    setTotalCount(filteredData.length);
  };

  const handlePageChange = (pagingToolbar) => {
    const store = pagingToolbar.getStore();
    const currentPage = store.currentPage;
    const startIdx = (currentPage) * pageSize;
    const endIdx = (startIdx) + pageSize;
    const paginatedData = allData.slice(startIdx, endIdx);
    setDisplayData(paginatedData);
  };

  const handleSearch = (field, newValue) => {
    if (newValue) {
      const filtered = allData.filter(record =>
        record.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setDisplayData(filtered.slice(0, pageSize));
      setTotalCount(filtered.length);
    } else {
      setDisplayData(allData.slice(0, pageSize));
      setTotalCount(allData.length);
    }
  };

  useEffect(() => {
    categoriesData();
    loadTableData();
  }, []);

  if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <ReExt
        xtype="grid"
        style={{
          height: "85vh",
          maxWidth: "1200px",
          margin: "0 auto",
          color: "#5A6F7C",
          position: "relative",
          top: "90px",
        }}
        config={{
          columns: [
            {
              text: "Name",
              dataIndex: "name",
              flex: 1,
              renderer: (value, metaData, data) => {
                const symbol = data.get("symbol");
                return `<div style="font-size: 16px; font-weight: bold;">${symbol.toUpperCase()}</div>
                <span style="font-size: 10px; color: #eeeeee80;">${value}</span>`;
              },
            },
            {
              text: "Current Price",
              dataIndex: "current_price",
              flex: 1,
              renderer: (value) => {
                return `<div style="font-size: 15px; font-weight: 600;">$${value}</div>`;
              },
            },
            {
              text: "24h Change",
              dataIndex: "price_change_percentage_24h",
              flex: 1,
              renderer: (value) => {
                if (typeof value !== "string") value = String(value);
                const color = value.includes("-") ? "#E74C3C" : "#27AE60";
                return `<div style="font-size: 15px; font-weight: 600; color: ${color};">${value}%</div>`;
              },
            },
            {
              text: "Volume",
              dataIndex: "total_volume",
              flex: 1,
              renderer: (value) => {
                return `<div style="font-size: 15px; font-weight: 600;">$${value.toLocaleString()}</div>`;
              },
            },
            {
              text: "24h Price",
              dataIndex: "high_24h",
              flex: 1,
              renderer: (value, metaData, data) => {
                const low_24h = data.get("low_24h");
                return `<div style="font-size: 15px; font-weight: 600;">High: $${value}</div>
                <span style="font-size: 10px; color: #eeeeee80;">Low: $${low_24h}</span>`;
              },
            },
          ],
          store: {
            data: displayData,
            proxy: {
              type: "memory",
              reader: {
                type: "json",
              },
            },
          },
          tbar: [
            {
              xtype: "tbtext",
              text: "Crypto Table",
              width: 300,
              style: {
                padding: "2px 6px",
                color: "#FFA559",
                fontWeight: "bold",
                fontSize: "20px"
              },
            },
            '->',
            {
              xtype: 'combobox',
              fieldLabel: 'Categories',
              name: 'category',
              width: 300,
              style: {
                padding: "2px 6px",
                color: "#FFA559",
                fontWeight: "bold",
                fontSize: "20px"
              },
              store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value', 'data'],
                data: [
                  { name: 'All', value: 'all', data: null },
                  ...trendData.map(item => ({
                    name: item.name,
                    value: item.name.toLowerCase().replace(/\s+/g, '-'),
                    data: item.data
                  }))
                ],
              }),
              displayField: 'name',
              valueField: 'value',
              value: 'all',
              queryMode: 'local',
              forceSelection: true,
              editable: false,
              listeners: {
                change: function (combobox, newValue) {
                  const selectedItem = combobox.getStore().findRecord('value', newValue);
                  handleCategory(selectedItem?.get('data'));
                }
              }
            },
            {
              xtype: "textfield",
              emptyText: "Search by name...",
              width: 300,
              style: {
                padding: "0px 6px",
              },
              listeners: {
                change: handleSearch
              },
            },
          ],
          bbar: {
            xtype: 'pagingtoolbar',
            displayInfo: false,
            displayMsg: `Displaying {0} - {1} of ${totalCount}`,
            emptyMsg: 'No data to display',
            pageSize: pageSize,
            store: {
              data: allData,
              pageSize: pageSize,
              proxy: {
                type: 'memory',
                reader: {
                  type: 'json',
                },
                enablePaging: true
              }
            },
            listeners: {
              beforechange: handlePageChange
            }
          }
        }}
        onSelect={(grid, selected) => {
          const id = selected?.id;
          const serializableData = {
            id: selected.id,
            name: selected?.data?.name,
            price: selected?.data?.current_price,
            image:selected?.data?.image,
            low_24h:selected?.data?.low_24h,
            high_24h:selected?.data?.high_24h,
            price_change_percentage_24h:selected?.data?.price_change_percentage_24h
          };
          
          navigate(`/chart/${id}`, { 
            state: { selectedData: serializableData } 
          });
        }}
      />
    </>
  );
};
export default Table;