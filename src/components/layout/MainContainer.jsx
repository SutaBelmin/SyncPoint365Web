import React, { useState, useEffect } from 'react';
import Header from '../header';
import SideNavbar from '../navigation';

const MainContainer = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(false);
            }
            if (window.innerWidth > 768) {
                setIsCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className={`flex flex-col max-w-full transition-all duration-300 ${isCollapsed ? 'ml-64' : 'ml-0'}`}>
            <div className="flex min-h-screen bg-gray-100">
                <SideNavbar
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed(!isCollapsed)} />
                <Header
                    isCollapsed={isCollapsed}
                />
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainContainer;