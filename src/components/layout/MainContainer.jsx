import React, { useState, useEffect } from 'react';
import Header from '../header';
import SideNavbar from '../navigation';

const MainContainer = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className="flex min-h-screen bg-gray-100">
            <SideNavbar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)} />
            <div
                className={`flex flex-col w-full transition-all duration-300 ${isCollapsed ? 'ml-64' : 'ml-00'}`}
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