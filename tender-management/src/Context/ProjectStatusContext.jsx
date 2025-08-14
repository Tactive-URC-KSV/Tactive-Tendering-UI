import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";

const ProjectStatusContext = createContext([]);

export const useProjectStatus = () => useContext(ProjectStatusContext);


const StatusConfigColors = [
  { bgColor: '#EFF6FF', textColor: '#2563EB' },
  { bgColor: '#FAF5FF', textColor: '#9333EA' },
  { bgColor: '#FFF7ED', textColor: '#EA580C' },
  { bgColor: '#FEFCE8', textColor: '#CA8A04' },
  { bgColor: '#EEF2FF', textColor: '#4F46E5' },
  { bgColor: '#FFF7ED', textColor: '#EA580C' },
  { bgColor: '#F0FDF4', textColor: '#2BA95A' },
];
export const ProjectStatusProvider = ({ children }) => {
  const [projectStatus, setProjectStatus] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/project-status`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const enrichedStatus = response.data.map((status, index) => {
          const { bgColor, textColor } = StatusConfigColors[index % StatusConfigColors.length];
          return {
            ...status,
            bgColor,
            textColor,
          };
        });
        setProjectStatus(enrichedStatus);
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
