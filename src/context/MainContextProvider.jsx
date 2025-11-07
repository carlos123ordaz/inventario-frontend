import { createContext, useState } from 'react'
export const MainContext = createContext()
export const MainContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return (
        <MainContext.Provider value={{ user, setUser }}>
            {children}
        </MainContext.Provider>
    )
}
