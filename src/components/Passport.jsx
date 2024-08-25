import React, { useEffect, useContext, useState } from "react";
import Image from "next/image";
import { AppContext } from "@/contexts/AppContext";
import { useActiveAccount } from "thirdweb/react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { client } from "@/config/thirdwebClient";
import { createInstance } from "@/eth/contracts/AlephContract";
import { ConnectButton } from "thirdweb/react";
import { defineChain, zkSyncSepolia } from "thirdweb/chains";

const Passport = () => {
  const activeAccount = useActiveAccount();

  const { tokenId } = useContext(AppContext);


  const [nftData,setNftData] = useState(null)
  const fetchTokenData = async () => {
    const signer = await ethers5Adapter.signer.toEthers({
      client,
      chain: zkSyncSepolia,
      account: activeAccount,
    });

    const contract = createInstance(signer);
    const tokenData = await contract.getTokenData(tokenId);
    console.log(tokenData);
    setNftData(tokenData);
  };

  useEffect(() => {
    if (activeAccount?.address) {
        fetchTokenData();
    }
  }, [activeAccount?.address]);

  return (
    <div
      style={{
        height: "100vh",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: "url('/bg-mars.webp')",
      }}
    >
      <ConnectButton
        className={"w-full  "}
        client={client}
        chain={defineChain(zkSyncSepolia)}
      />
      <div
        className="relative mx-auto"
        style={{ width: "600px", height: "400px" }}
      >
        <Image src={"/passport.jpeg"} width={600} height={400} />



      {nftData && 
        <Image
          src={`https://trazabilidadideal.infura-ipfs.io/ipfs/${nftData[1]}`}
          width={200}
          height={300}
          style={{
            position: "absolute",
            top: "105px", // Ajusta según sea necesario
            left: "20px", // Ajusta según sea necesario
          }}
        />}
      </div>
    </div>
  );
};

export default Passport;
