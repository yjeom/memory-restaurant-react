import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Layout from "./Layout";

const App = ()=>{
    
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
};

export default App;
