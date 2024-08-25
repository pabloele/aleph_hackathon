import { createContext, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [uri, setUri] = useState("");
  const [tokenId, setTokenId] = useState(null);
  const [name, setName] = useState("");
  const [CCID, setCCID] = useState("");
  const [identiconHash, setidenticonHash] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <AppContext.Provider
      value={{
        uri,
        setUri,
        tokenId,
        setTokenId,
        name,
        setName,
        identiconHash,
        setidenticonHash,
        CCID,
        setCCID
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
