import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { companyNewsService } from '../../services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../context/ModalProvider';
import { CompanyNewsDetails } from '../company-news';
import { BaseModal } from '../../components/modal';

const Home = () => {
    const { t } = useTranslation();
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const {openModal, closeModal} = useModal();

    const loadNews = async (page) => {
        setLoading(true);
        try {
            const filter = {
                query: "",
                visible: true,
                dateFrom: null, 
                dateTo: null, 
                orderBy: "DateCreated|desc", 
                page: page,
                pageSize: itemsPerPage
            };

            const response = await companyNewsService.getPagedList(filter);
            setNews(response.items || []);
            const remainingItems = response.totalItemCount - page * itemsPerPage;
            setHasMore(remainingItems > 0);
            setCurrentPage(page);
        } catch (error) {
            setNews([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        loadNews(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        if (hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        }
    };

    const handleOpenModal = (item) => {
        openModal(
            <CompanyNewsDetails title={item.title} content={item.text} date={item.dateCreated} closeModal={closeModal}/>
        );
    };

    return (
        <div className="p-8 w-1/2">
            <h2 className="h1 text-2xl font-bold mb-4">{t('WELCOME_TO_HOME_SCREEN')}</h2>
            <h1 className="text-xl font-bold mb-4">{t('NEWS')}</h1>
            <div className='border border-blue-400 rounded-lg p-2'>
            {loading ? (
                <p>{t('LOADING')}</p>
            ) : news.length === 0 ? (
                <p>{t('NO_NEWS_TO_DISPLAY')}</p>
            ) : (
                <div>
                    {news.map((item, index) => (
                        <div
                            key={index}
                            className="border border-blue-400 rounded-lg p-4 mb-2 mt-2 bg-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => handleOpenModal(item)}
                        >
                            <h3 className="text-l font-bold">{item.title}</h3>
                            <small>{t('PUBLISHED')}: {new Date(item.dateCreated).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            )}
            </div>
            <BaseModal />
            {news.length > 0 && (
                <div style={{ marginTop: "20px" }} className="flex items-center justify-center">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || loading}
                        className="px-4 py-2 border border-gray-300 rounded-full mr-2"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <p className="text-center mx-4">{t('PAGE')} {currentPage}</p>
                    <button
                        onClick={handleNextPage}
                        disabled={!hasMore || loading}
                        className="px-4 py-2 border border-gray-300 rounded-full ml-2"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
