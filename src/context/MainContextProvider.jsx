import { createContext, useState, useEffect } from 'react'

export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        // Recuperar del localStorage al cargar
        const saved = localStorage.getItem('darkMode');
        return saved !== null ? JSON.parse(saved) : false;
    });

    // Guardar en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <MainContext.Provider value={{
            user,
            setUser,
            darkMode,
            toggleDarkMode
        }}>
            {children}
        </MainContext.Provider>
    )
}