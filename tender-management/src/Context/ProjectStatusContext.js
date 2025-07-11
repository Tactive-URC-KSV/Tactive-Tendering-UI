import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";

const ProjectStatusContext = createContext([]);

export const useProjectStatus = () => useContext(ProjectStatusContext);

export const ProjectStatusProvider = ({ children }) => {
  const [projectStatus, setProjectStatus] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}project-status`)
      .then((response) => {
        setProjectStatus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projectStatus:", error);
      });
  }, []);

  return (
    <ProjectStatusContext.Provider value={projectStatus}>
      {children}
    </ProjectStatusContext.Provider>
  );
};
