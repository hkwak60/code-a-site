// src/pages/MainPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies } from 'react-simple-maps';
import { geoPath } from 'd3-geo';
import ParkModel from '../data/Model1';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

function MainPage() {
  const location = useLocation();
  const fromWelcome = location.state?.fromWelcome === true;
  const mapRef = useRef(null);

  const [projection, setProjection] = useState(null);
  const [selectedGeo, setSelectedGeo] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const Wrapper = fromWelcome ? motion.div : 'div';

  const model = new ParkModel();

  const handleStateClick = async (geo) => {
    setSelectedGeo(geo);
    setDescription('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/state-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateName: geo.properties.name })
      });
      const data = await res.json();
      setDescription(data.description);
    } catch (err) {
      setDescription('Failed to fetch description.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (e) => {
    if (mapRef.current && !mapRef.current.contains(e.target)) {
      setSelectedGeo(null);
      setDescription('');
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    const handleResize = () => {
      setSelectedGeo(null);
      setDescription('');
      setLoading(false);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const getRandomImage = (stateName) => {
    const key = stateName.replace(/\s/g, '');
    const parks = model.data[key];
    if (!parks || parks.length === 0) return null;
    const shuffledParks = parks.sort(() => 0.5 - Math.random());
    for (let park of shuffledParks) {
      if (park.image && park.image.length > 0) {
        const validImage = park.image.find((img) => img && img.length > 0);
        if (validImage) return validImage;
      }
    }
    return null;
  };

  const toggleParkDescription = async (parkName, index) => {
    if (openParkIndex === index) {
      setOpenParkIndex(null);
      return;
    }
    if (!parkDescriptions[parkName]) {
      const res = await fetch('http://localhost:8000/park-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parkName })
      });
      const data = await res.json();
      setParkDescriptions((prev) => ({ ...prev, [parkName]: data.description }));
    }
    setOpenParkIndex(index);
  };

  return (
    <Wrapper className="relative min-h-screen bg-[#FAFAF7] text-[#0F0F0F] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {fromWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 z-50 bg-white pointer-events-none"
        />
      )}

      <div className="w-full max-w-3xl z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#219653]">Wonders Of.</h1>
          <p className="mt-2 text-lg text-[#333] italic">
            Just you and the open air — where to today?
          </p>
        </div>

        <div
          className="bg-white w-full max-w-2xl shadow-sm rounded-xl p-6 border border-gray-200 mb-10 mx-auto"
          ref={mapRef}
        >
          <p className="text-sm text-gray-500 mb-4 text-center">
            Click a state to explore parks.
          </p>

          <ComposableMap
            projection="geoAlbersUsa"
            width={1000}
            height={500}
            className="w-full h-auto"
          >
            <Geographies geography={geoUrl}>
              {({ geographies, projection: proj }) => {
                const pathGen = geoPath().projection(proj);
                if (!projection) setProjection(() => proj);
                return geographies.map((geo) => {
                  const isSelected = selectedGeo?.rsmKey === geo.rsmKey;
                  return (
                    <path
                      key={geo.rsmKey}
                      d={pathGen(geo)}
                      fill={isSelected ? "#219653" : "#b8e6c1"}
                      stroke="#fff"
                      onClick={() => handleStateClick(geo)}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    />
                  );
                });
              }}
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {/* Sidebar View */}
      <AnimatePresence>
        {selectedGeo && projection && (
          <motion.div
            key={selectedGeo.rsmKey + '-sidebar'}
            className="fixed top-5 right-5 w-[300px] bg-white shadow-lg rounded-xl p-4 z-50"
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-red-400 text-lg"
              onClick={() => {
                setSelectedGeo(null);
                setDescription('');
                setLoading(false);
              }}
            >
              ×
            </button>
            <svg viewBox="0 0 3000 2000" className="w-full h-32">
              <path
                d={geoPath().projection(projection)(selectedGeo)}
                fill="#2ecc71"
                stroke="#fff"
              />
            </svg>
            <h2 className="text-lg font-semibold text-[#2F3C7E] mt-4 text-center">
              {selectedGeo.properties.name}
            </h2>
            {loading ? (
              <div className="text-center text-gray-400 mt-2 text-sm">Loading...</div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mt-2 text-center whitespace-pre-line">
                  {description}
                </p>
                {getRandomImage(selectedGeo.properties.name) && (
                  <img
                    src={getRandomImage(selectedGeo.properties.name)}
                    alt={`${selectedGeo.properties.name} random park`}
                    className="mt-4 w-full h-32 object-cover rounded"
                  />
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {selectedGeo && projection && (
          <motion.div
            key={selectedGeo.rsmKey + '-left-sidebar'}
            className="fixed top-5 left-5 w-[500px] max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-xl px-6 pt-6 pb-8 z-50"
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {model.data[selectedGeo.properties.name.replace(/\s/g, '')]?.filter((item) => item.image?.length > 0).map((item, i) => (
              <div key={i} className="mb-4">
                <div className="font-semibold text-sm text-[#2F3C7E] mb-1">{item.park}</div>
                <div className="text-sm text-gray-600">
                  {item.description || 'No description'}
                </div>
                <div className="mt-2 w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image[0]}
                    alt={item.park}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )) || (
              <div className="text-sm text-gray-400 italic text-center">No data available</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>


    </Wrapper>
  );
}

export default MainPage;
