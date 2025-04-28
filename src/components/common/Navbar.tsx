import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          TaskO Fake
        </Link>
        <div className="flex gap-4">
          <Link to="/dashboard" className="hover:text-blue-200">
            Dashboard
          </Link>
          <Link to="/tasks" className="hover:text-blue-200">
            My Tasks
          </Link>

          {currentUser?.role === 'Team Leader' && (
            <>
              <Link to="/team-tasks" className="hover:text-blue-200">
                Team Tasks
              </Link>
              <Link to="/reports" className="hover:text-blue-200">
                Reports
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <>
              <span>{currentUser.name}</span>
              <span className="bg-blue-500 px-2 py-1 rounded-full text-xs">{currentUser.role}</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
