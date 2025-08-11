import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { Box, Button, Grid2, TextField } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    createUpdServiceOrganization,
    getServiceOrganizationById,
} from '../../services/api'

const ServiceOrganizationForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formState, setFormState] = useState({
        название_организации: '',
        почтовый_индекс: '',
        город: '',
        улица: '',
        дом_корпус: '',
        телефоны: '',
        email: '',
        сайт: '',
        контактные_лица: JSON.stringify(),
    })

    useEffect(() => {
        if (id) {
            getServiceOrganizationById(setFormState, id)
        }
    }, [id])

    const onChangeHandle = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    const createUpdateHandle = async () => {
        try {
            // Подготовка данных для отправки
            const dataToSend = {
                ...formState,
                телефоны: formState.телефоны
                    .split(',')
                    .map((t) => t.trim())
                    .join(','),
            }

            const result = await createUpdServiceOrganization(id, dataToSend)

            if (result.success) {
                navigate(-1)
            } else {
                alert(
                    'Ошибка сохранения: ' +
                        (result.message || 'неизвестная ошибка')
                )
            }
        } catch (error) {
            console.error('Ошибка:', error)
            alert('Ошибка соединения с сервером')
        }
    }

    return (
        <>
            <Header
                heading={
                    id ? 'Редактировать организацию' : 'Добавить организацию'
                }
            />
            <Box p={3}>
                <Grid2>
                    {Object.keys(formState).map((field) => (
                        <TextField
                            key={field}
                            fullWidth
                            margin="normal"
                            slotProps={{
                                inputLabel: { shrink: !!formState[field] },
                            }}
                            value={formState[field]}
                            onChange={onChangeHandle}
                            name={field}
                            label={field.replace(/_/g, ' ')}
                            placeholder={`Введите ${field.replace(/_/g, ' ')}`}
                            multiline={field === 'контактные_лица'}
                            rows={field === 'контактные_лица' ? 4 : 1}
                        />
                    ))}
                </Grid2>
                <Button component={Link} to={-1} style={{ marginRight: 16 }}>
                    Назад
                </Button>
                <Button variant="contained" onClick={createUpdateHandle}>
                    {id ? 'Обновить' : 'Добавить'}
                </Button>
            </Box>
        </>
    )
}

export default ServiceOrganizationForm
