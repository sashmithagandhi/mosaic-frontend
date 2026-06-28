import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    navigate('/login')
  }

  return (
    <nav className="bg-[#17345C] text-white px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold tracking-wide">
        🧩 Mosaic
      </Link>
      <div className="flex gap-6 text-sm">
        {token ? (
          <>
            <Link to="/projects" className="hover:text-blue-300">Projects</Link>
            <Link to="/brainstorm" className="hover:text-blue-300">Brainstorm</Link>
            <Link to="/profile" className="hover:text-blue-300">Profile</Link>
            <button onClick={handleLogout} className="hover:text-red-300">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/register" className="hover:text-blue-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar