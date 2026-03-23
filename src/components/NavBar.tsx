import NavBarPublic from "./NavBarPublic"
import NavBarUser from "./NavBarUser"
import NavBarAdmin from "./NavBarAdmin"

/**
 * Componente inteligente que muestra el NavBar correcto según:
 * 1. El estado de autenticación del usuario
 * 2. El rol del usuario (admin o usuario normal)
 */
export default function NavBar() {
  // Obtener datos del usuario del localStorage
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null
  
  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user && !!user.token
  
  // Verificar si el usuario es admin
  const isAdmin = isAuthenticated && user.role === "admin"

  // LÓGICA DE DECISIÓN:
  // 1. Si es admin → NavBarAdmin (en cualquier ruta)
  // 2. Si está autenticado (y no es admin) → NavBarUser
  // 3. En cualquier otro caso → NavBarPublic
  
  if (isAdmin) {
    return <NavBarAdmin />
  }
  
  if (isAuthenticated) {
    return <NavBarUser />
  }
  
  return <NavBarPublic />
}
