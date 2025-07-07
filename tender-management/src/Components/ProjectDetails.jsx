import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactComponent as ArrowLeft } from "../assest/ArrowLeft.svg"; // Assuming SVG icon path
import { ReactComponent as Edit } from "../assest/Edit.svg";
import { ReactComponent as EditBlue } from "../assest/Edit_Blue.svg";
import { ReactComponent as GeneralInfo } from "../assest/GeneralInfo.svg";
import { ReactComponent as TechnicalInfo } from "../assest/TechDetails.svg";
import { Link } from "react-router-dom";
import "../CSS/Styles.css";
function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const editDetails = () => {
    navigate(`/tactive/project/editProject/${projectId}`);
  };

  useEffect(() => {
    if (projectId) {
      axios
        .get(
          `http://localhost:8080/tactive/project/viewProjectInfo/${projectId}`
        )
        .then((res) => {
          if (res.status === 200) {
            setProject(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          setError("Failed to fetch project details. Please try again later.");
        });
    }
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>No project data available</div>;

  const generalInfo = [
    { label: "Project Name", value: project.projectName },
    { label: "Project Code", value: project.projectCode },
    { label: "Short Name", value: project.shortName },
    { label: "Agreement Date", value: project.agreementDate },
    { label: "Agreement Number", value: project.agreementNumber },
    { label: "Start Date", value: project.startDate },
    { label: "End Date", value: project.endDate },
    { label: "Sector", value: project.sector?.sectorName || "N/A" },
    { label: "Address", value: project.address },
    { label: "City", value: project.city },
    { label: "Region", value: project.region?.country || "N/A" },
    {
      label: "Scope of Packages",
      value:
        project.scopeOfPackages?.map((pkg) => pkg.scope).join(", ") || "N/A",
    },
  ];

  const technicalInfo = [
    { label: "Number of Floors", value: project.numberOfFloors || "N/A" },
    { label: "Car Parking Floors", value: project.carParkingFloors || "N/A" },
    { label: "Short Name", value: project.shortName },
    { label: "Agreement Date", value: project.agreementDate },
    { label: "Agreement Number", value: project.agreementNumber },
    { label: "Start Date", value: project.startDate },
    { label: "End Date", value: project.endDate },
    { label: "Sector", value: project.sector?.sectorName || "N/A" },
    { label: "Address", value: project.address },
    { label: "City", value: project.city },
    { label: "Region", value: project.region?.country || "N/A" },
    {
      label: "Scope of Packages",
      value:
        project.scopeOfPackages?.map((pkg) => pkg.scope).join(", ") || "N/A",
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row align-items-center mb-4">
        <div className="col-auto">
          <p className="fw-bold mb-0 "><ArrowLeft className="p-1"/>Project Details</p>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="btn action-button btn-sm me-1"
            onClick={editDetails}
          >
            <Edit />
            <span className="ms-2">Edit Project</span>
          </button>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-12 ms-auto me-3 rounded-3 card-dual-tone d-flex justify-content-between p-3">
          <div className="text-start">
            <h5>{project.projectName}</h5>
            <p>Project Code - {project.projectCode}</p>
          </div>
          <div className="text-end">
            {/* <span
              className="project-status badge text-light"
              style={{ backgroundColor: "#005197CC" }}
            >
              {
                statusList.find(
                  (status) => status.name === project.projectStatus
                )?.label
              }
            </span> */}
            <p>Project Code - {project.projectCode}</p>
          </div>
        </div>
      </div>
        <div className="row mb-4">
            <div className="col-lg-9 col-md-8  me-2 bg-white rounded-3 p-3">
    <div className="card-header1 d-flex justify-content-between align-items-center p-2">
              <h5>Project Information</h5>

        <Link to={`/ProjectManagement/project/${project.id}`} className='text-decoration-none small'><EditBlue/></Link>

      </div>
                
                <div className="text-start d-flex align-items-center p-2">
                <div className="mt-2">
                        <h5>
                        <GeneralInfo /> General Information
                    </h5>
                </div>
                </div>
                                <div className="mt-2 ms-2 text-start">
                       <div className="row">
            {generalInfo.map((item, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <div className="text-muted">{item.label}</div>
                <div className="fw-bold mt-1">{item.value}</div>
              </div>
            ))}
          </div> 

                         <div className=" card-lower1 text-start d-flex align-items-center p-2">
                <div className="mt-2">
                        <h5>
                        <TechnicalInfo /> Technical Details
                    </h5>
                </div>
                </div>
                                <div className="mt-2 ms-2 text-start">
                       <div className="row">
            {technicalInfo.map((item, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <div className="text-muted">{item.label}</div>
                <div className="fw-bold mt-1">{item.value}</div>
              </div>
            ))}
          </div> 
          </div>
                </div>
                </div>
            </div>
    </div>
    //     <div className="container-fluid">
    //       <div className="d-flex align-items-center mb-4">
    //         <ArrowLeft className="me-2" />
    //         <h3 style={{ color: '#1a1a1a', fontSize: '1.5rem', margin: 0 }}>Project Details</h3>
    //                         <div className="col-auto ms-auto">
    //                     <button className="btn action-button btn-sm me-1" onClick={editDetails}><Edit /><span className="ms-2">Edit Project</span></button>
    //                 </div>
    //       </div>

    // <div className="card mb-4" style={{ borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', padding: '15px', background: 'linear-gradient(to right, #0056b3, #007bff)' }}> {/* Added linear-gradient here */}
    //   <div className="d-flex justify-content-between align-items-center">
    //     <div>
    //       <h4 style={{ margin: 0 }}>{project.projectName}</h4>
    //       <p style={{ margin: '5px 0 0', fontSize: '0.9rem' }}>Project Code - {project.projectCode}</p>
    //     </div>
    //     <div className="text-end">
    //       <button className="btn btn-warning text-dark mb-2" style={{ borderRadius: '20px', padding: '5px 15px', fontSize: '0.85rem' }}>Yet to Start</button>
    //       <p style={{ margin: '5px 0 0', fontSize: '0.8rem', opacity: 0.8 }}>Created at: Jun 08, 2025</p>
    //     </div>
    //   </div>
    // </div>

    //       <div className=" mb-4" style={{ borderRadius: '8px', border: '1px solid #ddd' }}>
    //         <div className="card-header bg-white d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>
    //           <h5 style={{ fontWeight: 'bold', color: '#1a1a1a' }}>Project Information</h5>

    //           <Link to={`/ProjectManagement/project/${project.id}`} className='text-decoration-none small'><EditBlue/></Link>

    //         </div>
    //         <h5 className="d-flex align-items-center" style={{ fontWeight: 'bold', color: '#1a1a1a', margin: 0, marginLeft: '30px', marginTop: '20px', padding: '10px 0' }}>
    //           <GeneralInfo style={{ marginRight: '10px' }} /> General Information
    //         </h5>
    //         <div className="card-body p-4">
    //           <div className="row">
    //             {generalInfo.map((item, index) => (
    //               <div className="col-md-6 mb-3" key={index}>
    //                 <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>{item.label}</div>
    //                 <div style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{item.value}</div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //                 <div className="card-header bg-white d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #ddd', padding: '15px' }}>
    //         </div>
    //                 <h5 className="d-flex align-items-center" style={{ fontWeight: 'bold', color: '#1a1a1a', margin: 0, marginLeft: '30px', marginTop: '20px', padding: '10px 0' }}>
    //                     <TechnicalInfo style={{ marginRight: '10px' }} /> Technical Details
    //                 </h5>
    //                 <div className="card-body p-4">
    //           <div className="row">
    //             {technicalInfo.map((item, index) => (
    //               <div className="col-md-6 mb-3" key={index}>
    //                 <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>{item.label}</div>
    //                 <div style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{item.value}</div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
  );
}

export default ProjectDetails;
