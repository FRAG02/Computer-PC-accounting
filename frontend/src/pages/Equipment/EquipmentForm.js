import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { Box, Button, Grid2, MenuItem, TextField } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    createUpdEquipment,
    getDepartments,
    getEquipmentById,
} from '../../services/api'

const EquipmentForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formState, setFormState] = useState({})
    const [departments, setDepartments] = useState([])
    useEffect(() => {
        getDepartments(setDepartments)
    }, [])
    useEffect(() => {
        if (id) {
            getEquipmentById(setFormState, id)
        }
    }, [id])

    const onChangeHandle = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    const createUpdateHandle = () => {
        createUpdEquipment(id, formState).then(navigate(-1))
    }

    return (
        <>
            <Header
                heading={
                    id ? 'Редактировать Оборудование' : 'Добавить Оборудование'
                }
            />
            <Box p={3}>
                <Grid2>
                    <TextField
                        slotProps={{
                            inputLabel: {
                                shrink: !!formState.название_оборудования,
                            },
                        }}
                        value={formState.название_оборудования}
                        onChange={onChangeHandle}
                        name="название_оборудования"
                        label="название_оборудования"
                        placeholder="название_оборудования"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: {
                                shrink: !!formState.подразделение_id,
                            },
                        }}
                        value={formState.подразделение_id}
                        onChange={onChangeHandle}
                        name="подразделение_id"
                        label="подразделение_id"
                        placeholder="подразделение_id"
                        select
                    >
                        {departments.map((el) => {
                            return (
                                <MenuItem key={el.id} value={el.id}>
                                    {el.название_подразделения}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    <TextField
                        slotProps={{
                            inputLabel: {
                                shrink: !!formState.дата_производства,
                            },
                        }}
                        type="date"
                        value={formState.дата_производства}
                        onChange={onChangeHandle}
                        name="дата_производства"
                        label="дата_производства"
                        placeholder="дата_производства"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: {
                                shrink: !!formState.дата_поступления,
                            },
                        }}
                        type="date"
                        value={formState.дата_поступления}
                        onChange={onChangeHandle}
                        name="дата_поступления"
                        label="дата_поступления"
                        placeholder="дата_поступления"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: {
                                shrink: !!formState.дата_ввода_в_эксплуатацию,
                            },
                        }}
                        type="date"
                        value={formState.дата_ввода_в_эксплуатацию}
                        onChange={onChangeHandle}
                        name="дата_ввода_в_эксплуатацию"
                        label="дата_ввода_в_эксплуатацию"
                        placeholder="дата_ввода_в_эксплуатацию"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: {
                                shrink: !!formState.дата_вывода_из_эксплуатации,
                            },
                        }}
                        type="date"
                        value={formState.дата_вывода_из_эксплуатации}
                        onChange={onChangeHandle}
                        name="дата_вывода_из_эксплуатации"
                        label="дата_вывода_из_эксплуатации"
                        placeholder="дата_вывода_из_эксплуатации"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: { shrink: !!formState.стоимость },
                        }}
                        value={formState.стоимость}
                        onChange={onChangeHandle}
                        name="стоимость"
                        label="стоимость"
                        placeholder="стоимость"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: { shrink: !!formState.заводской_номер },
                        }}
                        value={formState.заводской_номер}
                        onChange={onChangeHandle}
                        name="заводской_номер"
                        label="заводской_номер"
                        placeholder="заводской_номер"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: {
                                shrink: !!formState.инвентарный_номер,
                            },
                        }}
                        value={formState.инвентарный_номер}
                        onChange={onChangeHandle}
                        name="инвентарный_номер"
                        label="инвентарный_номер"
                        placeholder="инвентарный_номер"
                    />
                    <TextField
                        slotProps={{
                            inputLabel: { shrink: !!formState.номер_кабинета },
                        }}
                        value={formState.номер_кабинета}
                        onChange={onChangeHandle}
                        name="номер_кабинета"
                        label="номер_кабинета"
                        placeholder="номер_кабинета"
                    />
                </Grid2>
                <Button as={Link} sx={{ textDecoration: 'unset' }} to={-1}>
                    Назад
                </Button>
                <Button onClick={createUpdateHandle}>
                    {id ? 'Обновить' : 'Добавить'}
                </Button>
            </Box>
        </>
    )
}

export default EquipmentForm
