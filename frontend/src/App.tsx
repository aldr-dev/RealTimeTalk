import {Container} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import Register from './features/users/Register';
import Login from './features/users/Login';
import {useAppSelector} from './app/hooks';
import {selectUser} from './features/users/usersSlice';
import ProtectedRoute from './UI/ProtectedRoute/ProtectedRoute';
import PageNotFound from './UI/PageNotFound/PageNotFound';

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute isAllowed={Boolean(user)}>
              {/*Home*/}
            </ProtectedRoute>
          }/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Container>
    </>
  );
};

export default App;