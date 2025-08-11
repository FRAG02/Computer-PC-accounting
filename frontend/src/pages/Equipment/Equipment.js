import React, { useEffect, useState } from 'react'
import { getEquipment, removeEquipment } from '../../services/api'
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
    Box,
    TextField,
} from '@mui/material'
import AlertDialog from '../../components/shared/AlertDialog'
import { Link } from 'react-router-dom'

const Equipment = () => {
    const [equipment, setEquipment] = useState([])
    const [selectedItem, setSelectedItem] = useState(undefined)
    const [filteredEquipment, setFilteredEquipment] = useState(equipment)
    const [formState, setFormState] = useState({})

    useEffect(() => {
        // Если фильтры не заданы, возвращаем всё оборудование
        if (Object.keys(formState).length === 0) {
            setFilteredEquipment([...equipment])
            return
        }

        // Фильтрация оборудования
        const filtered = equipment.filter((item) => {
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
        setFilteredEquipment(filtered)
    }, [formState, equipment])

    const onChangeHandle = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    const handleCloseModal = () => setSelectedItem(undefined)
      const handleAgree = () => {
          removeEquipment(selectedItem).then(() =>
              getEquipment(setEquipment)
          )
      }
      const alertTitle = 'Вы точно хотите удалить отдел'
      const alertText = `Оборудование ${
          equipment.find((el) => el.id === selectedItem)?.название_оборудования
      } будет удален. Продолжить?`

    useEffect(() => {
        getEquipment(setEquipment)
    }, [])

    return (
        <>
            <Header heading="Оборудование" />
            <AlertDialog
                open={selectedItem}
                handleClose={handleCloseModal}
                title={alertTitle}
                text={alertText}
                agreeText="Да"
                agreeEvent={handleAgree}
                disagreeText="Нет"
            />
            <Box>
                {equipment?.length &&
                    Object.keys(equipment[0]).map((el) => {
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
                            <TableCell>Оборудование</TableCell>
                            <TableCell>подразделение</TableCell>
                            <TableCell>Дата Производства</TableCell>
                            <TableCell>Дата поступления</TableCell>
                            <TableCell>Дата ввода в эксплуатацию</TableCell>
                            <TableCell>Дата вывода из эксплуатации</TableCell>
                            <TableCell>Стоимость</TableCell>
                            <TableCell>Заводской номер</TableCell>
                            <TableCell>Инвентарный номер</TableCell>
                            <TableCell>номер кабинета</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEquipment.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>
                                    {row.название_оборудования}
                                </TableCell>
                                <TableCell>
                                    {row.название_подразделения}
                                </TableCell>
                                <TableCell>{row.дата_производства}</TableCell>
                                <TableCell>{row.дата_поступления}</TableCell>
                                <TableCell>
                                    {row.дата_ввода_в_эксплуатацию}
                                </TableCell>
                                <TableCell>
                                    {row.дата_вывода_из_эксплуатации}
                                </TableCell>
                                <TableCell>{row.стоимость}</TableCell>
                                <TableCell>{row.заводской_номер}</TableCell>
                                <TableCell>{row.инвентарный_номер}</TableCell>
                                <TableCell>{row.номер_кабинета}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => setSelectedItem(row.id)}
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Equipment
