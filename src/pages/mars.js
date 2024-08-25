import MarsMaps from "@/components/MarsMaps";
import React from "react";

const Mars = () => {
  return (
    <div
      style={{
        height: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: "url('/bg-mars.webp')",
      }}
    >
      <h2 className="center py-10 text-white">
        Select your location for you colony
      </h2>
      <MarsMaps />
    </div>
  );
};

export default Mars;
