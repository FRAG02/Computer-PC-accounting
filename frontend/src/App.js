import React, { useState } from 'react'
import Login from './pages/Login'
import Main from './Router'
import Register from './pages/Register'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import './styles/index.css'
import { useUser } from './context/userContext'

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
})

const App = () => {
    const [showRegister, setShowRegister] = useState(false)
    const { user, setUser } = useUser()
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <div>
                {!user ? (
                    showRegister ? (
                        <Register
                            onSwitchToLogin={() => setShowRegister(false)}
                        />
                    ) : (
                        <Login
                            onLogin={setUser}
                            onSwitchToRegister={() => setShowRegister(true)}
                        />
                    )
                ) : (
                    <Main />
                )}
            </div>
        </ThemeProvider>
    )
}

export default App
