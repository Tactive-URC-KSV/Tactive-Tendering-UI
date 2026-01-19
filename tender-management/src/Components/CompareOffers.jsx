import React, { useState } from "react";
import { ArrowLeft, Info, Scale, Square, CheckSquare , X} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; 

function CompareOffers() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedId = location.state?.defaultSelectedId;

  const tenderOffers = [
    {id: 1, supplierName: "Build Tech Solutions", amount: 1250000, status: "SUBMITTED", date: "December 25, 2025",},
    {id: 2, supplierName: "Electro Tech Inc", amount: 1400000,status: "APPROVED", date: "December 29, 2025",},
    {id: 3,supplierName: "Apex Constructions", amount: null, status: "PENDING",date: "December 30, 2025",},
  ];

  const nonPendingOffers = tenderOffers.filter(
    (offer) => offer.status !== "PENDING"
  );

  const [selectedSuppliers, setSelectedSuppliers] = useState(() => {
    if (passedId) {
      const isValid = nonPendingOffers.some((o) => o.id === passedId);
      if (isValid) return [passedId];
    }
    return nonPendingOffers.length > 0 ? [nonPendingOffers[0].id] : [];
  });

 const toggleSupplier = (id) => {
  if (id === passedId) return;

  setSelectedSuppliers((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
  );
};

  return (
    <div className="container-fluid p-4">
      <div className="col-12 mx-auto">
        <div className="d-flex align-items-start gap-3 p-4 mt-3 flex-shrink-0">
          <ArrowLeft
            size={22}
            className="mt-1"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <div className="text-start">
            <h5 className="fw-bold mb-1">Compare Offers</h5>
            <div className="text-muted fw-semibold" style={{ fontSize: "14px" }}>
              Side-by-side comparison of contractor proposals.
            </div>
          </div>
        </div>

       <div className="card mx-4 mt-3 rounded-3" style={{ border: "1px solid #0051973D" }}>
        <div className="card-body">
        <div className="d-flex align-items-center mb-4 text-start">
         <Info size={20} className="text-primary me-2" />
         <h6 className="fw-bold mb-0">Offer Details</h6>
        </div>

       <div className="row mb-4 ps-5 text-start">
         <div className="col-md-3">
           <div className="text-muted">Tender Number</div>
           <div className="fw-semibold">-</div>
         </div>
         <div className="col-md-3">
           <div className="text-muted">Tender Name</div>
           <div className="fw-semibold">-</div>
         </div>
         <div className="col-md-3">
           <div className="text-muted">Comparative Number</div>
           <div className="fw-semibold">-</div>
         </div>
         <div className="col-md-3">
           <div className="text-muted">Comparative Date</div>
           <div className="fw-semibold">-</div>
         </div>
       </div>

       <div className="ps-5 text-start">
         <div className="text-muted mb-3" style={{ fontSize: "16px" }}>Committee Members</div>
         <div className="d-flex flex-wrap gap-3">
           {["Jane Doe", "Henderson", "Robert Brown", "Darlene Robertson"].map((member, index) => (
             <div
              key={index}
              className="px-4 py-2 rounded-pill"
              style={{backgroundColor: "#EBF3FF", color: "#2563EB",    fontWeight: "500", fontSize: "14px", border: "none" }}>
              {member}
             </div>
           ))}
         </div>
        </div>
        </div>
       </div>

        <div className="card mx-4 mt-4 rounded-3" style={{ border: "1px solid #0051973D" }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4 text-start">
              <Scale size={20} className="text-primary me-2" />
              <h6 className="fw-bold mb-0">Select Suppliers to Compare</h6>
            </div>

            <div className="row ps-5 g-3">
              {nonPendingOffers.map((offer) => (
                <div key={offer.id} className="col-md-5">
                  <div
                    className="p-3 rounded-3 d-flex align-items-center"
                    style={{
                      cursor: offer.id === passedId ? "default" : "pointer",
                      border: selectedSuppliers.includes(offer.id)
                        ? "1.5px solid #005197"
                        : "1.5px solid #2563EB66",
                      backgroundColor: selectedSuppliers.includes(offer.id) ? "#F8FBFF" : "#FFFFFF",
                    }}
                    onClick={() => toggleSupplier(offer.id)}
                  >
                    <div className="me-3 d-flex align-items-center">
                      {selectedSuppliers.includes(offer.id) ? (
                        <CheckSquare size={18} strokeWidth={2} color="#FFFFFF" fill="#005197" />
                      ) : (
                        <Square size={18} strokeWidth={2} color="#005197B2" />
                      )}
                    </div>
                    <div className="flex-grow-1 text-start">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{offer.supplierName}</span>
                        <span>₹ {offer.amount?.toLocaleString()}</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        Offer Received : {offer.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

         {selectedSuppliers.length > 0 && (
          <div className="card mx-4 mt-4 rounded-3 overflow-hidden shadow-sm" style={{ border: "1px solid #0051973D" }}>
            <div className="card-body p-0">
              <div className="p-4 text-start">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Scale size={20} className="text-primary" />
                  <h6 className="fw-bold mb-0 text-dark">Offer Comparison</h6>
                </div>
                <div className="text-muted small ms-4">Comparing offers from selected contractors for each BOQ item...</div>
              </div>

              <div className="table-responsive" 
                style={{  overflowX: "auto", scrollbarWidth: "none",  msOverflowStyle: "none" }}>
                <style>
                  {`
                  .table-responsive::-webkit-scrollbar {
                  display: none;
                  }
                  `}
                </style>

                <table className="table table-borderless align-middle mb-0" style={{ minWidth: "max-content" }}>
                  <thead>
                    <tr className="text-center">
                      <th className="ps-4 py-4 text-start border-end" style={{ width: "200px", backgroundColor: "#EFF6FF" }}>BOQ Details</th>
                      <th className="py-4" style={{ backgroundColor: "#EFF6FF" }}>Quantity</th>
                      <th className="py-4 border-end" style={{ backgroundColor: "#EFF6FF" }}>Internal Estimate Rate</th>
              
                      {tenderOffers
                        .filter((o) => selectedSuppliers.includes(o.id))
                        .map((supplier) => (
                        <th key={supplier.id} className="p-0 border-end" style={{ minWidth: "500px", backgroundColor: "#EFF6FF" }}>
                          <div className="d-flex justify-content-between align-items-center px-3 py-2 text-primary text-start" style={{ backgroundColor: "#EFF6FF" }}>
                            <span className="fw-bold small">{supplier.supplierName}</span>
                            {supplier.id !== passedId && (
                            <button   className="btn btn-sm p-0 d-flex align-items-center justify-content-center" 
                              onClick={() => toggleSupplier(supplier.id)}
                              style={{ border: 'none', background: 'none' }} >
                              <X size={16} className="text-danger" />
                            </button>
                            )}
                          </div>
                          <div className="d-flex text-muted fw-semibold" style={{ fontSize: "14px", backgroundColor: "#EFF6FF" }}>
                            <div className="flex-fill py-2 text-center" style={{ width: "25%" }}>Offer Qty</div>
                            <div className="flex-fill py-2 text-center" style={{ width: "25%" }}>Rate</div>
                            <div className="flex-fill py-2 text-center" style={{ width: "25%" }}>Amount</div>
                            <div className="flex-fill py-2 text-center" style={{ width: "25%" }}>Payment Terms</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                   {[
                    { id: 'a', desc: 'Upto 1.5m depth', qty: '3922.49364', est: '6451.63', r1: '5,500.00', r2: '83.60', amt1: '825,000.00' },
                    { id: 'b', desc: 'Upto 1.5m depth', qty: '2941.87023', est: '3800.00', r1: '4,800.00', r2: '5,500.00', amt1: '384,000.00' },
                    { id: 'c', desc: 'Upto 1.5m depth', qty: '588.443895', est: '83.60', r1: '83.60', r2: '4,800.00', amt1: '41,800.00' },
                    { id: 'd', desc: 'Upto 1.5m depth', qty: '1200', est: '1200', r1: '1200', r2: '1200', amt1: '1200' },
                    ].map((row, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="ps-4 text-start border-end">
                        <div className="fw-bold text-dark">{row.id}</div>
                        <div className="text-muted small">{row.desc}</div>
                      </td>
                      <td className="text-dark">{row.qty}</td>
                      <td className="border-end text-dark">{row.est}</td>

                      {selectedSuppliers.map((sId) => (
                      <td key={sId} className="p-0 border-end" style={{ backgroundColor: "#EFF6FF" }}>
                        <div className="d-flex py-3 text-dark">
                          <div className="flex-fill text-center" style={{ width: "25%" }}>{row.qty}</div>
                          <div className="flex-fill  text-center" style={{  width: "25%", 
                             color: (sId === 1 && idx === 0) ? '#10B981' : 
                              (sId === 1 && idx === 1) ? '#EA580C' : 
                              (sId === 2 && idx === 2) ? '#10B981' : 'inherit'
                              }}>
                           {sId === 1 ? row.r1 : row.r2}
                          </div>
                          <div className="flex-fill text-center" style={{ width: "25%" }}>{row.amt1}</div>
                          <div className="flex-fill text-muted text-center" style={{ width: "25%" }}>Net 45</div>
                        </div>
                      </td>
                      ))}
                    </tr>
                    ))}
            
                    <tr>
                      <td colSpan={2} className="ps-4 py-3 fw-bold text-start text-dark" style={{ backgroundColor: "#EFF6FF" }}>Total Amount</td>
                      <td className="text-center fw-bold text-primary border-end" style={{ fontSize: "15px", backgroundColor: "#EFF6FF" }}>67,500.00</td>
                        {selectedSuppliers.map((sId) => (
                        <td key={sId} className="p-0 border-end" style={{ backgroundColor: "#EFF6FF" }}>
                        <div className="d-flex py-3 fw-bold justify-content-center">
                          <div style={{ color: sId === 1 ? "#10B981" : "#EA580C", fontSize: "18px"}}>
                            {sId === 1 ? "1,250,800.00" : "1,400,000.00"}
                          </div>
                        </div>
                      </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )}
      </div>
    </div>
  );
}

export default CompareOffers;