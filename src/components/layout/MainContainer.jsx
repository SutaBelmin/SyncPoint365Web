import React, { useState } from 'react';
import Header from '../header';
import SideNavbar from '../navigation';

const MainContainer = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SideNavbar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div
                className={`flex flex-col w-full transition-all duration-300 ${
                    isSidebarCollapsed ? 'ml-14' : 'ml-64'}`}
            >
                <Header />
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainContainer;