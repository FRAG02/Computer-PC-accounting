import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../services/api'
import { useUser } from '../../context/userContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserForm = () => {
    const navigate = useNavigate()
    const { user } = useUser()

    const [formState, setFormState] = useState({
        username: '',
        password: '',
        role: 'User',
    })

    const onChangeHandle = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    const createUserHandle = () => {
        if (user?.role !== 'Administrator') {
            toast.error(
                '⛔ Доступ запрещен! Только администратор может создавать пользователей.'
            )
            return
        }

        createUser(formState)
            .then((response) => {
                if (response.success) {
                    toast.success(`✅ ${response.message}`)
                    setTimeout(() => navigate(-1), 1500) // Плавный редирект
                } else {
                    toast.error(`⚠️ ${response.message}`)
                }
            })
            .catch(() => {
                toast.error(
                    '❌ Произошла ошибка при регистрации. Попробуйте снова.'
                )
            })
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
            />
            <Box p={3}>
                <TextField
                    fullWidth
                    label="Логин"
                    name="username"
                    value={formState.username}
                    onChange={onChangeHandle}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Пароль"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={onChangeHandle}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Роль"
                    name="role"
                    select
                    SelectProps={{ native: true }}
                    value={formState.role}
                    onChange={onChangeHandle}
                    margin="normal"
                >
                    <option value="User">User</option>
                    <option value="Administrator">Administrator</option>
                </TextField>

                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={createUserHandle}
                    >
                        Зарегистрировать
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(-1)}
                        style={{ marginLeft: '10px' }}
                    >
                        Назад
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default UserForm
