import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return(

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;