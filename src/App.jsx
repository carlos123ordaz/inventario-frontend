import './App.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import AppRoutes from './routes/AppRoutes'
import { MainContextProvider } from './context/MainContextProvider'
import { theme } from './theme/theme'

function App() {
  return (
    <MainContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </MainContextProvider>
  )
}

export default App