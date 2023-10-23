import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import React from 'react';
import Login from './login';
import Register from './register';
import MainPage from './mainpage';
import Create from './create';
import Edit from './edit';
import Appointments from './appointments';
import Record from './record';

function App() {
  const [token, setToken] = React.useState(null);
  function manageTokenSet (token) {
    setToken(token);
    localStorage.setItem('token', token)
  }

  React.useEffect(function () {
    const tokens = localStorage.getItem('token')
    setToken(tokens)
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onSuccess={manageTokenSet}/>}/>
          <Route path="/register" element={<Register />} />
          <Route
            path="/mainpage"
            element={
              <MainPage>
                <Outlet />
              </MainPage>
            }
          >
            <Route path="/mainpage/appointments" element={<Appointments token={token}/>} />
            <Route path="/mainpage/create" element={<Create />} />
            <Route path="/mainpage/edit" element={<Edit />} />
            <Route path="/mainpage/record" element={<Record token={token}/>} />
          </Route>
          <Route path="*" element={<h2>404 page</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;