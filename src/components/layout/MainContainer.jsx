import React, { useState, useEffect } from 'react';
import Header from '../header';
import SideNavbar from '../navigation';

const MainContainer = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1100) {
                setIsCollapsed(false);
            }
            if (window.innerWidth > 1100) {
                setIsCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className="flex flex-col h-full max-w-full">
            <SideNavbar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />
            <div
                className={`flex min-h-screen bg-gray-100 transition-all duration-300 ${isCollapsed ? 'ml-64' : 'ml-0'
                    }`}
            >
                <Header isCollapsed={isCollapsed} />
                <main className="flex-1 overflow-x-hidden">{children}</main>
            </div>
        </div>
    );
};

export default MainContainer;