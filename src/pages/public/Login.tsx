import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../../auth/AuthContext"
import NavBar from "../../components/NavBar"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    login({ email, password }).then((res) => {
      if (res.data.errors) {
        setErrors(res.data.errors)
        setLoading(false)
      } else {
        localStorage.setItem("user", JSON.stringify(res.data))
        localStorage.setItem("isAuthenticated", "true")
        res.data.role === "admin" ? navigate("/admin") : navigate("/")
      }
    })
  }

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 focus:border-blue-600 focus:outline-none rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-neutral-600 transition-colors"
  const labelClass = "block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }
      `}</style>

        <NavBar />
      <div className="font-dm h-[calc(100vh-65px)] bg-neutral-950 flex overflow-hidden">

        {/* ── LADO IZQUIERDO: imagen ── */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Reemplazá esta URL por la imagen que prefieras */}
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80"
            alt="Vehículo de lujo"
            className="w-full h-full object-cover"
          />
          {/* Overlay degradado */}
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950/20 to-neutral-950/80" />

          {/* Texto sobre la imagen */}
          <div className="absolute bottom-12 left-12 max-w-md z-10">
            <h1 className="font-syne text-5xl font-extrabold text-white leading-tight mb-4">
              Manejá lo <span className="text-blue-500">extraordinario.</span>
            </h1>
            <p className="text-neutral-300 text-lg leading-relaxed">
              Accedé a nuestra flota exclusiva de vehículos y gestioná tus reservas fácilmente.
            </p>
          </div>
        </div>

        {/* ── LADO DERECHO: formulario ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-20">
          <div className="max-w-md w-full mx-auto">

            {/* Logo / Brand */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <span className="font-syne font-bold text-white text-xl tracking-tight">CarRental</span>
            </div>

            {/* Título */}
            <div className="mb-8">
              <h2 className="font-syne font-extrabold text-3xl text-white mb-2">Bienvenido de nuevo</h2>
              <p className="text-neutral-500 text-sm">Iniciá sesión para acceder a todas las funciones</p>
            </div>

            {/* Errores */}
            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-6 space-y-1">
                {errors.map((error, i) => (
                  <p key={i} className="text-red-400 text-sm">⚠ {error}</p>
                ))}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className={labelClass}>Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-95 text-white font-syne font-bold text-sm py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? "Iniciando sesión..." : (
                  <>
                    Iniciar sesión
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-neutral-600 mt-8">
              ¿No tenés cuenta?{" "}
              <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                Registrate gratis
              </Link>
            </p>

          </div>
        </div>

      </div>
    </>
  )
}