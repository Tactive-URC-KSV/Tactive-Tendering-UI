import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, Scale, Handshake, Gavel, CreditCard, Paperclip,FileText,FileSpreadsheet,Download} from "lucide-react";

function TenderOffers({ projectId }) {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setProjectData(res.data);
        }
      } catch (err) {
        console.error("Error fetching project info:", err);
      }
    };

    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

 const contractors = [
    { 
      id: 1, 
      name: "Build Tech Solutions", 
      tenderId: "TF-2025-001", 
      amount: "$1,250,000.00", 
      date: "December 25, 2025", 
      status: "Received",
      tenderName: "Structural Steel Works"
    },
    { 
      id: 2, 
      name: "Electro Tech Inc", 
      tenderId: "TF-2025-001", 
      amount: "$1,400,000.00", 
      date: "December 29, 2025",  
      status: "Received",
      tenderName: "Structural Steel Works"
    },
    { 
      id: 3, 
      name: "Apex Constructions", 
      tenderId: "TF-2025-001", 
      amount: null, 
      date: "December 29, 2025", 
      status: "Pending",
      tenderName: "Structural Steel Works"
    }
  ];
  const [selectedOffer, setSelectedOffer] = useState(contractors[0]);

  const boqItems = [
  { code: "a", name: "Upto 1.5m depth", unit: "Cum", quantity: 3922.49364, rate: 5500, amount: 825000 },
  { code: "b", name: "From 1.5m to 3m depth", unit: "Cum", quantity: 2941.87023, rate: 4800, amount: 384000 },
  { code: "c", name: "From 3.1m to 4.5m depth", unit: "Cum", quantity: 588.443895, rate: 83.60, amount: 41800 },
  { code: "d", name: "From 4.6m to 6.0m depth", unit: "Cum", quantity: 1200, rate: 1200, amount: 1200 },
  ];
const totalOfferAmount = boqItems.reduce((acc, item) => acc + item.amount, 0);
  
return (
    <div className="container-fluid p-4">
      <div className="col-12 mx-auto">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
          <div className="d-flex align-items-start gap-3">
            <ArrowLeft
              size={22}
              className="mt-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/receivingoffers")}
            />
            <div className="text-start">
              <h5 className="fw-bold mb-1">Received Offers</h5>
              <div className="text-muted fw-semibold" style={{ fontSize: "14px" }}>
                Project : {projectData ? `${projectData.projectName} (${projectData.projectCode})` : "Loading..."}
              </div>
            </div>
          </div>

          <button
            className="btn text-white fw-semibold d-flex align-items-center gap-2 px-3 py-2 "
            style={{ backgroundColor: "#005197CC", borderRadius: "8px" }}
            onClick={() => navigate(`/tenderfloating/${projectId}`)}
          >
            <Plus size={18} /> Float New Tender
          </button>
        </div>

        <div className="bg-transparent rounded-3 d-flex flex-column w-100"
          style={{border: "1px solid #0051973D",  height: "calc(130vh - 165px)",  overflow: "hidden" }}>
          <div className="row g-0 h-100 flex-nowrap">
            
            <div className="col-4 bg-white  p-4 rounded-start-3 overflow-auto" 
              style={{ height: "110vh", scrollbarWidth: "none", msOverflowStyle: "none", borderRight: "1px solid #0051973D" }}>
  
              <div className="position-relative mb-4">
                <div className="position-absolute top-0 end-0 px-3 py-1 text-white fw-bold" 
                 style={{  backgroundColor: "#005197",  borderBottomLeftRadius: "20px",  borderTopRightRadius: "8px",  fontSize: "12px",  zIndex: 2 }}>
                 2 Offers
                </div>

                <div className="p-3 rounded-3" 
                 style={{ backgroundColor: "#F3F8FF",  border: "1px solid #00519780" }}>
                  <div className="text-start mb-3 ms-1">
                   <h5 className="fw-bold mb-1" style={{ color: "#005197", fontSize: "1.25rem" }}>TF - 2025 - 001</h5>
                   <p className="fw-bold text-dark mb-0" style={{ fontSize: "15px", opacity: 0.8 }}>Structural Steel Works</p>
                  </div>
                  {contractors.map((item, index) => {
                  const isSelected = selectedOffer?.name === item.name;
                  return (
                    <div key={index}
                     className="bg-white rounded-2 p-3 d-flex justify-content-between align-items-center mb-3" 
                     onClick={() => setSelectedOffer(item)}
                     style={{ cursor: "pointer", border: isSelected ? "none" : "1px solid #2563EB3D", borderLeft: isSelected ? "5px solid #005197" : "1px solid #E5E7EB" }} >
                     <div className="text-start">
                      <div className="fw-bold text-dark mb-1" style={{ fontSize: "15px" }}>
                        {item.name}
                      </div>
                      <div className="text-muted" style={{ fontSize: "11px" }}>
                       Offer Received : {item.date}
                      </div>
                     </div>

                      <div className="d-flex align-items-center gap-1">
                       {item.status === "Pending" ? (
                       <span className="badge rounded-pill px-3 py-1" 
                         style={{ backgroundColor: "#FFFBEB", color: "#F59E0B", fontWeight: "600", fontSize: "11px" }}>
                         Pending
                       </span>
                       ) : (
                       <>
                        <div className="fw-bold" style={{ fontSize: "15px", color: isSelected ? "#2563EB" : "#6c757d" }}>
                         {item.amount}
                        </div>
                        {isSelected && (
                        <span className="fw-bold" style={{ color: "#2563EB", fontSize: "14px", marginLeft: "4px" }}>
                          ›
                        </span>
                        )}
                       </>
                       )}
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
              <div className="position-relative mb-4">
                <div className="position-absolute top-0 end-0 px-3 py-1 fw-bold text-primary bg-primary bg-opacity-10" 
                 style={{  borderBottomLeftRadius: "20px",  borderTopRightRadius: "8px",  fontSize: "12px"  }}>
                 1 Offer
                </div>

                <div className="bg-white rounded-3 p-3 text-center" 
                 style={{  border: "1px solid #2563EB29" }}>
                 <h5 className="fw-bold text-dark mb-1 text-start" style={{ fontSize: "16px" }}>
                   TF - 2025 - 002
                 </h5>
                 <p className="text-secondary mb-0 fw-medium text-start" style={{ fontSize: "14px" }}>
                   HVAC System Installation
                 </p>
                </div>
              </div>
            </div>

            <div className="col-8 d-flex flex-column bg-light rounded-end-3 overflow-hidden">
              <div className="bg-white px-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
                style={{ minHeight: "95px", borderTopRightRadius: "8px" }}>
                <div className="text-start">
                 <h5 className="mb-1 fw-bold text-dark" style={{ fontSize: "1.2rem", letterSpacing: "-0.3px" }}>
                    Offer from {selectedOffer?.name}
                 </h5>
                 <div className="text-muted fw-medium" style={{ fontSize: "14px" }}>
                    For Tender : {selectedOffer?.id} - {selectedOffer?.tenderName}
                 </div>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                 
    <button 
      className="btn d-flex align-items-center gap-2 fw-bold px-3 py-2 border-0 text-nowrap"
      style={{ backgroundColor: "#F3F4F6", color: "#374151", borderRadius: "8px", fontSize: "14px" }}
      onClick={() => {
        navigate(`/receivingoffers/${projectId}/compare`, { 
          state: { defaultSelectedId: selectedOffer.id } 
        });
      }}
    >
      <Scale size={18} /> Compare
    </button>

                    <button className="btn d-flex align-items-center gap-2 fw-bold px-3 py-2 border-0  text-nowrap"
                      style={{ backgroundColor: "#EFF6FF", color: "#2563EB", borderRadius: "8px", fontSize: "14px" , cursor:"default"}}>
                      <Handshake size={18} /> Negotiate
                    </button>

                    <button className="btn text-white d-flex align-items-center gap-2 fw-bold px-4 py-2 border-0  text-nowrap"
                      style={{ backgroundColor: "#10B981", borderRadius: "8px", fontSize: "14px", cursor:"default" }}>
                      <Gavel size={18} /> Award
                    </button>
                </div>
              </div>
              <div className="flex-grow-1 p-4 overflow-auto scroll-container"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <style>
                  {`
                    .scroll-container::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>

             <div className="flex-grow-1 p-2 overflow-auto scroll-container"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
  
                  <div className="bg-white p-4 rounded-3  " style={{ border: "1px solid #0051973D" }}>
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                        style={{ width: "20px", height: "20px", backgroundColor: "#2563EB" }}>
                        <span className="text-white fw-bold" style={{ fontSize: "11px" }}>i</span>
                      </div>
                      <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "16px" }}>Tender & Offer Information</h6>
                    </div>

                    <div className="row g-4 text-start">
      
                      <div className="col-md-3">
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Tender Number</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Received Through</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                        <div>
                          <div className="text-muted small mb-1">Contact Person</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Tender Name</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Contractor</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                        <div>
                          <div className="text-muted small mb-1">Contact Number</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Submission Last Date</div>
                         <div className="fw-bold text-dark">—</div>
                        </div>
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Offer Number</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                        <div>
                          <div className="text-muted small mb-1">Contact Email ID</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Offer Received Date</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                        <div className="mb-4">
                          <div className="text-muted small mb-1">Offer Date</div>
                          <div className="fw-bold text-dark">—</div>
                        </div>
                      </div>
                    </div>
                  </div>
                

                <div className="container-fluid mt-4 p-1">
                  <div className="rounded-3 p-4 text-white"
                    style={{background: "linear-gradient(135deg, #0052A0, #007BFF)",border:"1px solid #2563EB"}}>
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <h5 className="mb-0 fw-semibold"> Offer Details (BOQ)</h5>
                      <div className="text-end">
                        <div className="small opacity-75">
                          Total Offer Amount
                        </div>
                        <div className="fs-4 fw-bold">
                          ₹{totalOfferAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-4 overflow-hidden">
                      <div className="table-responsive">
                        <table className="table align-middle mb-0 border-0">
                          <thead className="text-white"
                            style={{ background: "linear-gradient(to right, #047BE2, #2990FF)", border: "none", }}>
                            <tr className="text-center">
                              <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>BOQ Code</th>
                              <th className="py-3 fw-bold text-start border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>BOQ Name</th>
                              <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Unit</th>
                              <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Quantity</th>
                              <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Rate</th>
                              <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Amount</th>
                            </tr>
                          </thead>

                          <tbody className="text-center">
  {boqItems.map((item, index) => (
    <tr key={index}>
      <td className="py-3 text-muted border-0">{item.code}</td>
      <td className="py-3 text-start text-dark fw-medium border-0">{item.name}</td>
      <td className="py-3 text-muted border-0">{item.unit}</td>
      <td className="py-3 text-muted border-0">{item.quantity}</td>
      <td className="py-3 text-muted border-0">
        {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </td>
      <td className="py-3 text-dark fw-bold border-0">
        {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </td>
    </tr>
  ))}
</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-3   mt-4 text-start" style={{ border: "1px solid #0051973D" }}>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <div className="bg-primary rounded-1 d-flex align-items-center justify-content-center" 
                      style={{ width: "24px", height: "24px", backgroundColor: "#2563EB" }}>
                      <CreditCard size={14} className="text-white" /> 
                    </div>
                    <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "18px" }}>Payment Terms</h6>
                  </div>

                  <div className="ps-1">
                    <h6 className="fw-bold text-dark mb-2" style={{ fontSize: "16px" }}>
                      Standard Payment Template (Net 45)
                    </h6>
                    <p className="text-muted small mb-4">
                      The following terms apply upon awarding the contract...
                    </p>

                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex align-items-start gap-2">
                        <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>•</span>
                        <div style={{ fontSize: "14px" }}>
                          <span className="fw-bold text-dark">20% Advance Payment :</span>
                          <span className="text-muted ms-1">Due upon contract signing.</span>
                        </div>
                      </li>
                      <li className="mb-3 d-flex align-items-start gap-2">
                        <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>•</span>
                        <div style={{ fontSize: "14px" }}>
                          <span className="fw-bold text-dark">40% Mobilization Payment :</span>
                          <span className="text-muted ms-1">Due upon mobilization of resources to the site.</span>
                        </div>
                      </li>
                      <li className="mb-3 d-flex align-items-start gap-2">
                        <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>•</span>
                        <div style={{ fontSize: "14px" }}>
                          <span className="fw-bold text-dark">30% Progress Payment :</span>
                          <span className="text-muted ms-1">Billed monthly based on work completed, certified by the project manager.</span>
                        </div>
                      </li>
                      <li className="mb-3 d-flex align-items-start gap-2">
                        <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>•</span>
                        <div style={{ fontSize: "14px" }}>
                          <span className="fw-bold text-dark">10% Final Payment :</span>
                          <span className="text-muted ms-1">Due upon successful project completion and handover.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-3 mt-4 text-start" style={{ border: "1px solid #0051973D" }}>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <Paperclip size={20} className="text-primary" style={{ transform: 'rotate(45deg)' }} />
                    <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "18px" }}>Attachments</h6>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 rounded-3 d-flex align-items-center justify-content-between" 
                        style={{ backgroundColor: "#F8FAFC", }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-white p-2 rounded-2 ">
                           <FileText size={24} className="text-danger" />
                          </div>
                          <div>
                           <div className="fw-bold text-dark mb-0" style={{ fontSize: "15px" }}>Technical Specifications</div>
                           <div className="text-muted small">pdf <span className="mx-1">•</span> 4.2 MB</div>
                          </div>
                        </div>
                        <button className="btn p-1 border-0 text-primary">
                          <Download size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 rounded-3 d-flex align-items-center justify-content-between" 
                        style={{ backgroundColor: "#F8FAFC",  }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-white p-2 rounded-2 ">
                            <FileSpreadsheet size={24} className="text-success" />
                          </div>
                          <div>
                           <div className="fw-bold text-dark mb-0" style={{ fontSize: "15px" }}>Commercial Conditions</div>
                           <div className="text-muted small">pdf <span className="mx-1">•</span> 4.2 MB</div>
                          </div>
                        </div>
                        <button className="btn p-1 border-0 text-primary">
                          <Download size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 rounded-3 d-flex align-items-center justify-content-between" 
                        style={{ backgroundColor: "#F8FAFC", }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-white p-2 rounded-2 ">
                            <FileText size={24} className="text-secondary" />
                          </div>
                          <div>
                            <div className="fw-bold text-dark mb-0" style={{ fontSize: "15px" }}>Others</div>
                            <div className="text-muted small">pdf <span className="mx-1">•</span> 4.2 MB</div>
                          </div>
                        </div>
                        <button className="btn p-1 border-0 text-primary">
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
);
}

export default TenderOffers;