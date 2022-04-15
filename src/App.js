import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Layout from './Layout';
import Login from './Login';
import SingUp from './SingUp';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SingUp />} />
      </Route>
    </Routes>
  );
};

export default App;
