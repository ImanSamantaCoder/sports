import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './FriendNavbar.css';

const Friend = () => {
  return (
    <div className="friend-wrapper">
      <nav className="friend-navbar">
         <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          home
        </NavLink>
        <NavLink to="friends/suggestions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Friend Suggestions
        </NavLink>
        <NavLink to="friends/friends" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Friends
        </NavLink>
        <NavLink to="friends/requests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Friend Requests
        </NavLink>
      </nav>

      {/* Renders the nested component based on route */}
      <div className="friend-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Friend;
