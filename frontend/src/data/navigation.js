const navigation = [
    {
        placeholder: 'МОЛ',
        url: '/mol',
        component: 'MOL',
    },
    {
        placeholder: 'Подразделения',
        url: '/department',
        component: 'Department',
    },
    {
        placeholder: 'Оборудование',
        url: '/equipment',
        component: 'Equipment',
    },
    {
        placeholder: 'Сервисные организации',
        url: '/serviceserviceOrganization',
        component: 'ServiceOrganization',
    },
    {
        placeholder: 'Статус оборудования',
        url: '/equipmentSatus',
        component: 'EquipmentStatus',
    },

    {
        placeholder: 'Добавить Оборудование',
        url: '/equipment/new',
        component: 'EquipmentForm',
    },
    {
        placeholder: 'Добавить Подразделение',
        url: '/department/new',
        component: 'DepartmentForm',
        restricted: true,
    },
    {
        placeholder: 'Добавить МОЛ',
        url: '/mol/new',
        component: 'MOLForm',
        restricted: true,
    },
    {
        placeholder: 'Добавить сервисную оранизацию',
        url: '/serviceOrganization/new',
        component: 'ServiceOrganizationForm',
        restricted: true,
    },
    {
        placeholder: 'Добавить статус оборудования',
        url: '/equipmentStatusForm/new',
        component: 'EquipmentStatusForm',
        restricted: true,
    },
    {
        placeholder: 'Добавить Пользователя',
        url: '/user/new',
        component: 'UserForm',
        restricted: true,
    },
]

export default navigation
