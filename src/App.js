import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, GeolocateControl } from "react-map-gl";
import * as GeoData from "./data/proto_GeoNFT.json";
import "mapbox-gl/dist/mapbox-gl.css";

function Redirect() {
  window.open("http://www.google.com");
}

const geolocateStyle = {
  float: "left",
  margin: "50px",
  padding: "10px",
};

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 10,
  });
  const [selectedLoc, setSelectedLoc] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedLoc(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {GeoData.features.map((d) => (
          <Marker
            key={d.properties.filename}
            latitude={d.geometry.coordinates[1]}
            longitude={d.geometry.coordinates[0]}
          >
            <button
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault();
                setSelectedLoc(d);
              }}
            >
              <img src="/map-marker-svgrepo-com.svg" alt="marker Icon" />
            </button>
          </Marker>
        ))}

        {selectedLoc ? (
          <Popup
            latitude={selectedLoc.geometry.coordinates[1]}
            longitude={selectedLoc.geometry.coordinates[0]}
            onClose={() => {
              setSelectedLoc(null);
            }}
          >
            <div>
              <b>proto GeoNFT beta</b>
            </div>
            <div>GeoNFT#${selectedLoc.properties.filename}</div>
            <div>Minting Radius: ${selectedLoc.properties.mint_radius} m</div>
            <div>
              <img src="${selectedLoc.properties.photo}" width="256" />
            </div>
            <div>
              <button type="button" onClick={Redirect}>
                Mint
              </button>
            </div>
          </Popup>
        ) : null}
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
      </ReactMapGL>
    </div>
  );
}
