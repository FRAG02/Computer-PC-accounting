import React from 'react'
import { Box } from '@mui/material'
import SideBar from './components/shared/SideBar'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import * as pages from './pages'
import navigation from './data/navigation'
import Header from './components/shared/Header'
import { useUser } from './context/userContext'

const __SIDEBAR_WIDTH = 340

const Main = () => {
    const { user } = useUser()
    const isAdmin = user.role === 'Administrator'
    return (
        <Router>
            <Box display="flex">
                <SideBar drawerWidth={__SIDEBAR_WIDTH} />
                <Box
                    sx={{ flexGrow: 1, bgcolor: 'background.default' }}
                    position="relative"
                >
                    <Routes>
                        {navigation.map(({ url, component, restricted }) => {
                            const Component = pages[component]
                            if ((restricted && isAdmin) || !restricted) {
                                return (
                                    <Route path={url} element={<Component />} />
                                )
                            }
                        })}

                        {isAdmin && (
                            <>
                                <Route
                                    path="/mol/edit/:id"
                                    element={<pages.MOLForm />}
                                />
                                <Route
                                    path="/department/edit/:id"
                                    element={<pages.DepartmentForm />}
                                />
                                <Route
                                    path="/serviceOrganization/edit/:id"
                                    element={<pages.ServiceOrganizationForm />}
                                />
                                <Route
                                    path="/serviceOrganization/edit/:id"
                                    element={<pages.ServiceOrganizationForm />}
                                />
                                <Route
                                    path="/equipment-status/edit/:id"
                                    element={<pages.EquipmentStatusForm />}
                                />
                            </>
                        )}
                        <Route
                            path="/equipment/edit/:id"
                            element={<pages.EquipmentForm />}
                        />
                    </Routes>
                </Box>
            </Box>
        </Router>
    )
}

export default Main
