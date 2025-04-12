// components/StateScenery.jsx
import React from "react";
import { motion } from "framer-motion";

const images = {
  California: "/images/yosemite.jpg",
  Arizona: "/images/grand-canyon.jpg",
  NewYork: "/images/adirondacks.jpg",
  // Add more states and image paths here
};

const StateScenery = ({ stateName, onBack }) => {
  const image = images[stateName] || "/images/default.jpg";

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">
        &larr; Back to map
      </button>
      <h2 className="text-3xl font-semibold mb-4 text-green-800">
        {stateName}'s Natural Beauty
      </h2>
      <img
        src={image}
        alt={`${stateName} scenery`}
        className="rounded-xl shadow-lg max-w-[90vw] max-h-[70vh] object-cover"
      />
    </motion.div>
  );
};

export default StateScenery;
