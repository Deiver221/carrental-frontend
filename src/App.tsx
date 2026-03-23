import { Route, Routes,  } from 'react-router-dom'
import Register from './pages/public/Register'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import AddCar from './pages/admin/AddCar'
import ManageReservations from './pages/admin/ManageReservations'
import ManageCars from './pages/admin/ManageCar'
import AdminLayout from './pages/layouts/AdminLayout'
import EditCar from './pages/admin/EditCar'
import CarDetails from './pages/public/CarDetails'
import MyReservations from './pages/public/MyReservations'




function App() {

  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/cars/:id' element={<CarDetails />}></Route>
        <Route path="my-reservations" element={<MyReservations />} />
        <Route
          path="/admin"
          element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-reservations" element={<ManageReservations />} />
          <Route path="cars/edit/:id" element={<EditCar />} />
          
        </Route>

      </Routes>
    </>
  )
}

export default App
