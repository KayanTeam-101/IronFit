import Navbar from './Components/layouts/Navbar';
import Exersice from './Pages/Exersices/Exersice';
import FoodPage from './Pages/food/FoodPage';
import Page from './Pages/food/History/page';
import Home from './Pages/home/Home';
import MakeADiet from './Pages/MKDiet/MakeADiet';
import Welcome from './Pages/Welcome/Welcome'
import { Routes, Route , Navigate, BrowserRouter} from "react-router-dom";

function App() {
  const isFirstTime : boolean = localStorage.getItem("isFirstTime") == null ? true : false;
  return (
    <>
      <Routes>
        <Route path="/" element={isFirstTime ? <Welcome /> : <Navigate to='/me/home' replace/>} />
        <Route path="me/home" element={<Home />} />
        <Route path="me/food" element={<FoodPage />} />
        <Route path="MkADiet" element={<MakeADiet />} />
        <Route path="/exercises" element={<Page/>} />
        <Route path="me/history" element={localStorage.getItem('History') ? <Page/> : <Navigate to='/me/home' />} />
      </Routes>
      {!isFirstTime && <Navbar /> }
    </>
  )
}

export default App
