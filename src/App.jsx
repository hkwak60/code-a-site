// src/components/HomePage.jsx
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const App = ({ onStateClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex flex-col items-center p-8">
      <h1 className="text-5xl font-bold text-green-900 mb-6">
        Explore U.S. Natural Scenery
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        Click on a state to discover its breathtaking landscapes
      </p>

      {/* Add map zoom animation */}
      <motion.div
        className="bg-white shadow-xl rounded-xl p-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <ComposableMap projection="geoAlbersUsa" width={800} height={500}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onStateClick(geo.properties.name)}
                  style={{
                    default: { fill: "#a3d9a5", outline: "none" },
                    hover: {
                      fill: "#6fcf97",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: { fill: "#27ae60", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </motion.div>
    </div>
  );
};

export default App;
