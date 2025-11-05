import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { ThemeProvider } from '@emotion/react'
import { createTheme, CssBaseline } from '@mui/material'
import AppRoutes from './routes/AppRoutes'
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <AppRoutes />
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
