import { ethers } from "ethers";
import Iot from "../artifacts/Iot.json";
const abi = Iot.abi;
const address = "0x2B2CdB657138cB3F5381D8C482e72B2657A1256B";

export function createInstanceIOT(provider) {
  return new ethers.Contract(address, abi, provider);
}
