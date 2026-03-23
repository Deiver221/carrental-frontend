import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

export default function NavBarAdmin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const user = localStorage.getItem("user")
  const userName = user ? JSON.parse(user).name : "Admin"

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <nav className="font-dm sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-2 group">
              <img 
                src="/logo.png" 
                alt="CarRental Admin" 
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-syne font-extrabold text-lg text-white leading-none">
                  CarRental
                </span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wide uppercase">
                  Admin
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              {/* Mostrar enlaces de admin solo si está en rutas de admin */}
              {isAdminRoute ? (
                <>
                  <Link
                    to="/admin"
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      isActive("/admin")
                        ? "text-white bg-neutral-800"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/manage-cars"
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      isActive("/admin/manage-cars")
                        ? "text-white bg-neutral-800"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    Vehículos
                  </Link>

                  <Link
                    to="/admin/manage-reservations"
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      isActive("/admin/manage-reservations")
                        ? "text-white bg-neutral-800"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    Reservas
                  </Link>
                </>
              ) : (
                <>
                  {/* Enlaces cuando está en vistas públicas */}
                  <Link
                    to="/"
                    className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50"
                  >
                    Explorar
                  </Link>

                  <Link
                    to="/admin"
                    className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-600/10 border border-blue-600/20"
                  >
                    Ir al Panel
                  </Link>
                </>
              )}

              {/* Divider */}
              <div className="h-6 w-px bg-neutral-700 mx-2" />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{userName}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-neutral-800">
                        <p className="text-sm font-semibold text-white">{userName}</p>
                        <p className="text-xs text-blue-400">Administrador</p>
                      </div>
                      
                      <div className="py-2">
                        {isAdminRoute ? (
                          <Link
                            to="/"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Ver sitio público
                          </Link>
                        ) : (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Panel de administración
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}
