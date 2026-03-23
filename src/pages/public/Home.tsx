import { useEffect, useState } from "react"
import NavBar from "../../components/NavBar"
import { useNavigate } from "react-router-dom"
import { APP_URL, APP_URL_D } from "../../auth/AuthContext"

function CarCardSkeleton() {
  return (
    <div className="bg-neutral-900 rounded-2xl overflow-hidden animate-pulse border border-neutral-800">
      <div className="h-56 bg-neutral-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-800 rounded w-1/2" />
        <div className="h-px bg-neutral-800 my-4" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-3 bg-neutral-800 rounded" />
          <div className="h-3 bg-neutral-800 rounded" />
        </div>
        <div className="h-10 bg-neutral-800 rounded-xl mt-4" />
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [cars, setCars] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const [brandRes, categoriesRes] = await Promise.all([
        fetch(`${APP_URL}/brands`),
        fetch(`${APP_URL}/categories`),
      ])
      setBrands(await brandRes.json())
      setCategories(await categoriesRes.json())
    }
    fetchData()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, brand, category])

  useEffect(() => {
    setLoading(true)
    const fetchCars = async () => {
      const params = new URLSearchParams({ search, brand, category, page: String(page) })
      const response = await fetch(`${APP_URL}/public/cars?${params}`)
      const data = await response.json()
      setCars(data.data)
      setLastPage(data.last_page)
      setLoading(false)
    }
    const delay = setTimeout(fetchCars, 500)
    return () => clearTimeout(delay)
  }, [search, brand, category, page])

  const resetFilters = () => {
    setSearch("")
    setBrand("")
    setCategory("")
    setPage(1)
  }

  const hasActiveFilters = search || brand || category

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="font-dm bg-neutral-950 min-h-screen">
        <NavBar />

        {/* ── HERO ── */}
        <section className="relative h-130 flex items-center overflow-hidden">
          {/* Fondo degradado — reemplazá la URL por una imagen real si tenés */}
          
          <img
            src="https://img2.wallspic.com/crops/2/1/8/6/2/126812/126812-rueda-supercoche-golpe_de_estado-deportivo-coche_deportivo-3840x2160.jpg"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-neutral-950/60" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
            
            <h1 className="font-syne text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Encuentra tu <br />
              <span className="text-blue-500">vehículo ideal</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-xl mb-10 leading-relaxed">
              Explora nuestra flota de vehículos disponibles y reserva el que mejor se adapte a ti.
            </p>

            {/* Search bar en el hero */}
            <div className="flex items-center gap-3 max-w-2xl">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por marca o modelo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-blue-600 focus:outline-none rounded-xl pl-12 pr-4 py-4 text-white text-sm placeholder:text-neutral-500 transition-colors"
                />
              </div>
              <button
                onClick={() => navigate("/cars")}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-syne font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/25 whitespace-nowrap"
              >
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* ── FILTROS ── */}
        <section className="bg-neutral-900/50 border-y border-neutral-800 py-5 top-16 z-30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center gap-3">

            {/* Pills de categorías */}
            <button
              onClick={() => setCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                !category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-transparent text-neutral-400 border-neutral-700 hover:border-blue-600/50 hover:text-white"
              }`}
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(category === String(c.id) ? "" : String(c.id))}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                  category === String(c.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-transparent text-neutral-400 border-neutral-700 hover:border-blue-600/50 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}

            {/* Separador */}
            <div className="h-6 w-px bg-neutral-700 mx-1 hidden sm:block" />

            {/* Select de marcas */}
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 focus:border-blue-600 focus:outline-none text-sm text-neutral-300 rounded-full px-4 py-2 transition-colors scheme-dark"
            >
              <option value="">Todas las marcas</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar filtros
              </button>
            )}
          </div>
        </section>

        {/* ── GRID DE AUTOS ── */}
        <main className="max-w-6xl mx-auto px-6 py-12">

          {/* Header del grid */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-syne font-bold text-white text-xl">
              {loading ? "Cargando..." : `${cars.length} vehículo${cars.length !== 1 ? "s" : ""} encontrado${cars.length !== 1 ? "s" : ""}`}
            </h2>
            <span className="text-neutral-500 text-sm">
              Página {page} de {lastPage}
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)
              : cars.map((car) => (
                  <div
                    key={car.id}
                    className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-blue-600/40 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300"
                  >
                    {/* Imagen */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={car.image.startsWith('http') 
                        ? car.image 
                        : `${APP_URL_D}/storage/${car.image}`
                      }
                        alt={car.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Badge categoría */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-neutral-950/70 backdrop-blur-sm text-neutral-300 text-xs font-medium border border-neutral-700/50">
                        {car.category.name}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-syne font-bold text-white text-lg leading-tight group-hover:text-blue-400 transition-colors">
                            {car.brand.name} {car.model}
                          </h3>
                          <p className="text-neutral-500 text-sm mt-0.5">{car.year}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className=" font-extrabold text-blue-500 text-xl">${car.price_per_day}</span>
                          <p className="text-neutral-600 text-xs">/día</p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-neutral-800 mb-4" />

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                          <span className="text-base">💺</span>
                          <span>{car.seats} asientos</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                          <span className="text-base">⚙️</span>
                          <span>{car.transmission === "automatic" ? "Automático" : "Manual"}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => navigate(`/cars/${car.id}`)}
                        className="w-full bg-neutral-800 hover:bg-blue-600 text-neutral-300 hover:text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
          </div>

          {/* Paginación */}
          {!loading && cars.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm font-semibold disabled:opacity-40 hover:border-blue-600/50 hover:text-white transition-all disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={page === lastPage}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm font-semibold disabled:opacity-40 hover:border-blue-600/50 hover:text-white transition-all disabled:cursor-not-allowed"
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && cars.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-4">🚗</span>
              <h3 className="font-syne font-bold text-white text-xl mb-2">No hay vehículos</h3>
              <p className="text-neutral-500 text-sm mb-6">No encontramos resultados para tu búsqueda.</p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}