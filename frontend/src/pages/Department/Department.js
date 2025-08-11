import React, { useEffect, useState } from 'react'
import { getDepartments, removeDepartments } from '../../services/api'
import Header from '../../components/shared/Header'
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    TextField,
    Box,
} from '@mui/material'
import AlertDialog from '../../components/shared/AlertDialog'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/userContext'

const Department = () => {
    const [departments, setDepartments] = useState([])
    const [selectedItem, setSelectedItem] = useState(undefined)
    const [filteredDepartments, setFilteredDepartments] = useState(departments)
    const [formState, setFormState] = useState({})

    useEffect(() => {
        // Если фильтры не заданы, возвращаем всё оборудование
        if (Object.keys(formState).length === 0) {
            setFilteredDepartments([...departments])
            return
        }

        // Фильтрация оборудования
        const filtered = departments.filter((item) => {
            return Object.keys(formState).every((filter) => {
                // Проверяем, что поле существует в объекте item
                if (!item.hasOwnProperty(filter)) return false

                // Приводим значения к строке для безопасного сравнения
                const itemValue = String(item[filter]).toLowerCase()
                const filterValue = String(formState[filter]).toLowerCase()

                // Проверяем, содержит ли значение поля значение из фильтра
                return itemValue.includes(filterValue)
            })
        })

        // Обновляем состояние отфильтрованного оборудования
        setFilteredDepartments(filtered)
    }, [formState, departments])

    const onChangeHandle = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    const { user } = useUser()
    const isAdmin = user.role === 'Administrator'

    const handleCloseModal = () => setSelectedItem(undefined)
    const handleAgree = () => {
        removeDepartments(selectedItem).then(() =>
            getDepartments(setDepartments)
        )
    }
    const alertTitle = 'Вы точно хотите удалить отдел'
    const alertText = `Отдел ${
        departments.find((el) => el.id === selectedItem)?.название_подразделения
    } будет удален. Продолжить?`

    useEffect(() => {
        getDepartments(setDepartments)
    }, [])

    return (
        <>
            <Header heading="Подразделения" />
            <AlertDialog
                open={selectedItem}
               // handleClose={handleCloseModal}
                title={alertTitle}
                text={alertText}
                agreeText="Да"
                agreeEvent={handleAgree}
                disagreeText="Нет"
            />
            <Box>
                {departments?.length &&
                    Object.keys(departments[0]).map((el) => {
                        return (
                            <TextField
                                slotProps={{
                                    inputLabel: {
                                        shrink: !!formState[el],
                                    },
                                }}
                                key={el}
                                value={formState[el]}
                                onChange={onChangeHandle}
                                name={el}
                                label={el}
                                placeholder={el}
                                type={el.includes('дата') ? 'date' : 'text'}
                            />
                        )
                    })}
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Отдел</TableCell>
                            <TableCell>МОЛ</TableCell>
                            <TableCell>Блок</TableCell>
                            <TableCell>Корпус</TableCell>
                            <TableCell>Этаж</TableCell>
                            <TableCell>Номер Кабинета</TableCell>
                            <TableCell>Название Кабинета</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDepartments.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>
                                    {row.название_подразделения}
                                </TableCell>
                                <TableCell>{row.фио_мол}</TableCell>
                                <TableCell>{row.блок}</TableCell>
                                <TableCell>{row.корпус}</TableCell>
                                <TableCell>{row.этаж}</TableCell>
                                <TableCell>{row.номер_кабинета}</TableCell>
                                <TableCell>{row.название_кабинета}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Button
                                            onClick={() =>
                                                setSelectedItem(row.id)
                                            }
                                        >
                                            Удалить
                                        </Button>
                                        <Button
                                            as={Link}
                                            sx={{ textDecoration: 'unset' }}
                                            to={`./edit/${row.id}`}
                                        >
                                            Редактировать
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Department
