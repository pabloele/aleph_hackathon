import { ethers } from "ethers";
import AlephNFT from "../artifacts/AlephNFT.json";
const abi = AlephNFT.abi;
const address = "0xE2055dC2773195D7Ac62d59C5695d51E16c4f347";

export function createInstance(provider) {
  return new ethers.Contract(address, abi, provider);
}
