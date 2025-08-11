import React, { useEffect, useState } from 'react'
import { getMOLs, removeMOLs } from '../../services/api'
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
} from '@mui/material'
import AlertDialog from '../../components/shared/AlertDialog'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/userContext'

const MOL = () => {
    const [mols, setMOLs] = useState([])
    const [selectedItem, setSelectedItem] = useState(undefined)

    const { user } = useUser()
    const isAdmin = user.role === 'Administrator'

    const handleCloseModal = () => setSelectedItem(undefined)
    const handleAgree = () => {
        removeMOLs(selectedItem).then(() => getMOLs(setMOLs))
    }
    const alertTitle = 'Вы точно хотите удалить отдел'
    const alertText = `МОЛ ${
        mols.find((el) => el.id === selectedItem)?.фио_мол
    } будет удален. Продолжить?`

    useEffect(() => {
        getMOLs(setMOLs)
    }, [])

    return (
        <>
            <Header heading="Материально ответственные лица" />
            <AlertDialog
                open={selectedItem}
                handleClose={handleCloseModal}
                title={alertTitle}
                text={alertText}
                agreeText="Да"
                agreeEvent={handleAgree}
                disagreeText="Нет"
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Должность</TableCell>
                            <TableCell>Отдел</TableCell>
                            {isAdmin && <TableCell>Действия</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mols.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>{row.фио_мол}</TableCell>
                                <TableCell>{row.должность}</TableCell>
                                <TableCell>
                                    {row.название_подразделения}
                                </TableCell>
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

export default MOL
