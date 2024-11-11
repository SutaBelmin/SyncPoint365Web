import './App.css';
import AppRoutes from './routes/AppRoutes';
import { ModalProvider } from './context/ModalProvider';

function App() {
  return (
     <ModalProvider>
       <AppRoutes />
     </ModalProvider>
  );
}

export default App;