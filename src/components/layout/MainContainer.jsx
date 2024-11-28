import React from 'react';
import Header from '../header';
import SideNavbar from '../navigation';

const MainContainer = ({children}) => {
  return (
      <div className="flex min-h-screen bg-gray-100">
            <SideNavbar />
            <div className="flex flex-col w-full ml-0">
                <Header />
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
  );
};

export default MainContainer;