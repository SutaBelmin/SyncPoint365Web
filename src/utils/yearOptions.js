export const yearOptions = () => {
    const startYear = 2025;
    const currentYear = new Date().getFullYear(); 
    const years = Array.from({ length: currentYear - startYear + 3 }, (_, i) => startYear + i);
    return years.map(year => ({ value: year, label: year.toString() }));
};