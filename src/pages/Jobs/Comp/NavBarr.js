import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';

const NavBarr = () => {
  const { auth_data } = useUserContext()
  const auth = auth_data
  let navItems = [
    { label: 'All jobs', path: '/jobs' },
    { label: 'Submit', path: '/job/submit-job' }
  ];

  if (auth.id) {
    navItems = [
      { label: 'All jobs', path: '/jobs' },
      { label: 'Manage', path: '/job/manage' },
      { label: 'Submit', path: '/job/submit-job' }
    ]
  }

  return (
    <div className="jb-header">
      <nav className="jb-nav">
        <ul className="jb-nav-menu">
          {navItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `jb-tab ${isActive ? 'jb-tab-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavBarr;
