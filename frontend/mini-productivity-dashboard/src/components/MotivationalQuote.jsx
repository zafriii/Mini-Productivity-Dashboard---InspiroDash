import React, { useState, useEffect } from 'react';
import './styles/MotivationalQuote.css';

const MotivationalQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime(); 
      const res = await fetch(
        `https://api.allorigins.win/raw?url=https://zenquotes.io/api/random?ts=${timestamp}`
      );
      const data = await res.json();
      setQuote(data[0]);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="quote-container">
      {loading ? (
        <p>Loading quote...</p>
      ) : quote ? (
        <>
          <h3 className="quote-heading">Today's Motivation</h3>
          <blockquote className="quote-text">
            “{quote.q}”
            <footer className="quote-author">— {quote.a}</footer>
          </blockquote>
        </>
      ) : (
        <p>Could not load quote.</p>
      )}

      <button className="quote-button" onClick={fetchQuote}>
        New Quote
      </button>
    </div>
  );
};

export default MotivationalQuote;
