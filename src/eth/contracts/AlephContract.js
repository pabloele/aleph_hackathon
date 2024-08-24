import { ethers } from "ethers";
import AlephNFT from "../artifacts/AlephNFT.json";
const abi = AlephNFT.abi;
const address = "0xfA5529a17e917698569E532948EE6309154C4c09";

export function createInstance(provider) {
  return new ethers.Contract(address, abi, provider);
}
