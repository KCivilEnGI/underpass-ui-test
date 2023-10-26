import React, { useState, useRef, useEffect } from "react";
import {UnderpassFeatureList, UnderpassMap, HOTTheme} from "@hotosm/underpass-ui";
import './App.css';
import "@hotosm/underpass-ui/dist/index.css";


const config = {
    MAPBOX_TOKEN: "",
    API_URL:"http://74.207.226.67:8000" //get Wisconsin data
}

function App() {
  const [coords, setCoords] = useState([0.95953, -79.64696]);
    const [activeFeature, setActiveFeature] = useState(null);
    const [tags, setTags] = useState("building=yes");
    const [hashtag, setHashtag] = useState("");
    const [mapSource, setMapSource] = useState("osm");
    const [realtime, setRealtime] = useState(false);
    const tagsInputRef = useRef("");
    const hashtagInputRef = useRef("");
    const styleSelectRef = useRef();


    const hottheme = HOTTheme();

    const defaultMapStyle = {
      waysLine: {
          ...hottheme.map.waysLine,
          "line-opacity": .8,
      },
      waysFill: {
          ...hottheme.map.waysFill,
          "fill-opacity":
          [
              "match",
              ["get", "type"],
              "LineString", 0, .3
          ]
      },
      nodesSymbol: {
          ...hottheme.map.nodesSymbol,
          "icon-opacity": [
              "match",
              ["get", "type"],
              "Point", .8, 0
            ],        
      },
    };

    const [demoTheme, setDemoTheme] = useState({
      map: defaultMapStyle
    });

    const handleFilterClick = (e) => {
        e.preventDefault();
        setTags(tagsInputRef.current.value);
        setHashtag(hashtagInputRef.current.value);
        return false;
    }

    const handleMapSourceSelect = (e) => {
        setMapSource(e.target.options[e.target.selectedIndex].value);
    }

  return (
    <div>
      <div className="top">
          <form>
              <input
                  type="text"
                  placeholder="key (ex: building=yes)"
                  ref={tagsInputRef}
              />
              &nbsp;
              <input
                  type="text"
                  placeholder="hashtag (ex: hotosm-project)"
                  ref={hashtagInputRef}
              />
               &nbsp;
              <button onClick={handleFilterClick}>Search</button>
          </form>
          <select onChange={handleMapSourceSelect} ref={styleSelectRef}  className="mapSourceSelect">
            <option value="osm">OSM</option>
            <option value="bing">Bing</option>
            <option value="esri">ESRI</option>
          </select>
      </div>
      <div className="container">
          <div className="section2">
              <UnderpassMap
                  center={coords}
                  tags={tags}
                  hashtag={hashtag}
                  highlightDataQualityIssues
                  grayscale
                  popupFeature={activeFeature}
                  source={mapSource}
                  config={config}
                  realtime={realtime}
                  theme={demoTheme}

              />
          </div>
          <div className="section1" style={{
                    backgroundColor: `rgb(${hottheme.colors.white})`}}>
              <h2>
                <img src="/hot-logo.svg" />
                <span>Latest mapped features</span>
              </h2>
              <form className="optionsForm">
                <input onChange={() => { setRealtime(!realtime)}} name="liveCheckbox" type="checkbox" />
                <label>Live</label>
              </form>
              <UnderpassFeatureList
                  tags={tags}
                  hashtag={hashtag}
                  page={0}
                  config={config}
                  realtime={realtime}
                  onSelect={(feature) => {
                      setCoords([feature.lat, feature.lon]);
                      const tags = JSON.stringify(feature.tags);
                      const status = feature.status;
                      setActiveFeature({properties: { tags, status } , ...feature});
                  }}
                  onUpdate={realtime ? (mostRecentFeature) => {
                    if (mostRecentFeature) {
                        setCoords([mostRecentFeature.lat, mostRecentFeature.lon]);
                        const tags = JSON.stringify(mostRecentFeature.tags);
                        const status = mostRecentFeature.status;
                        setActiveFeature({properties: { tags, status } , ...mostRecentFeature});
                    }
                } : false}
              />
          </div>
      </div>
    </div>
  );
}

export default App;
