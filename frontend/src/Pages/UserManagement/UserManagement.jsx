import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import EditUser from "./Edit_User";
import ResetPass from "./Reset_Pass";
import User from "./User";
import AddUser from "./Add_User";
import useAxios from "../../Shared modules/Web Service/axiosConfig";

const Usermanagement = () => {
  const [data, setData] = useState([]);
  const [showPage, setShowPage] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [activeButton, setActiveButton] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await useAxios.get('admin');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShowChangePage = () => setShowPage(true);
  const handleResetPassword = () => setShowResetPass(true);
  const handleUser = () => setShowUser(true);
  const handleAddUser = () => setAddUser(true);
  const handleCancel = () => {
    setShowPage(false);
    setShowResetPass(false);
    setShowUser(false);
    setAddUser(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`your-api-endpoint/${id}`, { method: "DELETE" });
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const columns = [
    {
      name: "Company",
      selector: (row) => row.company,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex">
          <button
            className="Action-icon"
            onClick={() => {
              handleShowChangePage();
            }}
          >
            <img src="src/assets/Edit/Edit.svg" alt="Edit Icon" className="icon" />
          </button>
          <button
            className="Action-icon"
            onClick={() => {
              handleResetPassword();
            }}
          >
            <img src="src/assets/Setting/setting.svg" alt="Setting Icon" className="icon" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      width: "150px",
    },
  ];

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-9 d-flex">
            <div className="btn-group" role="group">
              <button
                className={`btn btn-non ${activeButton === "all" ? "active" : ""}`}
                onClick={() => setActiveButton("all")}
              >
                Registered Company
              </button>
            </div>
          </div>
          <div className="col-3 d-flex justify-content-end">
            <button className="border-btn" onClick={handleAddUser}>
              + Register Company
            </button>
          </div>
        </div>
      </div>
      <div className="container mt-3">
        <DataTable
          columns={columns}
          data={data}
          pagination
          responsive
          highlightOnHover
          noHeader
        />
      </div>

      {(showPage || showResetPass || showUser || addUser) && (
        <div className="overlay" onClick={handleCancel}></div>
      )}
      {addUser && <AddUser onCancel={handleCancel} />}
      {showPage && <EditUser onCancel={handleCancel} />}
      {showResetPass && <ResetPass onCancel={handleCancel} />}
      {showUser && <User onCancel={handleCancel} />}
    </div>
  );
};

export default Usermanagement;
