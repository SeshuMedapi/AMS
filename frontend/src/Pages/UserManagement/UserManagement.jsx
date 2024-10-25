import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import AddUser from "./Add_User";
import AddAdmin from "./Add_Admin";
import useAxios from "../../Shared modules/Web Service/axiosConfig";
import Permission from "../../Shared modules/Context management/permissionCheck";

const Usermanagement = () => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [showPage, setShowPage] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [addUsers, setAddUsers] = useState(false);
  const [activeButton, setActiveButton] = useState("all");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await useAxios.get('admin');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await useAxios.get(`user?user_id=${userId}`);
      setData1(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleResetPassword = () => setShowResetPass(true);
  const handleAddUser = () => setAddUser(true);
  const handleAddUsers = () => setAddUsers(true);
  const handleCancel = () => {
    setShowPage(false);
    setAddUser(false);
    setAddUsers(false);
  };

  const handleDelete = async (company_id) => {
    try {
      await useAxios.delete(`admin/${company_id}`); 
      fetchData(); 
      setData((prevData) => prevData.filter((item) => item.id !== company_id));
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
          <Permission requiredPermission="view_user" action="hide">
          <button
            className="Action-icon"
            onClick={() => {
              handleResetPassword();
            }}
          >
            <img src="src/assets/Setting/details.png" alt="Setting Icon" className="icon" />
          </button>
          </Permission>


          <Permission requiredPermission="delete_company" action="hide">
          <button
            className="Action-icon"
            onClick={() => {
              handleDelete(row.company_id);
            }}
          >
            <img src="src/assets/Edit/delete.png" alt="Edit Icon" className="icon" />
          </button>
          </Permission>
        </div>
      ),
      ignoreRowClick: true,
      width: "150px",
    },
  ];

  const columns1 = [
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.group_name,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_number,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex">
          <Permission requiredPermission="view_user" action="hide">
          <button
            className="Action-icon"
            onClick={() => {
              handleResetPassword();
            }}
          >
            <img src="src/assets/Setting/details.png" alt="Setting Icon" className="icon" />
          </button>
          </Permission>


          <Permission requiredPermission="delete_company" action="hide">
          <button
            className="Action-icon"
            onClick={() => {
              handleDelete(row.company_id);
            }}
          >
            <img src="src/assets/Edit/delete.png" alt="Edit Icon" className="icon" />
          </button>
          </Permission>
        </div>
      ),
      ignoreRowClick: true,
      width: "150px",
    },
  ];

  return (
    <div>
      <div className="container">
        <div className="row">
          <Permission requiredPermission="create_company" action="hide"> 
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
        </Permission>
        <Permission requiredPermission="create_user" action="hide"> 
          <div className="col-9 d-flex">
            <div className="btn-group" role="group">
              <button
                className={`btn btn-non ${activeButton === "all" ? "active" : ""}`}
                onClick={() => setActiveButton("all")}
              >
                Users
              </button>
            </div>
          </div>
          <div className="col-3 d-flex justify-content-end">
            <button className="border-btn" onClick={handleAddUsers}>
              + Add User
            </button>
          </div>
        </Permission>
        </div>
      </div>
      <div className="container mt-3">
      <Permission requiredPermission="view_company" action="hide">
        <DataTable
          columns={columns}
          data={data}
          pagination
          responsive
          highlightOnHover
          noHeader
          customStyles={{
            headRow: {
              style: {
                borderBottom: "1px solid black",
                fontWeight: "bold",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
              },
            },
            rows: {
              style: {
                borderBottom: "1px solid #ECEFF3",
              },
            },

            pagination: {
              style: {
                backgroundColor: "#EAEDF1",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "0 0 20px 20px",
              },
            },
          }}
        />
      </Permission>
      <Permission requiredPermission="view_user" action="hide">
        <DataTable
          columns={columns1}
          data={data1}
          pagination
          responsive
          highlightOnHover
          noHeader
          customStyles={{
            headRow: {
              style: {
                borderBottom: "1px solid black",
                fontWeight: "bold",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
              },
            },
            rows: {
              style: {
                borderBottom: "1px solid #ECEFF3",
              },
            },

            pagination: {
              style: {
                backgroundColor: "#EAEDF1",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "0 0 20px 20px",
              },
            },
          }}
        />
      </Permission>
      </div>

      {(showPage || addUser) && (
        <div className="overlay" onClick={handleCancel}></div>
      )}
      {addUser && <AddAdmin onCancel={handleCancel} onUserAdded={fetchData}/>}
      {addUsers && <AddUser onCancel={handleCancel} onUserAdded={fetchUserData}/>}
    </div>
  );
};

export default Usermanagement;
