import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import AddUser from "./Add_User";
import AddAdmin from "./Add_Admin";
import AddRole from "./Add_Role";
import useAxios from "../../Shared modules/Web Service/axiosConfig";
import { Modal, Button } from 'react-bootstrap';
import Permission from "../../Shared modules/Context management/permissionCheck";
import AddBranch from "./Add_Branch";
import EditBranch from "./Edit_Branch";
import EditUser from "./EditUser"
import CreateUser from "./CreateUser";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";


import { FaToggleOn, FaToggleOff,  FaEdit, FaTrash, } from 'react-icons/fa';
import EditRole from "./Edit_Role";


const Usermanagement = () => {
  const [data, setData] = useState([]); 
  const [data1, setData1] = useState([]); 
  const [branchdata, setBranchData] = useState([]); 
  const [roles, setRoles] = useState([]);
  const [showPage, setShowPage] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [addRole, setRole] = useState(false);
  const [addUsers, setAddUsers] = useState(false);
  const [addBranch, setAddBranch] = useState(false);
  const [editrole, setEditrole] = useState(false);
  const [editbranch, setEditBranch] = useState(false);
  // const [edituser, setEditUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeButton, setActiveButton] = useState("all");
  const userId = localStorage.getItem("userId");
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const[roledata, SetRoleData] = useState("null")
  const[branch, SetBranch] = useState("null")
  // const [user, SetUser] = useState("null")

  const perm = JSON.parse(localStorage.getItem("permissions"));

  useEffect(() => {
    if (perm && perm.includes("view_company")) {
      fetchData();
    }
    if (perm && perm.includes("view_users")) {
      fetchUserData();
    }
    if (perm && perm.includes("add_role")) {
      fetchRoles();
    }
    if (perm && perm.includes("add_branch")) {
      fetchBranch();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await useAxios.get("admin");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await useAxios.get(`user`);
      setData1(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await useAxios.get(`newrole/${userId}`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles data:", error);
    }
  };

  const fetchBranch = async ()  => {
    try {
      const response = await useAxios.get(`branch`);
      setBranchData(response.data);
    } catch (error) {
      console.error("Error fetching roles data:", error);
    }
  }

  const handleDeleteRole = async (roleId) => {
    try {
      await useAxios.delete(`newrole/${roleId}`);
      fetchRoles(); 
      setShowDeleteModal(false); 
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const conditionalBranchStyles = [
    {
      when: (row) => !row.status,
      style: {
        textDecoration: "line-through",
        color: "#d63031",
      },
    },
  ];

  const conditionalRowStyles = [
  {
    when: (row) => !row.is_active,
    style: {
      textDecoration: "line-through",
      color: "#d63031",
    },
  },
];

  const handleBranchToggle = async () => {
    if (selectedBranchId !== null) {
      try {
        let branchstatus = null
        if (perm && perm.includes("add_branch")) {
          console.log(branchdata[0].id);
          console.log(selectedBranchId);
          branchstatus = branchdata.find((u) => u.id === selectedBranchId);
        }
        const branchstat = !branchstatus.status;
        await useAxios.post('/branch/activate', {
          branch_id: selectedBranchId,
          activate: branchstat,
        });

        if (perm && perm.includes("add_branch")) {
          fetchBranch();
        }
      }
      catch (error) {
        console.error("Error toggling branch status:", error);
      } finally {
        setShowBranchModal(false);
        setSelectedBranchId(null);
      }
    }
  }
    const handleStatusToggle = async () => {
    if (selectedUserId !== null) {
      try {
        let user = null;

        if (perm && perm.includes("view_company")) {
          user = data.find((u) => u.id === selectedUserId);
        }
        if (perm && perm.includes("view_users")) {
          user = data1.find((u) => u.id === selectedUserId);
        }
        const newStatus = !user.is_active;

        console.log("Payload being sent:", {
          user_id: selectedUserId,
          activate: newStatus,
        });
  
        await useAxios.post('/user/activate', {
          user_id: selectedUserId,
          activate: newStatus,
        });

        await useAxios.post('/branch/activate', {
          branch_id: selectedBranchId,
          activate: newStatus,
        });

        if (perm && perm.includes("view_company")) {
          fetchData();
        }
        if (perm && perm.includes("view_users")) {
          fetchUserData();
        }

        setData1((prevData) =>
          prevData.map((u) =>
            u.id === selectedUserId ? { ...u, isActive: newStatus } : u
          )
        );

      } catch (error) {
        console.error("Error toggling user status:", error);
      } finally {
        setShowConfirmModal(false);
        setSelectedUserId(null);
      }
    }
  };
  
const handleResetPassword = () => setShowResetPass(true);
  const handleAddUser = () => setAddUser(true);
  const handleRole = () => setRole(true);
  const handleAddUsers = () => setAddUsers(true);
  const handleAddBranch = () => setAddBranch(true);
  const handleEditRole = (row) =>{
    setEditrole(true);
    SetRoleData(row);
  }
  const handleEditBranch = (row) =>{
    setEditBranch(true);
    SetBranch(row);
  }
  // const handleEditUser = (row) =>{
  //   setEditUser(true);
  //   SetUser(row);
  // }
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (row) => {
    setSelectedUser(row);
    setEditUser(true);
  };
  
  const handleCancel = () => {
    setEditrole(false);
    setShowPage(false);
    setAddUser(false);
    setRole(false);
    setAddUsers(false);
    setAddBranch(false);
    setEditBranch(false);
    setEditUser(false);
  };

  const handleClick = (button) => {
    setActiveButton(button);
  };

  const handleDelete = async (company_id) => {
    try {
      await useAxios.delete(`admin/${company_id}`);
      fetchData();
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
      name: "Status",
      cell: (row) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedUserId(row.id);
            setShowConfirmModal(true);
          }}
        >
          {row.is_active ? (
            <FaToggleOn size={24} color="#00b894" />
          ) : (
            <FaToggleOff size={24} color="#d63031" />
          )}
        </div>  
      ),
      sortable: false,
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
      name: "Status",
      cell: (row) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedUserId(row.id);
            setShowConfirmModal(true);
          }}
        >
          {row.is_active ? (
            <FaToggleOn size={24} color="#00b894" />
          ) : (
            <FaToggleOff size={24} color="#d63031" />
          )}
        </div>
      ),
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <FaEdit
            style={{
              cursor: "pointer",
              color: "#1e90ff",
              fontSize: "18px",
              margin: "5px",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={() => handleEditUser(row)}
          />
        </div>
      ),
    }
  ];

  const columns_branch = [
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Edit",
      selector: (row) => (
        <div style={{ textAlign: "center" }}>
          <FaEdit
            style={{
              cursor: "pointer",
              color: "#1e90ff",
              fontSize: "18px",
              margin: "5px",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={() => handleEditBranch(row)}
          />
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedBranchId(row.id);
            setShowBranchModal(true);
          }}
        >
          {row.status ? (
            <FaToggleOn size={24} color="#00b894" />
          ) : (
            <FaToggleOff size={24} color="#d63031" />
          )}
        </div>
      ),
      sortable: false,
    },
  ];

  const columnRole = [
    {
      name: "Role Name",
      selector: (row) => row.role_name,
      sortable: true,
      style: {
        fontWeight: "600",
        color: "#34495e",
        fontSize: "15px",
        padding: "8px 12px",
      },
    },
    {
      name: "Permissions",
      selector: (row) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            padding: "8px 10px",
          }}
        >
          {row.permissions.map((perm, index) => (
            <span
              key={index}
              style={{
                backgroundColor: "#e8f6f3",
                color: "#2c3e50",
                fontSize: "13px",
                padding: "4px 8px",
                borderRadius: "12px",
                border: "1px solid #a4d3c2",
                whiteSpace: "nowrap",
              }}
            >
              {perm.codename}
            </span>
          ))}
        </div>
      ),
      sortable: false,
      style: {
        maxWidth: "350px",
        overflow: "hidden",
      },
    },
    {
      name: "Edit",
      selector: (row) => (
        <div style={{ textAlign: "center" }}>
          <FaEdit
            style={{
              cursor: "pointer",
              color: "#1e90ff",
              fontSize: "18px",
              margin: "5px",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={() => handleEditRole(row)}
          />
        </div>
      ),
    },
    // {
    //   name: "Delete",
    //   selector: (row) => (
    //     <div style={{ textAlign: "center" }}>
    //       <FaTrash
    //         style={{
    //           cursor: "pointer",
    //           color: "#e74c3c",
    //           fontSize: "18px",
    //           margin: "5px",
    //           transition: "transform 0.2s",
    //         }}
    //         onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
    //         onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
    //         onClick={() => {
    //           setRoleToDelete(row.id);
    //           setShowDeleteModal(true);
    //         }}
    //       />
    //     </div>
    //   ),
    //   sortable: false,
    // },
  ];

  return (
    <div className="shadow-sm px-3 py-3 rounded" style={{
      backgroundColor: "rgb(255, 255, 255)",
    }}>
      <div className="container ">
        <div className="row">
          <div className="col-9 d-flex">
            <div className="btn-group" role="group">
            <Permission requiredPermission="view_company" action="hide">
              <div className="">
                <a
                  href="#"
                  className={`btn btn-non  ${
                    activeButton === "all" ? "active" : ""
                  }`}
                  role="group"
                  onClick={() => handleClick("all")}
                >
                  Companies
                </a>
              </div>
            </Permission>
            <Permission requiredPermission="view_users" action="hide">
              <div className="">
                <a
                  href="#"
                  className={`btn btn-non  ${
                    activeButton === "all" ? "active" : ""
                  }`}
                  role="group"
                  onClick={() => handleClick("all")}
                >
                  Users
                </a>
              </div>
            </Permission>
            <Permission requiredPermission="add_branch" action="hide">
              <div className="">
                <a
                  href="#"
                  className={`btn btn-non  ${
                    activeButton === "branch" ? "active" : ""
                  }`}
                  role="group"
                  onClick={() => handleClick("branch")}
                >
                  Branches
                </a>
              </div>
            </Permission>
            <Permission requiredPermission="add_role" action="hide">
              <div className="">
                <a
                  href="#"
                  className={`btn btn-non ${
                    activeButton === "role" ? "active" : ""
                  }`}
                  role="group"
                  onClick={() => handleClick("role")}
                >
                  Roles
                </a>
              </div>
              </Permission>
            </div>
          </div>
          {activeButton === "all" && <Permission requiredPermission="create_company" action="hide">
            <div className="col-3 d-flex justify-content-end">
              <button className="border-btn" onClick={handleAddUser}>
                + Register Company
              </button>
            </div>
          </Permission>}

          {activeButton === "branch" && <Permission requiredPermission="add_branch" action="hide">
            <div className="col-3 d-flex justify-content-end">
              <button className="border-btn" onClick={handleAddBranch}>
                + Create Branch
              </button>
            </div>
          </Permission>}
          
          {activeButton === "all" && <Permission requiredPermission="create_user" action="hide">
            <div className="col-3 d-flex justify-content-end">
              <button className="border-btn" onClick={handleAddUsers}>
                + Create User
              </button>
            </div>
          </Permission>}

          {activeButton === "role" && <Permission requiredPermission="add_role" action="hide">
            <div className="col-3 d-flex justify-content-end">
              <button className="border-btn" onClick={handleRole}>
                + Add Role
              </button>
            </div>
          </Permission>}
        </div>
      </div>
        
      <div className="container mt-3">
        {activeButton === "all" && <Permission requiredPermission="view_company" action="hide">
          <DataTable
            columns={columns}
            data={data}
            conditionalRowStyles={conditionalRowStyles}
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
        </Permission>}
        {activeButton === "all" && <Permission requiredPermission="view_users" action="hide">
          <DataTable
            columns={columns1}
            data={data1}
            conditionalRowStyles={conditionalRowStyles}
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
        </Permission>}
        {activeButton === "branch" && <Permission requiredPermission="add_branch" action="hide">
          <DataTable
            columns={columns_branch}
            data={branchdata}
            conditionalRowStyles={conditionalBranchStyles}
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
        </Permission>}
        {activeButton === "role" && <Permission requiredPermission="add_role" action="hide">
          <DataTable
            columns={columnRole}
            data={roles}
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
        </Permission>}
      </div>

      {/* <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        aria-labelledby="deleteRoleModalLabel"
      >
        <Modal.Header closeButton>
          <Modal.Title id="deleteRoleModalLabel">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this role?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteRole(roleToDelete)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Permission requiredPermission="view_company" action="hide">
            <p>
              Do you want to{" "}
              {data.find((user) => user.id === selectedUserId)?.is_active
                ? "deactivate"
                : "activate"}{" "}
              this company?
            </p>
          </Permission>

          <Permission requiredPermission="view_users" action="hide">
            <p>
              Do you want to{" "}
              {data1.find((user) => user.id === selectedUserId)?.is_active
                ? "deactivate"
                : "activate"}{" "}
              this user?
            </p>
          </Permission>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleStatusToggle}
            style={{ marginRight: "10px" }}
          >
            Yes
          </Button>
          <Button variant="danger" onClick={() => setShowConfirmModal(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showBranchModal}
        onHide={() => setShowBranchModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Permission requiredPermission="add_branch" action="hide">
            <p>
              Do you want to{" "}
              {branchdata.find((branch) => branch.id === selectedBranchId)?.status
                ? "deactivate"
                : "activate"}{" "}
              this branch?
            </p>
          </Permission>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleBranchToggle}
            style={{ marginRight: "10px" }}
          >
            Yes
          </Button>
          <Button variant="danger" onClick={() => setShowBranchModal(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      

      {(showPage || addUser) && (
        <div className="overlay" onClick={handleCancel}></div>
      )}
      {addUser && <AddAdmin onCancel={handleCancel} onUserAdded={fetchData} />}
      {addRole && <AddRole onCancel={handleCancel} onUserAdded={fetchRoles} />}
      {addUsers && <AddUser onCancel={handleCancel} onUserAdded={fetchUserData} />}
      {addBranch && <AddBranch onCancel={handleCancel} onBranch={fetchBranch} />}
      {editrole && <EditRole onCancel={handleCancel} onRole={fetchRoles} roledata={roledata} />}
      {editbranch && <EditBranch onCancel={handleCancel} onBranch={fetchBranch} branchData={branch} />}
      {editUser && (
        <EditUser
          onCancel={() => {
            setEditUser(false);
            setSelectedUser(null);
          }}
          onUserUpdated={() => {
            fetchUsers();
          }}
          userData={selectedUser}
        />
      )}
    </div>
  );
};

export default Usermanagement;
