import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { AppContext } from "@/contexts/AppContext";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { client } from "@/config/thirdwebClient";
import { zkSyncSepolia, defineChain } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { createInstance } from "@/eth/contracts/AlephContract";
import { useRouter } from "next/navigation";
import Identicon from "identicon.js";
import { ConnectButton } from "thirdweb/react";

const generateColorFromHash = (hash, start) => {
  const r = parseInt(hash.substr(start, 2), 16);
  const g = parseInt(hash.substr(start + 2, 2), 16);
  const b = parseInt(hash.substr(start + 4, 2), 16);
  const a = 255; // opacidad completa
  return [r, g, b, a];
};

const generateIdenticonSvg = (hash) => {
  const foregroundColor = generateColorFromHash(hash, 0);
  const backgroundColor = generateColorFromHash(hash, 6);
  
  const options = {
    foreground: foregroundColor,
    background: backgroundColor,
    margin: 0.2,
    size: 64,  // Ajusta el tamaño según sea necesario
    format: "svg",
  };
  
  return new Identicon(hash, options).toString();
};

const MarsMaps = () => {
  const [marker, setMarker] = useState(null);
  const [nfts, setNfts] = useState([]);

  const mapWidth = 1792;
  const mapHeight = 1024;

  const activeAccount = useActiveAccount();
  const { identiconHash, setidenticonHash, tokenId } = useContext(AppContext);

  const router = useRouter();

  const fetchAllNFTs = async () => {
    const signer = await ethers5Adapter.signer.toEthers({
      client,
      chain: zkSyncSepolia,
      account: activeAccount,
    });

    const contract = createInstance(signer);
    const nfts = await contract.getAllNFTs();
    setNfts(nfts);
    return nfts;
  };

  const calculatePosition = (lat, lon) => {
    const x = ((lon + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  const convertBigNumber = (bigNumber) => {
    return parseInt(bigNumber._hex, 16);
  };

  useEffect(() => {
    if (activeAccount?.address) {
      fetchAllNFTs();
    }
  }, [activeAccount?.address]);

  const calculateCoordinates = (x, y) => {
    const lon = (x / mapWidth) * 360 - 180;
    const lat = 90 - (y / mapHeight) * 180;
    return { lat: lat.toFixed(2), lon: lon.toFixed(2) };
  };

  const handleMapClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;

    const newCoordinates = calculateCoordinates(x, y);

    setMarker({ x: relativeX, y: relativeY, coordinates: newCoordinates });
  };

  const handleButtonClick = async (e) => {
    e.stopPropagation();
    try {
      const signer = await ethers5Adapter.signer.toEthers({
        client,
        chain: zkSyncSepolia,
        account: activeAccount,
      });

      const contract = createInstance(signer);

      const lat = Math.round(Number(marker.coordinates.lat));
      const lon = Math.round(Number(marker.coordinates.lon));

      const txSetValues = await contract.setIdenticonValues(
        tokenId,
        identiconHash,
        lat,
        lon
      );

      const response = await txSetValues.wait();
      if (response) {
        router.push("/user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ConnectButton
        className={"w-full"}
        client={client}
        chain={defineChain(zkSyncSepolia)}
      />
      <div
        style={{ position: "relative", textAlign: "center", margin: "0 auto" }}
        onClick={handleMapClick}
      >
        <Image
          width={mapWidth}
          height={mapHeight}
          src="/mars_map.jpg"
          alt="Mars Map"
          style={{ maxWidth: "100%", height: "auto" }}
        />

        {nfts.map((nft, index) => {
          const tokenId = convertBigNumber(nft.tokenId);
          const lat = convertBigNumber(nft.lat);
          const lng = convertBigNumber(nft.lng);
          
          const position = calculatePosition(lat, lng);

          const identiconHash = nft.identiconHash && nft.identiconHash.length >= 15
            ? nft.identiconHash
            : 'default-hash-value';

          const identiconSvg = generateIdenticonSvg(identiconHash);

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: `${(position.y / mapHeight) * 100}%`,
                left: `${(position.x / mapWidth) * 100}%`,
                transform: "translate(-50%, -50%)",
                width: "64px",
                height: "64px",
                backgroundImage: `url(data:image/svg+xml;base64,${identiconSvg})`,
                backgroundSize: "cover",
                borderRadius: "50%",
              }}
            ></div>
          );
        })}

        {marker && (
          <>
            <div
              style={{
                position: "absolute",
                top: `${marker.y}%`,
                left: `${marker.x}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: "red",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
              }}
            ></div>
            <button
              onClick={handleButtonClick}
              style={{
                position: "absolute",
                top: `${marker.y + 5}%`,
                left: `${marker.x}%`,
                transform: "translate(-50%, 0)",
                padding: "8px 12px",
                fontSize: "20px",
                cursor: "pointer",
                backgroundColor: "white",
              }}
            >
              Guardar Posición
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default MarsMaps;
