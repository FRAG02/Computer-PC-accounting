import React, { useEffect, useState } from 'react'
import {
    getServiceOrganizations,
    removeServiceOrganization,
} from '../../services/api'
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

const ServiceOrganization = () => {
    const [organizations, setOrganizations] = useState([])
    const [selectedItem, setSelectedItem] = useState(undefined)
    const [filteredOrganizations, setFilteredOrganizations] =
        useState(organizations)
    const [formState, setFormState] = useState({})

    useEffect(() => {
        if (Object.keys(formState).length === 0) {
            setFilteredOrganizations([...organizations])
            return
        }

        const filtered = organizations.filter((item) => {
            return Object.keys(formState).every((filter) => {
                if (!item.hasOwnProperty(filter)) return false
                const itemValue = String(item[filter]).toLowerCase()
                const filterValue = String(formState[filter]).toLowerCase()
                return itemValue.includes(filterValue)
            })
        })

        setFilteredOrganizations(filtered)
    }, [formState, organizations])

    const onChangeHandle = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    const handleCloseModal = () => setSelectedItem(undefined)
    const handleAgree = () => {
        removeServiceOrganization(selectedItem).then(() =>
            getServiceOrganizations(setOrganizations)
        )
    }
    const alertTitle = 'Вы точно хотите удалить сервисную организацию'
    const alertText = `Организация ${
        organizations.find((el) => el.id === selectedItem)?.название_организации
    } будет удалена. Продолжить?`

    useEffect(() => {
        getServiceOrganizations(setOrganizations)
    }, [])

    return (
        <>
            <Header heading="Сервисные организации" />
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
                {organizations?.length &&
                    Object.keys(organizations[0]).map((el) => {
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
                            />
                        )
                    })}
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>название_организации</TableCell>
                            <TableCell>почтовый_индекс</TableCell>
                            <TableCell>город</TableCell>
                            <TableCell>улица</TableCell>
                            <TableCell>дом_корпус</TableCell>
                            <TableCell>телефоны</TableCell>
                            <TableCell>email</TableCell>
                            <TableCell>сайт</TableCell>
                            <TableCell>контактные_лица</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrganizations.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>
                                    {row.название_организации}
                                </TableCell>
                                <TableCell>{row.почтовый_индекс}</TableCell>
                                <TableCell>{row.город}</TableCell>
                                <TableCell>{row.улица}</TableCell>
                                <TableCell>{row.дом_корпус}</TableCell>
                                <TableCell>{row.телефоны}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.сайт}</TableCell>
                                <TableCell>{row.контактные_лица}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => setSelectedItem(row.id)}
                                    >
                                        Удалить
                                    </Button>
                                    <Button
                                        component={Link}
                                        to={`/serviceOrganization/edit/${row.id}`}
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 1 }}
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

export default ServiceOrganization
