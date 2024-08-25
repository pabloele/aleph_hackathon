import { iot_abi } from "@/utils/abi";
import { Provider, utils, types, Wallet } from "zksync-ethers";

import { Contract, ethers } from "ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const PRIVATE_KEY = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const enabled = true;
const contractAddress = process.env.NEXT_PUBLIC_IOT_CONTRACT_ADDRESS;

console.log("zkSync Contract address:", contractAddress);

const contract = new Contract(contractAddress, iot_abi, wallet);

export default async function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ status: "ok", message: "Sensor Api UP" });
  }

  if (req.method === "POST") {
    const body = req.body;

    if (body && enabled) {
      let data = [];

      const jsonData = JSON.stringify({ date: Date.now(), body });
      try {
        console.log("Attempting to store data:", jsonData);
        console.log("Contract address:", contractAddress);
        console.log("Sender address:", wallet.address);

        const tx = await contract.storeData(jsonData);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Data stored on-chain:", jsonData);

        res.status(200).json({
          status: "ok",
          message: "Data stored on-chain",
          txHash: tx.hash,
          data: jsonData,
        });
      } catch (error) {
        console.error("Error storing data on-chain:", error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to store data on-chain" });
      }
    } else {
      res.status(400).json({ status: "error", message: "No body provided" });
    }
  }
}
