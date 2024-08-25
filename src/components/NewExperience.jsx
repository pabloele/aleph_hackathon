import { act, useState, useContext, useEffect } from "react";
import CreateIdenticon from "./CreateIdenticon";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/config/thirdwebClient";
import { defineChain, zkSyncSepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { createInstance } from "@/eth/contracts/AlephContract";
import { AppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
const NewExperience = ({}) => {
  const [redirect, setRedirect] = useState(null);

  const { uri, setTokenId, setName, name, CCID } = useContext(AppContext);

  useEffect(() => {
    if (redirect) {
      router.push(redirect);
    }
  }, [redirect]);

  const router = useRouter();

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

    try {
      // Ejecuta la función safeMint del contrato
      console.log(uri);
      const tx = await contract.safeMint(activeAccount?.address, uri, CCID);
      console.log("Transacción enviada:", tx.hash);

      // Espera a que la transacción sea minada
      const receipt = await tx.wait();

      if (receipt.blockNumber) {
        setRedirect("/mars");
      }

      // El tokenId es el valor del contador antes de la última incrementación
      const tokenId = await contract._tokenIdCounter();

      if (tokenId === 0) {
        setTokenId(0);
      } else {
        setTokenId(tokenId - 1);
      }
    } catch (error) {
      console.error("Error al mintear el NFT:", error);
    }
  };

  const activeAccount = useActiveAccount();
  const handleSumbit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={() => {}} style={{ height: "100vh" }}>
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
                <label htmlFor="email" className="text-xl">
                  Make a grafitti
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  name="answer5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
