import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../components/localization';
import { useAuth } from '../../context/AuthProvider';

export const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { loggedUser } = useAuth();

    const handleBackToHome = () => {
        if (loggedUser) 
            navigate('/home', { replace: true });
        else 
            navigate('/login', { replace: true });
    };

    return (
        <div>
            <header className="text-white flex justify-between items-center h-16 px-6 shadow-md">
                <h1 className="header-font" style={{ paddingLeft: '0rem' }}>
                    <span className="text-custom-blue">SyncPoint</span>
                    <span className="text-yellow-600">365</span>
                </h1>
                <div className="mr-4">
                    <LanguageSwitcher />
                </div>
            </header>

            <div className="text-center mt-40">
                <p className="text-3xl font-semibold text-[#1e3a8a]">404</p>
                <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">{t('PAGE_NOT_FOUND')}</h1>
                <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">{t('PAGE_NOT_FOUND_MESSAGE')}</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                        onClick={handleBackToHome}
                        className="rounded-md bg-[#1e3a8a] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {t('BACK_TO_HOME')}
                    </button>
                </div>
            </div>
        </div>
    );
};
