import React, { useEffect, useRef, useState, useContext } from "react";

import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContext from "../../Shared modules/Context management/authContext";

const Dashboard = () => {
  const [selectedAssignedToId, setSelectedAssignedToId] = useState("");
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { permissions } = useContext(AuthContext);
  const hasClaimAssignmentPermission =
    permissions.includes("claim_assignment") ||
    permissions.includes("view_others_dashboard");

  // useEffect(() => {
  //   // AssignLoad();
  //   //<Permission requiredPermission="claim_assignment" action="hide">
  //   fetchAssignedToOptions();
  //   //</Permission>;
  // }, []);
  useEffect(() => {
    document.title = "Subrogation Management";
    if (hasClaimAssignmentPermission) {
      fetchAssignedToOptions();
    }
  }, [hasClaimAssignmentPermission]);

  const fetchAssignedToOptions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/assignedto");
      if (response.status === 200) {
        setAssignedToOptions(response.data);
        const selectedAssignedTo = response.data.find(
          (option) => option.first_name === location.state?.selectedAssignedTo
        );
        if (selectedAssignedTo) {
          setSelectedAssignedToId(selectedAssignedTo.id);
        }
      } else {
        setError(
          `Failed to fetch assigned to options. Status code: ${response.status}`
        );
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignedToChange = (e) => {
    //   fetchAssignedToOptions();
    const selectedId = parseInt(e.target.value);
    setSelectedAssignedToId(selectedId);
  };

  const AssignLoad = () => {
    fetchAssignedToOptions();
  };
  const [data, setData] = useState({
    ActiveClaim: 0,
    DemandLetter: 0,
    OverdueClaims: 0,
    PriorityOverdueClaims: 0,
  });
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let analystId = isNaN(selectedAssignedToId) ? "" : selectedAssignedToId;
        const response = await axiosInstance.get(
          `/dashboard/dashboardsummary?analyst_id=${analystId}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // AssignLoad();
    fetchData();
  }, [selectedAssignedToId]);

  const navigate = useNavigate();

  return (
    <div className="container">
      
    </div>
  );
};

export default Dashboard;
