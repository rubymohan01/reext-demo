import React, { useRef } from 'react';
import ReExt from '@sencha/reext';

const Cards = ({ data }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scroller = carouselRef.current.querySelector('[role="presentation"]');
      const scrollWidth = (scroller.clientWidth / 300);
      if (scroller) {
        scroller.scrollBy({ left: -(scrollWidth * 300) + 20, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scroller = carouselRef.current.querySelector('[role="presentation"]');
      const scrollWidth = Math.floor(scroller.clientWidth / 300);
      if (scroller) {
        scroller.scrollBy({ left: scrollWidth * 300, behavior: 'smooth' });
      }
    }
  };


  const renderCryptoCardItems = (crypto) => [
    {
      xtype: 'container',
      html: `
        <div style="background-color: #5a6f7c; color: #eeeeee; border-radius: 15px; display: flex; align-items: center; padding: 10px; height: 80px;">
          <img src="${crypto.image || ''}" width="40" height="40" style="vertical-align: middle; border-radius: 50%" />
          <div style="display: flex; font-size: 1rem; flex-direction: column; flex: 1">
            <span style="margin-left: 10px; font-weight: 700; padding: 5px 2px; text-overflow: ellipsis; max-width: 150px; overflow: hidden;">
              ${crypto.name || 'Unknown'}
            </span>
            <span style="margin-left: 10px; padding: 5px 2px; color: #eeeeee80">
              ${crypto.symbol || ''}
            </span>
          </div>
          <div style="display: flex; font-size: 1rem; flex-direction: column; flex: 1">
            <span style="margin-left: 10px; font-weight: 700; font-size: 1rem; align-self: flex-start; margin: 10px">
              ${crypto.price || 'N/A'}
            </span>
          </div>
        </div>
      `,
      flex: 1,
    },
  ];

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{ color: 'white', margin: '30px 20px' }}>No data available</div>;
  }

  return (
    <div ref={carouselRef} style={{ display: 'flex', alignItems: 'center', maxHeight: '147px', minHeight: '147px' }}>
      <img onClick={scrollLeft} style={{ cursor: "pointers" }} src={"/left-arrow.png"} />
      <ReExt
        xtype="container"
        style={{
          maxHeight: '147px',
          minHeight: '147px',
          flex: 1,
        }}
        config={{
          layout: 'hbox',
          scrollable: 'horizontal',
          style: {
            margin: '30px 0',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          },
          items: data.map((crypto, index) => ({
            xtype: 'panel',
            maxBlockSize: 'max-content',
            layout: 'hbox',
            margin: '0 10',
            width: 300,
            key: index,
            style: { cursor: 'pointer' },
            items: renderCryptoCardItems(crypto),
          })),
        }}
      />
      <img onClick={scrollRight} style={{ cursor: "pointers" }} src={"/right-arrow.png"} />
    </div>
  );
};

export default Cards;
