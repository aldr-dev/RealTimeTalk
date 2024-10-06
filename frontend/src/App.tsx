import {Container} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import Register from './features/users/Register';
import Login from './features/users/Login';
import {useAppSelector} from './app/hooks';
import {selectUser} from './features/users/usersSlice';
import ProtectedRoute from './UI/ProtectedRoute/ProtectedRoute';
import PageNotFound from './UI/PageNotFound/PageNotFound';
import NavBar from './UI/NavBar/NavBar';

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute isAllowed={Boolean(user)}>
            <NavBar/>
            <Container maxWidth="lg">
              {/*Home*/}
            </Container>
          </ProtectedRoute>
        }/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </>
  );
};

export default App;