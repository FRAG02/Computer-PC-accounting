import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import {
    Box,
    Button,
    Grid2,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    createUpdEquipmentStatus,
    getEquipmentStatusById,
    getEquipment,
    getServiceOrganizations,
    getEquipmentById,
} from '../../services/api'

const EquipmentStatusForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formState, setFormState] = useState({
        equipment_id: '',
        status_type: '',
        status_date: new Date().toISOString().split('T')[0],
        notes: '',
        service_org_id: '',
        received_by: '',
        transferred_by: '',
        defect_act: '',
        serial_number: '',
        inventory_number: '',
        commissioning_date: '',
    })
    const [equipmentList, setEquipmentList] = useState([])
    const [serviceOrgs, setServiceOrgs] = useState([])
    const [selectedEquipment, setSelectedEquipment] = useState(null)

    useEffect(() => {
        getEquipment(setEquipmentList)
        getServiceOrganizations(setServiceOrgs)
        if (id) {
            getEquipmentStatusById((data) => {
                setFormState(data)
                if (data.equipment_id) {
                    getEquipmentById((eqData) => {
                        setSelectedEquipment(eqData)
                    }, data.equipment_id)
                }
            }, id)
        }
    }, [id])

    const onChangeHandle = (e) => {
        const { name, value } = e.target
        setFormState((prev) => ({ ...prev, [name]: value }))
    }

    const handleEquipmentChange = (equipmentId) => {
        if (equipmentId) {
            getEquipmentById((data) => {
                setSelectedEquipment(data)
                setFormState((prev) => ({
                    ...prev,
                    equipment_id: equipmentId,
                    serial_number: data.заводской_номер,
                    inventory_number: data.инвентарный_номер,
                    commissioning_date: data.дата_ввода_в_эксплуатацию,
                }))
            }, equipmentId)
        } else {
            setSelectedEquipment(null)
            setFormState((prev) => ({
                ...prev,
                equipment_id: '',
                serial_number: '',
                inventory_number: '',
                commissioning_date: '',
            }))
        }
    }

    const createUpdateHandle = async () => {
        // Валидация обязательных полей
        if (
            !formState.equipment_id ||
            !formState.status_type ||
            !formState.status_date
        ) {
            alert(
                'Заполните обязательные поля: оборудование, тип статуса и дата статуса'
            )
            return
        }

        // Для статусов, связанных с ремонтом, проверяем сервисную организацию
        if (
            ['передано в ремонт', 'возвращено из ремонта'].includes(
                formState.status_type
            )
        ) {
            if (!formState.service_org_id) {
                alert(
                    'Для выбранного статуса необходимо указать сервисную организацию'
                )
                return
            }
        }

        try {
            // Подготовка данных для отправки
            const dataToSend = {
                ...formState,
                service_org_id: formState.service_org_id || null, // Преобразуем пустую строку в null
            }

            const result = await createUpdEquipmentStatus(id, dataToSend)

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

    const statusTypes = [
        'поступило',
        'введено в эксплуатацию',
        'исправно (эксплуатируется)',
        'исправно (не эксплуатируется)',
        'не исправно',
        'передано в ремонт',
        'возвращено из ремонта',
        'списано',
    ]

    return (
        <>
            <Header heading={id ? 'Редактировать статус' : 'Добавить статус'} />
            <Box p={3}>
                <Grid2>
                    {/* Выбор оборудования */}
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        value={formState.equipment_id}
                        onChange={(e) => handleEquipmentChange(e.target.value)}
                        name="equipment_id"
                        label="Оборудование *"
                    >
                        <MenuItem value="">Выберите оборудование</MenuItem>
                        {equipmentList.map((eq) => (
                            <MenuItem key={eq.id} value={eq.id}>
                                {eq.название_оборудования} (ID: {eq.id})
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Информация об оборудовании */}
                    {selectedEquipment && (
                        <>
                            <Typography variant="body1">
                                Заводской номер:{' '}
                                {selectedEquipment.заводской_номер}
                            </Typography>
                            <Typography variant="body1">
                                Инвентарный номер:{' '}
                                {selectedEquipment.инвентарный_номер}
                            </Typography>
                            <Typography variant="body1">
                                Дата ввода в эксплуатацию:{' '}
                                {selectedEquipment.дата_ввода_в_эксплуатацию}
                            </Typography>
                        </>
                    )}

                    {/* Тип статуса */}
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        value={formState.status_type}
                        onChange={onChangeHandle}
                        name="status_type"
                        label="Тип статуса *"
                    >
                        <MenuItem value="">Выберите тип статуса</MenuItem>
                        {statusTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Дата статуса */}
                    <TextField
                        fullWidth
                        margin="normal"
                        type="date"
                        value={formState.status_date}
                        onChange={onChangeHandle}
                        name="status_date"
                        label="Дата статуса *"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    {/* Примечания */}
                    <TextField
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={formState.notes}
                        onChange={onChangeHandle}
                        name="notes"
                        label="Примечания"
                    />

                    {/* Поля для статусов, связанных с ремонтом */}
                    {['передано в ремонт', 'возвращено из ремонта'].includes(
                        formState.status_type
                    ) && (
                        <>
                            <TextField
                                select
                                fullWidth
                                margin="normal"
                                value={formState.service_org_id}
                                onChange={onChangeHandle}
                                name="service_org_id"
                                label="Сервисная организация *"
                            >
                                <MenuItem value="">
                                    Выберите организацию
                                </MenuItem>
                                {serviceOrgs.map((org) => (
                                    <MenuItem key={org.id} value={org.id}>
                                        {org.название_организации}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                margin="normal"
                                value={formState.received_by}
                                onChange={onChangeHandle}
                                name="received_by"
                                label="Кто получил/передал"
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                value={formState.transferred_by}
                                onChange={onChangeHandle}
                                name="transferred_by"
                                label="Через кого передано"
                            />
                        </>
                    )}

                    {/* Поле для списания */}
                    {formState.status_type === 'списано' && (
                        <TextField
                            fullWidth
                            margin="normal"
                            value={formState.defect_act}
                            onChange={onChangeHandle}
                            name="defect_act"
                            label="Номер дефектного акта"
                        />
                    )}
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

export default EquipmentStatusForm
