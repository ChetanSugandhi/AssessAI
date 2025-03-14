import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Test from "./Test.jsx";
import RoleSelectionForm from "./RoleSelectionForm.jsx";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Test />
      <RoleSelectionForm />
    </>
  );
}



export default App;