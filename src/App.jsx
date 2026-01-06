import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { useContext } from 'react'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import AppRoutes from './routes/AppRoutes'
import { MainContextProvider, MainContext } from './context/MainContextProvider'
import { createAppTheme } from './theme/theme'

// Componente interno que usa el contexto
function AppContent() {
  const { darkMode } = useContext(MainContext);
  const theme = createAppTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

function App() {
  return (
    <MainContextProvider>
      <AppContent />
    </MainContextProvider>
  )
}

export default App