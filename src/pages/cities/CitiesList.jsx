import { useEffect, useState } from "react";
import cityService from "../../services/cityService";
import DataTable from "react-data-table-component";
import './CitiesList.css';

const CitiesList = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await cityService.getList();
            setData(response.data);
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Display Name',
            selector: row => row.displayName,
            sortable: true,
        },
        {
            name: 'Country Name',
            selector: row => row.country.name,
            sortable: true,
        },
        {
            name: 'Postal Code',
            selector: row => row.postalCode,
            sortable: true,
        }
    ];

    return (
        <div>

            <DataTable
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                noDataComponent="No cities available" />

        </div>
    );
}

export default CitiesList;