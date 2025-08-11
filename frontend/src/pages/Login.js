import React, { useState } from 'react'
import { login } from '../services/api'
import { Stack, TextField, Box, Button } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Login data:', { username, password }) // Логируем данные
        try {
            const response = await login(username, password)
            console.log('Login response:', response) // Логируем ответ
            if (response.success) {
                onLogin(response.user)
                toast.success('✅ Успешный вход!')
            } else {
                // Проверяем сообщение об ошибке
                if (response.message === 'Неверный логин') {
                    toast.error(
                        ' Неверный логин. Пожалуйста, проверьте введенные данные.'
                    )
                } else if (response.message === 'Неверный пароль') {
                    toast.error(
                        ' Неверный пароль. Пожалуйста, проверьте введенные данные.'
                    )
                } else {
                    toast.error(response.message || 'Ошибка авторизации')
                }
            }
        } catch (error) {
            console.error('Login error:', error) // Логируем ошибку
            toast.error(' Ошибка при выполнении запроса. Попробуйте снова.')
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
            />
            <Stack height="100vh" justifyContent="center" alignItems="center">
                <Stack
                    spacing="10px"
                    padding="40px"
                    borderRadius="8px"
                    boxShadow="0px 1px 10px 5px rgba(34, 60, 80, 0.2)"
                >
                    <Stack spacing="10px">
                        <TextField
                            style={{ width: '400px' }}
                            type="text"
                            placeholder="Логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            style={{ width: '400px' }}
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Stack>
                    <Box display="flex" justifyContent="center">
                        <Button
                            style={{ width: '200px' }}
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Войти
                        </Button>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}

export default Login
