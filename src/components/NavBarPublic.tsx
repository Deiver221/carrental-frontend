import { Link } from "react-router-dom"

export default function NavBarPublic() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <nav className="font-dm sticky top-0 z-50 bg-neutral-950 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/logo.png" 
                alt="CarRental" 
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
              <span className="font-syne font-extrabold text-xl text-white">
                CarRental
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50"
              >
                Explorar
              </Link>
              
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
              >
                Registrarse
              </Link>
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}
