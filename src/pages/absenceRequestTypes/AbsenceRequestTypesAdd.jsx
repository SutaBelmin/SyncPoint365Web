import React, { useState } from 'react';

const AbsenceRequestTypesAdd = ({ closeModal }) => {
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);

    const handleSubmit = async (e) => {        
        try {
            closeModal(); 
        } catch (error) {
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">New Absence Request Type</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-gray-700">
                        Active
                    </label>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AbsenceRequestTypesAdd;
