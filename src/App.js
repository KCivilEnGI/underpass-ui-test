import React, { useState, useRef } from "react";
import './App.css';
import {UnderpassMap} from "@hotosm/underpass-ui";

function App() {
  const [coords, setCoords] = useState([-79.64696, 0.95953].reverse());
    const [activeFeature, setActiveFeature] = useState(null);
    const [tagKey, setTagKey] = useState("building");
    const [tagValue, setTagValue] = useState("yes");
    const tagKeyRef = useRef();
    const tagValueRef = useRef();

    const handleFilterClick = (e) => {
        e.preventDefault();
        setTagKey(tagKeyRef.current.value);
        setTagValue(tagValueRef.current.value);
        return false;
    }

  return (
    <div>
      <div className="top">
          <form>
              <input
                  type="text"
                  placeholder="key (ex: natural)"
                  ref={tagKeyRef}
              />
              &nbsp;
              <input
                  type="text"
                  placeholder="value (ex: water)"
                  ref={tagValueRef}
              />
               &nbsp;
              <button onClick={handleFilterClick}>Filter</button>
          </form>
      </div>
      <div className="container">
          <div className="section2">
              <UnderpassMap
                  center={coords}
                  tagKey={tagKey}
                  tagValue={tagValue}
                  highlightDataQualityIssues
                  grayscale
                  popupFeature={activeFeature}
              />
          </div>
      </div>
    </div>
  );
}

export default App;
