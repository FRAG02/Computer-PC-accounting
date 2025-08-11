import React, { useEffect, useState } from 'react'
import {
    getEquipmentStatuses,
    removeEquipmentStatus,
    getEquipmentById,
    getServiceOrganizations,
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
    Typography,
    Collapse,
    Chip,
} from '@mui/material'
import AlertDialog from '../../components/shared/AlertDialog'
import { Link } from 'react-router-dom'

const EquipmentStatus = () => {
    const [statuses, setStatuses] = useState([])
    const [selectedItem, setSelectedItem] = useState(undefined)
    const [filteredStatuses, setFilteredStatuses] = useState([])
    const [formState, setFormState] = useState({})
    const [expandedRows, setExpandedRows] = useState({})
    const [equipmentDetails, setEquipmentDetails] = useState({})
    const [serviceOrgs, setServiceOrgs] = useState([])

    const fieldLabels = {
        id: 'ID',
        equipment_id: 'ID оборудования',
        status_type: 'Тип статуса',
        status_date: 'Дата статуса',
        received_by: 'Получил',
        transferred_by: 'Передал',
        notes: 'Примечания',
        serial_number: 'Серийный номер',
        inventory_number: 'Инвентарный номер',
        commissioning_date: 'Дата ввода в эксплуатацию',
        название_оборудования: 'Название оборудования',
        заводской_номер: 'Заводской номер',
        инвентарный_номер: 'Инвентарный номер',
        дата_ввода_в_эксплуатацию: 'Дата ввода в эксплуатацию',
        название_организации: 'Название организации',
        телефоны: 'Телефоны',
        email: 'Email',
        сайт: 'Сайт',
        почтовый_индекс: 'Почтовый индекс',
        город: 'Город',
        улица: 'Улица',
        дом_корпус: 'Дом/корпус',
        контактные_лица: 'Контактные лица',
    }

    // Поля, которые нужно скрыть в фильтрации
    const hiddenFilters = [
        'created_at',
        'defect_act',
        'service_org_id',
        'service_org_name',
    ]

    useEffect(() => {
        getServiceOrganizations((orgs) => {
            setServiceOrgs(orgs)
            getEquipmentStatuses((data) => {
                setStatuses(data)
                data.forEach((status) => {
                    getEquipmentById((eqData) => {
                        setEquipmentDetails((prev) => ({
                            ...prev,
                            [status.id]: eqData,
                        }))
                    }, status.equipment_id)
                })
            })
        })
    }, [])

    useEffect(() => {
        if (Object.keys(formState).length === 0) {
            setFilteredStatuses([...statuses])
        } else {
            const filtered = statuses.filter((item) => {
                return Object.keys(formState).every((filter) => {
                    if (!item.hasOwnProperty(filter)) return false
                    const itemValue = String(item[filter]).toLowerCase()
                    const filterValue = String(formState[filter]).toLowerCase()
                    return itemValue.includes(filterValue)
                })
            })
            setFilteredStatuses(filtered)
        }
    }, [formState, statuses])

    const getServiceOrgDetails = (id) => {
        return serviceOrgs.find((org) => org.id === id) || null
    }

    const formatPhones = (phones) => {
        if (!phones) return []
        if (typeof phones === 'string') {
            return phones.split(',').map((phone) => phone.trim())
        }
        return phones
    }

    const parseContacts = (contacts) => {
        if (!contacts) return []
        try {
            if (typeof contacts === 'object') return contacts
            return JSON.parse(contacts)
        } catch (e) {
            return [{ должжность: 'Контактное лицо', фио: contacts }]
        }
    }

    const onChangeHandle = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    const handleCloseModal = () => setSelectedItem(undefined)
    const handleAgree = () => {
        removeEquipmentStatus(selectedItem).then(() => {
            getEquipmentStatuses((data) => {
                setStatuses(data)
                data.forEach((status) => {
                    if (!equipmentDetails[status.id]) {
                        getEquipmentById((eqData) => {
                            setEquipmentDetails((prev) => ({
                                ...prev,
                                [status.id]: eqData,
                            }))
                        }, status.equipment_id)
                    }
                })
            })
        })
    }

    const toggleRowExpand = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const alertTitle = 'Вы точно хотите удалить статус?'
    const alertText = `Статус оборудования ${
        statuses.find((el) => el.id === selectedItem)?.status_type
    } будет удален. Продолжить?`

    return (
        <>
            <Header heading="Статусы оборудования" />
            <AlertDialog
                open={selectedItem}
                handleClose={handleCloseModal}
                title={alertTitle}
                text={alertText}
                agreeText="Да"
                agreeEvent={handleAgree}
                disagreeText="Нет"
            />
            <Box sx={{ mb: 2 }}>
                {statuses[0] &&
                    Object.keys(statuses[0])
                        .filter((el) => !hiddenFilters.includes(el)) // Фильтруем скрытые поля
                        .map((el) => {
                            if (['id', 'equipment_id'].includes(el)) return null
                            return (
                                <TextField
                                    key={el}
                                    margin="normal"
                                    size="small"
                                    sx={{ mr: 1, mb: 1, minWidth: 120 }}
                                    value={formState[el] || ''}
                                    onChange={onChangeHandle}
                                    name={el}
                                    label={fieldLabels[el] || el}
                                    placeholder={fieldLabels[el] || el}
                                />
                            )
                        })}
            </Box>
            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 800 }}
                    aria-label="Таблица статусов оборудования"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell width="50px"></TableCell>
                            <TableCell>{fieldLabels.id}</TableCell>
                            <TableCell>
                                {fieldLabels.название_оборудования}
                            </TableCell>
                            <TableCell>{fieldLabels.status_type}</TableCell>
                            <TableCell>
                                {fieldLabels.название_организации}
                            </TableCell>
                            <TableCell>{fieldLabels.контактные_лица}</TableCell>
                            <TableCell>{fieldLabels.телефоны}</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStatuses.map((row) => {
                            const serviceOrg = getServiceOrgDetails(
                                row.service_org_id
                            )
                            const phones = serviceOrg
                                ? formatPhones(serviceOrg.телефоны)
                                : []
                            const contacts = serviceOrg
                                ? parseContacts(serviceOrg.контактные_лица)
                                : []

                            return (
                                <React.Fragment key={row.id}>
                                    <TableRow>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    toggleRowExpand(row.id)
                                                }
                                                sx={{ minWidth: 30 }}
                                            >
                                                {expandedRows[row.id]
                                                    ? '▲'
                                                    : '▼'}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            {equipmentDetails[row.id]
                                                ?.название_оборудования ||
                                                'Загрузка...'}
                                        </TableCell>
                                        <TableCell>{row.status_type}</TableCell>
                                        <TableCell>
                                            {serviceOrg
                                                ? serviceOrg.название_организации
                                                : row.service_org_id
                                                ? `ID: ${row.service_org_id}`
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {contacts.length > 0
                                                ? contacts.map((contact, i) => (
                                                      <div key={i}>
                                                          {contact.должность}:{' '}
                                                          {contact.фио}
                                                      </div>
                                                  ))
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {phones.length > 0
                                                ? phones.map((phone, i) => (
                                                      <Chip
                                                          key={i}
                                                          label={phone}
                                                          size="small"
                                                          sx={{ m: 0.5 }}
                                                      />
                                                  ))
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    setSelectedItem(row.id)
                                                }
                                                color="error"
                                                size="small"
                                            >
                                                Удалить
                                            </Button>
                                            <Button
                                                component={Link}
                                                to={`/equipment-status/edit/${row.id}`}
                                                color="primary"
                                                size="small"
                                                sx={{ ml: 1 }}
                                            >
                                                Редактировать
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            style={{
                                                paddingBottom: 0,
                                                paddingTop: 0,
                                            }}
                                        >
                                            <Collapse
                                                in={expandedRows[row.id]}
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography
                                                        variant="h6"
                                                        gutterBottom
                                                    >
                                                        Подробная информация
                                                    </Typography>
                                                    <Table size="small">
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell width="200px">
                                                                    <strong>
                                                                        {
                                                                            fieldLabels.название_оборудования
                                                                        }
                                                                        :
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {equipmentDetails[
                                                                        row.id
                                                                    ]
                                                                        ?.название_оборудования ||
                                                                        'не указано'}
                                                                </TableCell>
                                                                <TableCell width="200px">
                                                                    <strong>
                                                                        {
                                                                            fieldLabels.заводской_номер
                                                                        }
                                                                        :
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {equipmentDetails[
                                                                        row.id
                                                                    ]
                                                                        ?.заводской_номер ||
                                                                        'не указан'}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <strong>
                                                                        {
                                                                            fieldLabels.инвентарный_номер
                                                                        }
                                                                        :
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {equipmentDetails[
                                                                        row.id
                                                                    ]
                                                                        ?.инвентарный_номер ||
                                                                        'не указан'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <strong>
                                                                        {
                                                                            fieldLabels.дата_ввода_в_эксплуатацию
                                                                        }
                                                                        :
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {equipmentDetails[
                                                                        row.id
                                                                    ]
                                                                        ?.дата_ввода_в_эксплуатацию ||
                                                                        'не указана'}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <strong>
                                                                        {
                                                                            fieldLabels.serial_number
                                                                        }
                                                                        :
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {equipmentDetails[
                                                                        row.id
                                                                    ]
                                                                        ?.serial_number ||
                                                                        'не указан'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <strong>
                                                                        Дата
                                                                        создания:
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {row.created_at ||
                                                                        'не указана'}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <strong>
                                                                        {
                                                                            fieldLabels.status_type
                                                                        }
                                                                        :
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell
                                                                    colSpan={3}
                                                                >
                                                                    <strong>
                                                                        {
                                                                            row.status_type
                                                                        }
                                                                    </strong>{' '}
                                                                    (
                                                                    {
                                                                        row.status_date
                                                                    }
                                                                    )
                                                                </TableCell>
                                                            </TableRow>
                                                            {row.notes && (
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <strong>
                                                                            {
                                                                                fieldLabels.notes
                                                                            }
                                                                            :
                                                                        </strong>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        colSpan={
                                                                            3
                                                                        }
                                                                    >
                                                                        {
                                                                            row.notes
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                            {row.defect_act && (
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <strong>
                                                                            Дефектный
                                                                            акт:
                                                                        </strong>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        colSpan={
                                                                            3
                                                                        }
                                                                    >
                                                                        {
                                                                            row.defect_act
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                            {serviceOrg && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <strong>
                                                                                {
                                                                                    fieldLabels.название_организации
                                                                                }

                                                                                :
                                                                            </strong>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            colSpan={
                                                                                3
                                                                            }
                                                                        >
                                                                            {
                                                                                serviceOrg.название_организации
                                                                            }
                                                                            {serviceOrg.email &&
                                                                                ` | Email: ${serviceOrg.email}`}
                                                                            {serviceOrg.сайт &&
                                                                                ` | Сайт: ${serviceOrg.сайт}`}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <strong>
                                                                                Адрес:
                                                                            </strong>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            colSpan={
                                                                                3
                                                                            }
                                                                        >
                                                                            {[
                                                                                serviceOrg.почтовый_индекс,
                                                                                serviceOrg.город,
                                                                                serviceOrg.улица,
                                                                                serviceOrg.дом_корпус,
                                                                            ]
                                                                                .filter(
                                                                                    Boolean
                                                                                )
                                                                                .join(
                                                                                    ', '
                                                                                )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {contacts.length >
                                                                        0 && (
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                <strong>
                                                                                    {
                                                                                        fieldLabels.контактные_лица
                                                                                    }

                                                                                    :
                                                                                </strong>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                colSpan={
                                                                                    3
                                                                                }
                                                                            >
                                                                                {contacts.map(
                                                                                    (
                                                                                        contact,
                                                                                        i
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                i
                                                                                            }
                                                                                        >
                                                                                            <strong>
                                                                                                {
                                                                                                    contact.должность
                                                                                                }

                                                                                                :
                                                                                            </strong>{' '}
                                                                                            {
                                                                                                contact.фио
                                                                                            }
                                                                                            {contact.телефоны &&
                                                                                                ` | Тел: ${contact.телефоны}`}
                                                                                            {contact.email &&
                                                                                                ` | Email: ${contact.email}`}
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                </>
                                                            )}
                                                            {row.received_by && (
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <strong>
                                                                            {
                                                                                fieldLabels.received_by
                                                                            }
                                                                            :
                                                                        </strong>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        colSpan={
                                                                            3
                                                                        }
                                                                    >
                                                                        {
                                                                            row.received_by
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                            {row.transferred_by && (
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <strong>
                                                                            {
                                                                                fieldLabels.transferred_by
                                                                            }
                                                                            :
                                                                        </strong>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        colSpan={
                                                                            3
                                                                        }
                                                                    >
                                                                        {
                                                                            row.transferred_by
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default EquipmentStatus
