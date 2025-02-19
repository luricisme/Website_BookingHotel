import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "~/redux/action/accountAction";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
    FaTachometerAlt, FaUsers, FaUserTie, FaHotel,
    FaClipboardList, FaSignOutAlt, FaBars
} from "react-icons/fa";
import "./sidebar.css";

function SidebarComponent() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        dispatch(doLogout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/admin/login");
    };

    return (
        <div className="sidebar-container">
            <Sidebar
                collapsed={collapsed}
                className="app-sidebar"
                backgroundColor="#1C2D6E"
                width="250px"
                collapsedWidth="80px"
            >
                <div className="sidebar-header">
                    <button className="menu-toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                        <FaBars />
                    </button>
                    {!collapsed && <h2 className="sidebar-title">BookaStay</h2>}
                </div>

                <Menu
                    menuItemStyles={{
                        button: ({ active }) => {
                            return {
                                backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : undefined,
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            };
                        },
                    }}
                >
                    <MenuItem
                        component={<Link to="/admin/dashboard" />}
                        active={location.pathname === "/admin/dashboard"}
                        icon={<FaTachometerAlt />}
                    >
                        Dashboard
                    </MenuItem>

                    <MenuItem
                        component={<Link to="/admin/manage-users" />}
                        active={location.pathname === "/admin/manage-users"}
                        icon={<FaUsers />}
                    >
                        Users
                    </MenuItem>

                    <MenuItem
                        component={<Link to="/admin/manage-hotel-owners" />}
                        active={location.pathname === "/admin/manage-hotel-owners"}
                        icon={<FaUserTie />}
                    >
                        Owners
                    </MenuItem>

                    <MenuItem
                        component={<Link to="/admin/manage-hotels" />}
                        active={location.pathname === "/admin/manage-hotels"}
                        icon={<FaHotel />}
                    >
                        Hotels
                    </MenuItem>

                    <MenuItem
                        component={<Link to="/admin/manage-requests" />}
                        active={location.pathname === "/admin/manage-requests"}
                        icon={<FaClipboardList />}
                    >
                        Requests
                    </MenuItem>
                </Menu>

                <div className="logout-container">
                    <Menu
                        menuItemStyles={{
                            button: {
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 120, 120, 0.2)',
                                },
                            },
                        }}
                    >
                        <MenuItem
                            onClick={handleLogout}
                            icon={<FaSignOutAlt />}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </Sidebar>
        </div>
    );
}

export default SidebarComponent;