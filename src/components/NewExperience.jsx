import { act, useState, useContext } from "react";
import CreateIdenticon from "./CreateIdenticon";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/config/thirdwebClient";
import { defineChain, zkSyncSepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { createInstance } from "@/eth/contracts/AlephContract";
import { AppContext } from "@/contexts/AppContext";
const NewExperience = ({}) => {

  const {uri} = useContext(AppContext)


  const mintNFT = async (e) => {
    e.preventDefault();
  
    // Configura el proveedor con el adaptador de ethers.js
    const provider = ethers5Adapter.provider.toEthers({
      client,
      chain: zkSyncSepolia,
    });
  
    // Configura el signer para firmar la transacción
    const signer = await ethers5Adapter.signer.toEthers({
      client,
      chain: zkSyncSepolia,
      account: activeAccount,
    });
  
    // Crea la instancia del contrato con el signer
    const contract = createInstance(signer);
  
    console.log("Contrato:", contract);
  
    try {
      // Ejecuta la función safeMint del contrato
      console.log(uri);
      
      const tx = await contract.safeMint(activeAccount?.address, uri);
      console.log("Transacción enviada:", tx.hash);
  
      // Espera a que la transacción sea minada
      const receipt = await tx.wait();
      console.log("Transacción confirmada:", receipt);
  
    } catch (error) {
      console.error("Error al mintear el NFT:", error);
    }
  };

  const activeAccount = useActiveAccount();
  const handleSumbit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={() => {}}>
      {activeAccount?.address && (
        <div className="form-group center text-right pr-10 pt-2 ">
          <ConnectButton
            className={"w-full  "}
            client={client}
            chain={defineChain(zkSyncSepolia)}
          />
        </div>
      )}
      <div className="col-md-12">
        <div className="card card-container login-form">
          <h1 className="center mb-4">Welcome to mars</h1>
          {!activeAccount?.address ? (
            <>
              <div className="form-group center ">
                <ConnectButton
                  className={"w-full "}
                  client={client}
                  chain={defineChain(zkSyncSepolia)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="cameraButton">
                  <i className="fas fa-camera-retro"></i> Take a selfie
                  <CreateIdenticon />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Are you drinking this wine with food? What are you eating
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  name="answer3"
                  style={{ resize: "none" }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  Do you like this wine? How would you rank it?
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  name="answer4"
                  style={{ resize: "none" }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  Do you think we should build a colony on Mars?
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  name="answer5"
                  style={{ resize: "none" }}
                />
              </div>

              <div className="form-group">
                <button
             
                  className="btn btn-lg btn-primary btn-block"
                  onClick={mintNFT}
                >
                  Get your passport
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default NewExperience;
