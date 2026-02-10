import React, { useState, useEffect } from "react";
import { ArrowLeft, Info, Scale, Square, CheckSquare, X, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function CompareOffers() {
  const navigate = useNavigate();
  const { projectId, tenderId, offerId } = useParams();

  const [tenderData, setTenderData] = useState(null);
  const [offersList, setOffersList] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const COL_WIDTHS = {
    col1: "250px",
    col2: "100px",
    col3: "150px",
  };

  useEffect(() => {
    if (offerId) {
      setSelectedSuppliers([offerId]);
    }
  }, [offerId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const tenderRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tenderDetails/${tenderId}`,
          { headers }
        );

        if (tenderRes.status === 200) {
          setTenderData(tenderRes.data);
        }

        const offersRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tender-offers/${tenderId}`,
          { headers }
        );

        if (offersRes.status === 200) {
          setOffersList(offersRes.data);
        }
      } catch (err) {
        console.error("Error fetching comparison data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tenderId) {
      fetchData();
    }
  }, [tenderId]);

  const toggleSupplier = (id) => {
    if (id === offerId) return;

    setSelectedSuppliers((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const calculateOfferTotal = (offer) => {
    if (!offer?.offerQuotations) return 0;
    return offer.offerQuotations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const selectedOffersData = offersList.filter(offer => selectedSuppliers.includes(offer.id));
  const boqItems = tenderData?.boq || [];

  return (
    <div className="container-fluid p-4" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <div className="col-12 mx-auto">
        <div className="d-flex align-items-start gap-3 p-4 mt-3 flex-shrink-0">
          <ArrowLeft
            size={20}
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
                <div className="fw-semibold">{tenderData?.tenderNumber || "-"}</div>
              </div>
              <div className="col-md-3">
                <div className="text-muted">Tender Name</div>
                <div className="fw-semibold">{tenderData?.tenderName || "-"}</div>
              </div>
              <div className="col-md-3">
                <div className="text-muted">Submission Last Date</div>
                <div className="fw-semibold">{formatDate(tenderData?.lastDate)}</div>
              </div>
              <div className="col-md-3">
                <div className="text-muted">Floated Date</div>
                <div className="fw-semibold">{formatDate(tenderData?.floatedOn)}</div>
              </div>
            </div>

            <div className="ps-5 text-start">
              <div className="text-muted mb-3" style={{ fontSize: "16px" }}>Scope of Packages</div>
              <div className="d-flex flex-wrap gap-2">
                {tenderData?.scopeOfPackages && tenderData.scopeOfPackages.length > 0 ? (
                  tenderData.scopeOfPackages.map((pkg, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-pill fw-semibold"
                      style={{
                        backgroundColor: "#EAF2FE",
                        color: "#005197",
                        fontSize: "14px"
                      }}
                    >
                      {pkg.scope}
                    </span>
                  ))
                ) : (
                  <span className="fw-semibold">-</span>
                )}
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

            <div className="ps-5">
              {Object.entries(
                offersList.reduce((acc, offer) => {
                  const name = offer.contractor?.entityName || "Unknown Contractor";
                  if (!acc[name]) acc[name] = [];
                  acc[name].push(offer);
                  return acc;
                }, {})
              ).map(([contractorName, offers]) => (
                <div key={contractorName} className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{ width: "32px", height: "32px", backgroundColor: "#005197", fontSize: "0.9rem", fontWeight: "600" }}>
                      {contractorName.charAt(0)}
                    </div>
                    <h6 className="fw-bold mb-0 text-dark">{contractorName}</h6>
                    <span className="badge bg-light text-primary border rounded-pill ms-2">
                      {offers.length} Offer{offers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="row g-3">
                    {offers.map((offer) => (
                      <div key={offer.id} className="col-md-5">
                        <div
                          className="p-3 rounded-3 d-flex align-items-center bg-white"
                          style={{
                            cursor: offer.id === offerId ? "default" : "pointer",
                            border: selectedSuppliers.includes(offer.id)
                              ? "1.5px solid #005197"
                              : "1px solid #E5E7EB",
                            backgroundColor: selectedSuppliers.includes(offer.id) ? "#F8FBFF" : "#FFFFFF",
                            transition: "all 0.2s ease"
                          }}
                          onClick={() => toggleSupplier(offer.id)}
                        >
                          <div className="me-3 d-flex align-items-center">
                            {selectedSuppliers.includes(offer.id) ? (
                              <CheckSquare size={18} strokeWidth={2} color="#FFFFFF" fill="#005197" />
                            ) : (
                              <Square size={18} strokeWidth={2} color="#9CA3AF" />
                            )}
                          </div>
                          <div className="flex-grow-1 text-start">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                                Offer v{offer.offerVersion || 1}
                              </span>
                              <span className="fw-bold text-primary">
                                ₹ {calculateOfferTotal(offer).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                              <span>Received: {formatDate(offer.submittedOn)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedSuppliers.length > 0 && (
          <>
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
                  style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  <style>
                    {`
                    .table-responsive::-webkit-scrollbar {
                      display: none;
                    }
                    .sticky-col {
                      position: sticky !important;
                      z-index: 10;
                    }
                    `}
                  </style>

                  <table className="table table-borderless align-middle mb-0" style={{ minWidth: "max-content" }}>
                    <thead>
                      <tr className="text-center">
                        <th className="ps-4 py-4 text-start border-end sticky-col"
                          style={{
                            left: 0,
                            width: COL_WIDTHS.col1,
                            minWidth: COL_WIDTHS.col1,
                            backgroundColor: "#EFF6FF"
                          }}>
                          BOQ Details
                        </th>
                        <th className="py-4 sticky-col border-end"
                          style={{
                            left: COL_WIDTHS.col1,
                            width: COL_WIDTHS.col2,
                            minWidth: COL_WIDTHS.col2,
                            backgroundColor: "#EFF6FF"
                          }}>
                          Quantity
                        </th>
                        <th className="py-4 border-end sticky-col"
                          style={{
                            left: `calc(${COL_WIDTHS.col1} + ${COL_WIDTHS.col2})`,
                            width: COL_WIDTHS.col3,
                            minWidth: COL_WIDTHS.col3,
                            backgroundColor: "#EFF6FF"
                          }}>
                          Internal Estimate Rate
                        </th>

                        {selectedOffersData.map((supplier) => (
                          <th key={supplier.id} className="p-0 border-end" style={{ minWidth: "400px", backgroundColor: "#EFF6FF" }}>
                            <div className="d-flex justify-content-between align-items-center px-3 py-2 text-primary text-start" style={{ backgroundColor: "#EFF6FF" }}>
                              <span className="fw-bold small">{supplier.contractor?.entityName}</span>
                              {supplier.id !== offerId && (
                                <button className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
                                  onClick={() => toggleSupplier(supplier.id)}
                                  style={{ border: 'none', background: 'none' }} >
                                  <X size={16} className="text-danger" />
                                </button>
                              )}
                            </div>
                            <div className="d-flex text-muted fw-semibold" style={{ fontSize: "14px", backgroundColor: "#EFF6FF" }}>
                              <div className="flex-fill py-2 text-center" style={{ width: "33.33%" }}>Offer Qty</div>
                              <div className="flex-fill py-2 text-center" style={{ width: "33.33%" }}>Rate</div>
                              <div className="flex-fill py-2 text-center" style={{ width: "33.33%" }}>Amount</div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {boqItems.map((boq, idx) => (
                        <tr key={boq.id || idx} className="text-center">
                          <td className="ps-4 text-start border-end sticky-col"
                            style={{
                              left: 0,
                              backgroundColor: "#FFFFFF"
                            }}>
                            <div className="fw-bold text-dark">{boq.boqCode}</div>
                            <div className="text-muted small" title={boq.boqName}>
                              {boq.boqName?.length > 30 ? boq.boqName.substring(0, 30) + "..." : boq.boqName}
                            </div>
                          </td>
                          <td className="text-dark sticky-col border-end"
                            style={{
                              left: COL_WIDTHS.col1,
                              backgroundColor: "#FFFFFF"
                            }}>
                            {boq.quantity}
                          </td>
                          <td className="border-end text-dark sticky-col"
                            style={{
                              left: `calc(${COL_WIDTHS.col1} + ${COL_WIDTHS.col2})`,
                              backgroundColor: "#FFFFFF"
                            }}>
                            {(boq.totalRate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>

                          {selectedOffersData.map((supplier) => {
                            const quotation = supplier.offerQuotations.find(q => q.boq?.id === boq.id);
                            const isLowest = selectedOffersData.every(s => {
                              const otherQuote = s.offerQuotations.find(q => q.boq?.id === boq.id);
                              return !otherQuote || (quotation && quotation.rate <= otherQuote.rate);
                            });

                            return (
                              <td key={supplier.id} className="p-0 border-end" style={{ backgroundColor: "#EFF6FF" }}>
                                <div className="d-flex py-3 text-dark">
                                  <div className="flex-fill text-center" style={{ width: "33.33%" }}>{quotation?.quantity || "-"}</div>
                                  <div className="flex-fill text-center" style={{
                                    width: "33.33%",
                                    color: isLowest && quotation ? '#10B981' : 'inherit',
                                    fontWeight: isLowest && quotation ? 'bold' : 'normal'
                                  }}>
                                    {quotation ? quotation.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "-"}
                                  </div>
                                  <div className="flex-fill text-center" style={{ width: "33.33%" }}>
                                    {quotation ? quotation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "-"}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      <tr>
                        <td className="ps-4 py-3 fw-bold text-start text-dark sticky-col border-end"
                          style={{
                            left: 0,
                            position: 'sticky',
                            zIndex: 10,
                            backgroundColor: "#EFF6FF",
                            width: `calc(${COL_WIDTHS.col1} + ${COL_WIDTHS.col2})`,
                            maxWidth: `calc(${COL_WIDTHS.col1} + ${COL_WIDTHS.col2})`
                          }}
                          colSpan={2}>
                          Total Amount
                        </td>
                        <td className="text-center fw-bold text-primary border-end sticky-col"
                          style={{
                            left: `calc(${COL_WIDTHS.col1} + ${COL_WIDTHS.col2})`,
                            backgroundColor: "#EFF6FF",
                            fontSize: "15px"
                          }}>
                          {(tenderData?.boq?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        {selectedOffersData.map((supplier) => {
                          const total = calculateOfferTotal(supplier);
                          const isLowestTotal = selectedOffersData.every(s => calculateOfferTotal(s) >= total);

                          return (
                            <td key={supplier.id} className="p-0 border-end" style={{ backgroundColor: "#EFF6FF" }}>
                              <div className="d-flex py-3 fw-bold justify-content-center">
                                <div style={{ color: isLowestTotal ? "#10B981" : "#EA580C", fontSize: "18px" }}>
                                  {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card mx-4 mt-4 mb-5 rounded-3" style={{ border: "1px solid #0051973D" }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4 text-start">
                  <CreditCard size={20} className="text-primary me-2" />
                  <h6 className="fw-bold mb-0">Payment Terms Comparison</h6>
                </div>

                <div className="table-responsive" style={{ overflowX: "auto" }}>
                  <div className="d-flex" style={{ width: "max-content" }}>
                    {selectedOffersData.map((supplier, index) => (
                      <div key={supplier.id} className={`p-3 ${index !== selectedOffersData.length - 1 ? 'border-end' : ''}`}
                        style={{ width: "400px", minWidth: "400px" }}>
                        <div className="fw-bold text-primary mb-3 text-center p-2 rounded" style={{ backgroundColor: '#EFF6FF' }}>
                          {supplier.contractor?.entityName}
                        </div>
                        <div className="text-start">
                          {supplier.paymentTerms && supplier.paymentTerms.length > 0 ? (
                            <ul className="list-unstyled">
                              {supplier.paymentTerms.map((term, i) => (
                                <li key={i} className="mb-3 d-flex align-items-start gap-2 small text-dark">
                                  <span className="text-primary fw-bold mt-1">•</span>
                                  <span>{term}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted small text-center fst-italic py-4">No payment terms listed.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default CompareOffers;