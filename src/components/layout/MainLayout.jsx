import { Outlet } from 'react-router-dom';
import MainContainer from './MainContainer'; // Adjust the path as necessary

const MainLayout = () => {
  return (
    <MainContainer>
      <Outlet /> {/* This will render the matched child route */}
    </MainContainer>
  );
};

export default MainLayout;