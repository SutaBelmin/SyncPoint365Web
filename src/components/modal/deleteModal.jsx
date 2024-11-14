import React from "react";

const DeleteModal = ({onDelete, onCancel, entityName}) =>{
return(
<div className="p-6">
      <h2>Are you sure you want to delete {entityName}?</h2>
      <div className="mt-4 flex justify-end space-x-2">
      <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          No
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Yes
        </button>
      </div>
    </div>
    );
};

export default DeleteModal;