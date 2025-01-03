import './App.css';
import { AppRoutes } from './routes';
import { ModalProvider } from './context/ModalProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { localizationsService } from './services';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './context';

function App() {
  return (
    <I18nextProvider i18n={localizationsService}>
      <AuthProvider>
        <ModalProvider>
          <AppRoutes />
          <ToastContainer />
        </ModalProvider>
      </AuthProvider>
    </I18nextProvider>

  );
}

export default App;