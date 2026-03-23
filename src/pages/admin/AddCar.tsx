import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { APP_URL } from "../../auth/AuthContext"

export default function AddCar() {
  const navigate = useNavigate()
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [carData, setCarData] = useState({
    brand_id: "",
    category_id: "",
    model: "",
    year: "",
    price_per_day: "",
    transmission: "manual",
    fuel_type: "gasoline",
    seats: "",
    description: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const [brandsRes, categoriesRes] = await Promise.all([
        fetch(`${APP_URL}/brands`),
        fetch(`${APP_URL}/categories`),
      ])
      setBrands(await brandsRes.json())
      setCategories(await categoriesRes.json())
    }
    fetchData()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setCarData({ ...carData, [e.target.name]: e.target.value })
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    const user = localStorage.getItem("user")
    if (!user) { setError("No autenticado"); setSubmitting(false); return }

    const form = new FormData()
    Object.entries(carData).forEach(([key, val]) => form.append(key, val))
    if (image) form.append("image", image)

    try {
      const token = JSON.parse(user).token
      const response = await fetch(`${APP_URL}/cars`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Error al publicar el vehículo")
        setSubmitting(false)
        return
      }

      setSuccess("¡Vehículo publicado correctamente!")
      setCarData({
        brand_id: "", category_id: "", model: "", year: "",
        price_per_day: "", transmission: "manual", fuel_type: "gasoline",
        seats: "", description: "",
      })
      setImage(null)
      setImagePreview(null)
    } catch {
      setError("Algo salió mal, intenta nuevamente")
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-neutral-950 border border-neutral-700 focus:border-blue-600 focus:outline-none rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 transition-colors [color-scheme:dark]"
  const labelClass = "block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="font-dm bg-neutral-950 min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4">
          <h1 className="font-extrabold text-2xl text-white">Publicar vehículo</h1>
          <p className="text-neutral-500 text-xs mt-0.5">Completá los datos para agregar un nuevo vehículo al inventario</p>
        </header>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-10 space-y-6">

          {/* ── SECCIÓN 1: Información general ── */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="font-syne font-bold text-white text-base border-l-4 border-blue-600 pl-4 mb-6">
              Información general
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Marca */}
              <div>
                <label className={labelClass}>Marca</label>
                <select name="brand_id" value={carData.brand_id} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar marca</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              {/* Modelo */}
              <div>
                <label className={labelClass}>Modelo</label>
                <input
                  type="text" name="model" value={carData.model}
                  onChange={handleChange} placeholder="ej. Corolla"
                  className={inputClass}
                />
              </div>

              {/* Año */}
              <div>
                <label className={labelClass}>Año</label>
                <input
                  type="number" name="year" value={carData.year}
                  onChange={handleChange} placeholder="ej. 2023"
                  className={inputClass}
                />
              </div>

              {/* Precio */}
              <div>
                <label className={labelClass}>Precio por día (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                  <input
                    type="number" step="0.01" name="price_per_day" value={carData.price_per_day}
                    onChange={handleChange} placeholder="0.00"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>

            {/* Categoría como pills */}
            <div className="mt-6">
              <label className={labelClass}>Categoría</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCarData({ ...carData, category_id: String(c.id) })}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      carData.category_id === String(c.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-transparent text-neutral-400 border-neutral-700 hover:border-blue-600/50 hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECCIÓN 2: Especificaciones técnicas ── */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="font-syne font-bold text-white text-base border-l-4 border-blue-600 pl-4 mb-6">
              Especificaciones técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Transmisión */}
              <div>
                <label className={labelClass}>Transmisión</label>
                <select name="transmission" value={carData.transmission} onChange={handleChange} className={inputClass}>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automática</option>
                </select>
              </div>

              {/* Combustible */}
              <div>
                <label className={labelClass}>Combustible</label>
                <select name="fuel_type" value={carData.fuel_type} onChange={handleChange} className={inputClass}>
                  <option value="gasoline">Gasolina</option>
                  <option value="diesel">Diésel</option>
                  <option value="electric">Eléctrico</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>

              {/* Asientos */}
              <div>
                <label className={labelClass}>Asientos</label>
                <input
                  type="number" name="seats" value={carData.seats}
                  onChange={handleChange} placeholder="ej. 5" min="1"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-5">
              <label className={labelClass}>Descripción</label>
              <textarea
                name="description" value={carData.description}
                onChange={handleChange} rows={4}
                placeholder="Describí las características y condiciones del vehículo..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          {/* ── SECCIÓN 3: Imagen ── */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="font-syne font-bold text-white text-base border-l-4 border-blue-600 pl-4 mb-6">
              Imagen del vehículo
            </h2>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video max-w-md">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setImagePreview(null) }}
                  className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="group flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 hover:border-blue-600 rounded-2xl p-12 text-center cursor-pointer transition-colors">
                <div className="w-14 h-14 rounded-full bg-neutral-800 group-hover:bg-blue-600/10 flex items-center justify-center mb-4 transition-colors">
                  <svg className="w-6 h-6 text-neutral-500 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="font-semibold text-white text-sm mb-1">Subir imagen del vehículo</p>
                <p className="text-neutral-500 text-xs mb-4">Arrastrá o hacé click para seleccionar</p>
                <span className="text-xs text-neutral-600">PNG, JPG, WEBP · Máx. 10MB</span>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            )}
          </section>

          {/* Alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
              ⚠ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-green-400 text-sm">
              ✓ {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() => navigate("/admin/manage-cars")}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-95 text-white font-syne font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              {submitting ? "Publicando..." : "Publicar vehículo"}
            </button>
          </div>

        </form>
      </div>
    </>
  )
}