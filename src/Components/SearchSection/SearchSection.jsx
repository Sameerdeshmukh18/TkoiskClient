import React from "react";
import "./SearchSection.css";

function SearchSection() {
  return (
    <div className="SearchSection">
      <div className="searbar-with-result">
        {/* <div className="search-bar">
          <i className="bi bi-search"></i>
          <input type="text" className="search-input" placeholder="Search" />
        </div> */}

        <div className="result-box" id="resultBox">
          <div className="result-item">Result 1</div>
          <div className="result-item">Result 2</div>
          <div className="result-item">Result 3</div>
          <div className="result-item">Result 2</div>
          <div className="result-item">Result 3</div>
          <div className="result-item">Result 2</div>
          <div className="result-item">Result 3</div>
        </div>
      </div>

      <div className="whats-happening-card">Whats happening...</div>
    </div>
  );
}

export default SearchSection;
