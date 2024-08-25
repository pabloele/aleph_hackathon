import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/config/thirdwebClient";
import { defineChain, zkSyncSepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import axios from "axios";
const Welcome = () => {
  const router = useRouter();
  const [invitation, setInvitation] = useState("");
  const [martianCitizen, setMartianCitizen] = useState(false);
  const activeAccount = useActiveAccount();

  const handleMars = async () => {
    router.push("/mars");
  };

  const handleWinery = () => {
    router.push("/winery");
  };

  return (
    <div className={`flex min-h-screen flex-col items-center p-24`}>
      <h1 className={`text-4xl mb-20`}>Welcome to openvino</h1>

      <ConnectButton client={client} chain={defineChain(zkSyncSepolia)} />

      <>
        <button onClick={handleWinery} style={{ marginTop: "50px" }}>
          I want to be a Winery
        </button>
        <button onClick={handleMars} style={{ marginTop: "20px" }}>
          I want to be a Martian
        </button>
      </>
    </div>
  );
};

export default Welcome;
