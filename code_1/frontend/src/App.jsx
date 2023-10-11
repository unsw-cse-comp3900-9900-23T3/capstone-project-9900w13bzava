import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import Login from './login';
import Register from './register';
import MainPage from './mainpage';
import Create from './create';
import Edit from './edit';
import Show from './show';
import Record from './record';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/register" element={<Register />} />
          <Route
            path="/mainpage"
            element={
              <MainPage>
                <Outlet />
              </MainPage>
            }
          >
            <Route path="/mainpage/show" element={<Show />} />
            <Route path="/mainpage/create" element={<Create />} />
            <Route path="/mainpage/edit" element={<Edit />} />
            <Route path="/mainpage/record" element={<Record />} />
          </Route>
          <Route path="*" element={<h2>404 page</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;