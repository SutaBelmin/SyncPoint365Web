import './App.css';
import AppRoutes from './routes/AppRoutes';
import { ModalProvider } from './context/ModalProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { localizationsService } from './services';
import { I18nextProvider } from 'react-i18next';
import { useEffect } from 'react';
import { AuthStore } from './stores';

function App() {
  const initializeAuthStore = AuthStore((state) => state.initializeAuthStore);

  useEffect(() => {
    initializeAuthStore();
  }, [initializeAuthStore]);

  return (
    <I18nextProvider i18n={localizationsService}>
        <ModalProvider>
          <AppRoutes />
          <ToastContainer />
        </ModalProvider>
    </I18nextProvider>

  );
}

export default App;