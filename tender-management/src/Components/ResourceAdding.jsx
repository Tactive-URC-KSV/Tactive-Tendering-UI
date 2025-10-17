import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ResourceModal from '../Utills/ResourceModal';
import useResourceModal from '../Utills/useResourceModal';
import { ArrowLeft, Plus, Copy, ClipboardPasteIcon, EditIcon, Trash2, IndianRupee } from 'lucide-react';
import ActivityCode from '../assest/ActivityCode.svg?react';
import ActivityView from "../assest/Activity.svg?react";

function ResourceAdding() {
  const { projectId, costCodeId, activityGroupId } = useParams();
  const isGlobal = !projectId;
  const idType = activityGroupId ? 'activityGroup' : costCodeId ? 'costCode' : null;
  const resourceId = activityGroupId || costCodeId;
  const [estimatedResources, setEstimatedResources] = useState([]);
  const navigate = useNavigate();
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
    openModal
  } = useResourceModal(isGlobal, resourceId, idType);
  useEffect(() => {
    fetchEstimatedResources();
  }, []);

  const fetchEstimatedResources = () => {
    if (!resourceId) return;

    const url = idType === 'activityGroup'
      ? `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/estimatedResourcesByActivityGroup/${resourceId}`
      : `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/estimatedResources/${resourceId}`;

    axios.get(url, {
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
        toast.error(err?.response?.data?.message || 'Failed to fetch resources.');
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
    <div className='container-fluid min-vh-100'>
      <div className='ms-3 d-flex justify-content-between align-items-center mb-4'>
        <div className='fw-bold text-start'>
          <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
          <span className='ms-2'>Global cost details</span>
        </div>
        <div className="me-3">
          <button className="btn import-button" onClick={openModal}><Plus size={20} /><span className="ms-2">Add Resource</span></button>
        </div>
      </div>
      <div className='bg-white rounded-3 ms-3 me-3 p-4' style={{ border: '1px solid #0051973D' }}>
        <div className="row g-2 mb-2 ms-3">
          <div className="col-lg-6 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '95%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">{idType === 'activityGroup' ? 'Global cost Code' : 'Activity Code'}</span>
                <ActivityCode />
              </div>
              <div className="fw-bold text-start mt-2">{costCode?.activityCode || 'N/A'}</div>
            </div>
          </div>
          <div className="col-lg-6 col-md-4">
            <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '95%', height: '100%' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">{idType === 'activityGroup' ? 'Global cost Name' : 'Activity Name'}</span>
                <ActivityView size={16} style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />
              </div>
              <div className="fw-bold text-start mt-2">{costCode?.activityName || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
      
        <div className="bg-white rounded-3 ms-3 me-3 p-4 mt-4" style={{ border: '1px solid #0051973D' }}>
          <div className="text-start d-flex justify-content-between align-items-center pb-3" style={{ borderBottom: '1px solid #0051973D' }}>
            <h6>Resource Details</h6>
            <div className="d-flex align-items-center">
              <button className="btn action-button me-2" onClick={handleCopyResources}><Copy size={20} /><span className="ms-2">Copy</span></button>
              <button className="btn action-button me-2"><ClipboardPasteIcon size={20} /><span className="ms-2">Paste</span></button>
            </div>
          </div>
          {estimatedResources?.length > 0 ? (
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
                    <td>{(item.netQuantity)}</td>
                    <td>{(item.costUnitRate)}</td>
                    <td>{(item.totalCostCompanyCurrency)}</td>
                    <td>
                      <EditIcon size={20} color="#005197" className="me-2" style={{ cursor: 'pointer' }} />
                      <Trash2 size={20} color="red" className="me-2" style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (<div className='mt-4'>No Content Available</div>)}
        </div>
      
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

export default ResourceAdding;