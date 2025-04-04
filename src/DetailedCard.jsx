import React from "react";
import "../public/card.css";
import ReExt from "@sencha/reext";

const CryptoGrid = ({ data }) => {
  const cardTemplate = `
    <div >
      <div class="card-header">
        <img src="{image}" alt="Crypto Logo" class="crypto-logo"/>
        <div class="card-name" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">{name}</div>
        <div class="crypto-pair">
          <div class="crypto-price">{volume}</div>
          <div class="crypo-name" style="text-align: end">Volume</div>
        </div>
      </div>
      <div class="card-body">
        <div class="crypto-volume">
          $<span>{price} </span>
          <span class="volume-label">Price</span>
        </div>
        <div class="crypto-change" >
          {changePer24h}
        </div>
      </div>
    </div>
  `;

  return (
    <>
      <ReExt
        xtype="dataview"
        style={{ height: '100%', margin: "20px", overflow: 'auto' }}
        config={{
          store: {
            data: data,
            proxy: {
              type: 'memory',
              reader: {
                type: 'json',
              },
            },
          },
          itemTpl: cardTemplate,
          emptyText: '<p style="text-align: center; padding: 20px;">Loading...</p>',
          inline: true,
        }}
      />
    </>
  );
};

export default CryptoGrid;
