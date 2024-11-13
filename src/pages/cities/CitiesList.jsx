import { useEffect, useState } from "react";
import cityService from "../../services/cityService";
import DataTable from "react-data-table-component";
import './CitiesList.css';

const CitiesList = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await cityService.getCities();
            setData(response.data);
        } catch (error) {
            console.log("Error fetching cities:", error);
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
            name: 'Short Name',
            selector: row => row.shortName,
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