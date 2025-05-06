import React, { useRef, useEffect, useState } from 'react';
import './card.css';

const Cards = ({ data }) => {
  const carouselRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(1); // Default to mobile view

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= 576) { // Mobile
        setVisibleCards(2);
      } else if (width <= 768) { // Small tablets
        setVisibleCards(1.5); // Show 1.5 cards (peek at next)
      } else if (width <= 1024) { // Tablets/iPads
        setVisibleCards(2.5); // Show 2.5 cards (peek at third)
      } else { // Desktop
        setVisibleCards(4); // Show 4 cards
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const cardElement = carouselRef.current.querySelector('.card');
      if (cardElement) {
        const cardWidth = cardElement.offsetWidth + 10; // Include gap
        const scrollAmount = cardWidth * (direction === 'left' ? -1 : 1);
        carouselRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  if (!data?.length) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className="cards-container">
      <button className="scroll-button left" onClick={() => scroll('left')}>
        <img src="/left-arrow.png" alt="Scroll left" />
      </button>

      <div 
        className="cards-carousel" 
        ref={carouselRef}
        style={{
          '--visible-cards': visibleCards
        }}
      >
        {data.map((crypto, index) => (
          <div key={index} className="card">
            <img src={crypto.image} alt={crypto.name} className="crypto-image" />
            <div className="crypto-info">
              <span className="crypto-name">{crypto.name || 'Unknown'}</span>
              <span className="crypto-symbol">{crypto.symbol || ''}</span>
            </div>
            <div className="crypto-price">{crypto.price || 'N/A'}</div>
          </div>
        ))}
      </div>

      <button className="scroll-button right" onClick={() => scroll('right')}>
        <img src="/right-arrow.png" alt="Scroll right" />
      </button>
    </div>
  );
};

export default Cards;