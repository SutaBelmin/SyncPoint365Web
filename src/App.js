import './App.css';
import AppRoutes from './routes/AppRoutes';
import { ModalProvider } from './context/ModalProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { localizationService } from './services';
import { I18nextProvider } from 'react-i18next';
 

function App() {
  return (
    <I18nextProvider i18n={localizationService}>
     <ModalProvider>
       <AppRoutes />
       <ToastContainer/>
     </ModalProvider>
     </I18nextProvider>
 
  );
}

export default App;