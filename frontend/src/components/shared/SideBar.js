import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import navigation from '../../data/navigation'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/userContext'

const SideBar = ({ drawerWidth }) => {
    const { user } = useUser()
    const isAdmin = user.role === 'Administrator'
    const navigate = useNavigate()
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: 'background.paper',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />
            <List>
                {navigation.map(({ placeholder, url, restricted }, index) => {
                    if ((restricted && isAdmin) || !restricted) {
                        return (
                            <ListItem key={placeholder} disablePadding>
                                <ListItemButton onClick={() => navigate(url)}>
                                    <ListItemText primary={placeholder} />
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                    return null
                })}
            </List>
            <Divider />
        </Drawer>
    )
}

export default SideBar
