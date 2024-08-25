import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { zkSyncSepolia, defineChain } from "thirdweb/chains";
import { client } from "@/config/thirdwebClient";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { ConnectButton } from "thirdweb/react";
import { createInstanceIOT } from "@/eth/contracts/IotContract";
import { useActiveAccount } from "thirdweb/react";

const DisplayData = () => {
  const [latestData, setLatestData] = useState(null);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    if (activeAccount?.address) {
      fetchData();
    }
  }, [activeAccount?.address]);

  const fetchData = async () => {
    const provider = ethers5Adapter.provider.toEthers({
      client,
      chain: zkSyncSepolia,
    });

    const signer = await ethers5Adapter.signer.toEthers({
      client,
      chain: zkSyncSepolia,
      account: activeAccount,
    });

    const contract = createInstanceIOT(signer);

    contract.on("DataStored", (id, timestamp, data, updater) => {
      console.log(`Nuevo dato almacenado: ${data}`);
      setLatestData({ id, timestamp, data, updater });
    });
  };

  return (
    <div className="container mx-auto p-4 d-flex bg-black min-h-screen">
      <ConnectButton client={client} chain={defineChain(zkSyncSepolia)} />

      <h1 className="text-2xl font-bold mb-4 text-green-500">Latest IoT Data</h1>
      {latestData ? (
        <div className="text-green-500">
          <p><strong>ID:</strong> {latestData.id.toString()}</p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(latestData.timestamp.toNumber() * 1000).toLocaleString()}
          </p>
          <p><strong>Data:</strong> {latestData.data}</p>
          <p><strong>Updater:</strong> {latestData.updater}</p>
        </div>
      ) : (
        <p className="text-green-500">No data available.</p>
      )}
    </div>
  );
};

export default DisplayData;
