import './App.css';
import AppRoutes from './routes/AppRoutes';
import { ModalProvider } from './context/ModalProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
     <ModalProvider>
       <AppRoutes />
       <ToastContainer/>
     </ModalProvider>
  );
}

export default App;