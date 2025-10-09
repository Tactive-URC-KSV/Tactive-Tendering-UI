import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, Copy, ClipboardPasteIcon, EditIcon, Trash2, IndianRupee, BadgeDollarSign } from "lucide-react";
import ActivityCode from '../assest/ActivityCode.svg?react';
import ActivityView from "../assest/Activity.svg?react";
import Area from '../assest/Area.svg?react';
import Cost from '../assest/Cost.svg?react';
import TotalCost from '../assest/TotalCost.svg?react';
import { toast } from "react-toastify";
import ResourceModal from '../Utills/ResourceModal';
import useResourceModal from '../Utills/useResourceModal';

function TenderResource() {
  const { projectId, costCodeId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [estimatedResources, setEstimatedResources] = useState([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);

  const {
    costCode,
    resourceData,
    setResourceData,
    showResourceAdding,
    setShowResourceAdding,
    coEffdisabled,
    uomOption,
    resourceTypesOption,
    resourceNatureOption,
    resourceOption,
    quantityTypeOption,
    currencyOption,
    handleResourceTypeChange,
    handleQuantityTypeChange,
    handleCalculations,
    handleAddResource,
    fetchResource,
    openModal,
  } = useResourceModal(false);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.status === 200) {
        setProject(res.data);
        fetchEstimatedResources();
      }
    }).catch(err => {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        console.error(err);
        alert('Failed to fetch project information.');
      }
    });
  }, [projectId]);

  const fetchEstimatedResources = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/estimatedResources/${costCodeId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        setEstimatedResources(res.data);
        setSelectedResourceIds([]);
      }
    }).catch(err => {
      if (err?.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error(err?.response?.data?.message);
      }
    });
  };

  const handleCheckboxChange = (resourceId) => {
    setSelectedResourceIds(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedResourceIds.length === estimatedResources.length) {
      setSelectedResourceIds([]);
    } else {
      setSelectedResourceIds(estimatedResources.map(resource => resource.id));
    }
  };

  const handleCopyResources = () => {
    const selectedResources = estimatedResources.filter(resource => selectedResourceIds.includes(resource.id));
    if (selectedResources.length === 0) {
      toast.warn('No resources selected to copy.');
      return;
    }
    try {
      localStorage.setItem('resource', JSON.stringify(selectedResources));
      toast.success('Resources copied successfully');
    } catch (err) {
      toast.error('Failed to copy resources.');
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold text-start">
          <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
          <span className="ms-2">Activity Details</span>
        </div>
        <div className="me-3">
          <button className="btn import-button" onClick={openModal}><Plus size={20} /><span className="ms-2">Add Resource</span></button>
        </div>
      </div>
      <div className="bg-white rounded-3 ms-3 me-3 p-4" style={{ border: '1px solid #0051973D' }}>
        <div className="text-start fw-bold ms-3 mb-2">{`${project?.projectName || 'Loading...'} - (${project?.projectCode || ''})`}</div>
        <div className="row g-2 mb-4 ms-3">
          <div className="col-lg-4 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Activity Code</span>
                <ActivityCode />
              </div>
              <div className="fw-bold text-start mt-2">{costCode?.activityCode || 'N/A'}</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Activity Name</span>
                <ActivityView size={16} style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />
              </div>
              <div className="fw-bold text-start mt-2">{costCode?.activityName || 'N/A'}</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Unit of Measurement</span>
                <Area />
              </div>
              <div className="fw-bold text-start mt-2">{costCode?.uom?.uomName || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div className="row g-2 ms-3">
          <div className="col-lg-4 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Quantity</span>
                <TotalCost />
              </div>
              <div className="fw-bold text-start mt-2">{costCode?.quantity?.toFixed(3) || '0.000'}</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Rate</span>
                <Cost />
              </div>
              <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {costCode?.rate?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Amount</span>
                <BadgeDollarSign color="#005197" />
              </div>
              <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {costCode?.amount?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </div>
      </div>
      {estimatedResources?.length > 0 && (
        <div className="bg-white rounded-3 ms-3 me-3 p-4 mt-4" style={{ border: '1px solid #0051973D' }}>
          <div className="text-start d-flex justify-content-between align-items-center pb-3" style={{ borderBottom: '1px solid #0051973D' }}>
            <h6>Resource Details</h6>
            <div className="d-flex align-items-center">
              <button className="btn action-button me-2" onClick={handleCopyResources}><Copy size={20} /><span className="ms-2">Copy</span></button>
              <button className="btn action-button me-2"><ClipboardPasteIcon size={20} /><span className="ms-2">Paste</span></button>
            </div>
          </div>
          <div className="mt-4">
            <table className="table activity-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      style={{ borderColor: '#005197' }}
                      checked={selectedResourceIds.length === estimatedResources.length && estimatedResources.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Resource Type</th>
                  <th>Resource Name</th>
                  <th>UOM</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th><IndianRupee size={16} /><span>Total Cost</span></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {estimatedResources?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ borderColor: '#005197' }}
                        checked={selectedResourceIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                    <td>{item.resourceType.resourceTypeName}</td>
                    <td>{item.resource.resourceName}</td>
                    <td>{item.uom.uomCode}</td>
                    <td>{(item.netQuantity).toFixed(3)}</td>
                    <td>{(item.costUnitRate).toFixed(2)}</td>
                    <td>{(item.totalCostCompanyCurrency).toFixed(2)}</td>
                    <td>
                      <EditIcon size={20} color="#005197" className="me-2" style={{ cursor: 'pointer' }} />
                      <Trash2 size={20} color="red" className="me-2" style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ResourceModal
        showModal={showResourceAdding}
        setShowModal={setShowResourceAdding}
        resourceData={resourceData}
        setResourceData={setResourceData}
        resourceTypesOption={resourceTypesOption}
        resourceNatureOption={resourceNatureOption}
        resourceOption={resourceOption}
        uomOption={uomOption}
        quantityTypeOption={quantityTypeOption}
        currencyOption={currencyOption}
        coEffdisabled={coEffdisabled}
        handleResourceTypeChange={handleResourceTypeChange}
        handleQuantityTypeChange={handleQuantityTypeChange}
        handleCalculations={handleCalculations}
        handleAddResource={handleAddResource}
        fetchResource={fetchResource}
      />
    </div>
  );
}

export default TenderResource;