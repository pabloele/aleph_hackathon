import { createContext, useState } from "react";

export const AppContext = createContext();


export const AppProvider = ({children}) => {
    const [uri, setUri] = useState('')

    return (
        <AppContext.Provider value={{
            uri, setUri
        }}>
            {children}
        </AppContext.Provider>
    )

}