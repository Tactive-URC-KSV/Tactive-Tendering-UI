import { X, Plus, Info, Edit } from 'lucide-react';
import Area from '../assest/Area.svg?react';
import Select from 'react-select';

const ResourceModal = ({
  showModal,
  setShowModal,
  resourceData,
  setResourceData,
  resourceTypesOption,
  resourceNatureOption,
  resourceOption,
  uomOption,
  quantityTypeOption,
  currencyOption,
  coEffdisabled,
  handleResourceTypeChange,
  handleQuantityTypeChange,
  handleCalculations,
  handleAddResource,
  handleEditResource,
  fetchResource,
  idType,
}) => {
  if (!showModal) return null;
  const safeToFixed = (value, decimals = 2) => {
    const numValue = Number(value) || 0;
    return numValue.toFixed(decimals);
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between text-white" style={{ background: 'linear-gradient(to right, #0056b3, #007bff)' }}>
            <h6 className="modal-title">
              <Plus />
              <span className="ms-2">Add Resource details - {resourceData.docNumber}</span>
            </h6>
            <button
              type="button"
              className="btn text-white"
              onClick={() => {
                setShowModal(false);
                setResourceData({
                  id: '',
                  docNumber: `DOC${Date.now()}`,
                  coEfficient: 1,
                  calculatedQuantity: 0,
                  wastePercentage: 0,
                  wasteQuantity: 0,
                  netQuantity: 0,
                  rate: 0,
                  additionalRate: 0,
                  shippingPrice: 0,
                  costUnitRate: 0,
                  resourceTotalCost: 0,
                  rateLock: false,
                  totalCostCompanyCurrency: 0,
                  exchangeRate: '',
                  resourceTypeId: '',
                  quantityTypeId: '',
                  resourceNatureId: '',
                  uomId: '',
                  currencyId: '',
                  resourceId: '',
                  costCodeActivityId: '',
                  activityGroupId: '',
                  projectId: resourceData.projectId,
                });
              }}
            >
              <X size={20} />
            </button>
          </div>
          <div className="modal-body text-start">
            <div className="modal-resource p-2 rounded-3 mb-3">
              <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                <Info size={20} />
                <span className="ms-2">Basic Information</span>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Resource type<span className='ms-1 text-danger'>*</span></label>
                  <Select
                    options={resourceTypesOption}
                    placeholder="Select Resource Type"
                    className="w-100"
                    classNamePrefix="resource-select"
                    isClearable
                    value={resourceTypesOption.find((option) => option.value === resourceData.resourceTypeId)}
                    onChange={(option) => {
                      setResourceData({ ...resourceData, resourceTypeId: option.value });
                      handleResourceTypeChange(option ? option.value : '')
                    }}
                  />
                </div>
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Nature<span className='ms-1 text-danger'>*</span></label>
                  <Select
                    options={resourceNatureOption}
                    placeholder="Select Nature"
                    className="w-100"
                    classNamePrefix="resource-select"
                    isClearable
                    value={resourceNatureOption.find((option) => option.value === resourceData.resourceNatureId)}
                    onChange={(option) => setResourceData({ ...resourceData, resourceNatureId: option ? option.value : '' })}
                  />
                </div>
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Resource Name<span className='ms-1 text-danger'>*</span></label>
                  <Select
                    options={resourceOption}
                    placeholder="Select Resource Name"
                    className="w-100"
                    classNamePrefix="resource-select"
                    isClearable
                    value={resourceOption.find((option) => option.value === resourceData.resourceId)}
                    onChange={(option) => fetchResource(option ? option.value : '')}
                  />
                </div>
              </div>
            </div>
            <div className="modal-resource p-2 rounded-3 mb-3">
              <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                <Area size={20} style={{ filter: 'brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)' }} />
                <span className="ms-2">Quantity & Measurement</span>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">UOM<span className='ms-1 text-danger'>*</span></label>
                  <Select
                    options={uomOption}
                    placeholder="Select UOM"
                    className="w-100"
                    classNamePrefix="resource-select"
                    isClearable
                    value={uomOption.find((option) => option.value === resourceData.uomId)}
                    onChange={(option) => setResourceData({ ...resourceData, uomId: option ? option.value : '' })}
                  />
                </div>
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Quantity Type<span className='ms-1 text-danger'>*</span></label>
                  <Select
                    options={quantityTypeOption}
                    placeholder="Select Quantity Type"
                    className="w-100"
                    classNamePrefix="resource-select"
                    isClearable
                    value={quantityTypeOption.find((option) => option.value === resourceData.quantityTypeId)}
                    onChange={(option) => handleQuantityTypeChange(option ? option.value : '')}
                  />
                </div>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Co-Efficient<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="number"
                    className="resource-input w-100"
                    placeholder="Enter Co-Efficient"
                    value={resourceData.coEfficient}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      const newResourceData = { ...resourceData, coEfficient: newValue };
                      setResourceData(newResourceData);
                      handleCalculations(newResourceData);
                    }}
                    onWheel={(e) => e.target.blur()}
                    disabled={coEffdisabled}
                  />
                </div>
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Calculated Quantity<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="text"
                    className="resource-input w-100"
                    placeholder="Calculated Quantity"
                    value={safeToFixed(resourceData.calculatedQuantity, 3)}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="modal-resource p-2 rounded-3 mb-3">
              <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                <Info size={20} />
                <span className="ms-2">Wastage & Net Quantity</span>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Wastage %</label>
                  <input
                    type="number"
                    className="resource-input w-100"
                    placeholder="Enter Wastage %"
                    value={resourceData.wastePercentage}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      const newResourceData = { ...resourceData, wastePercentage: newValue };
                      setResourceData(newResourceData);
                      handleCalculations(newResourceData);
                    }}
                  />
                </div>
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Wastage Quantity</label>
                  <input
                    type="text"
                    className="resource-input w-100"
                    placeholder="Wastage Quantity"
                    value={safeToFixed(resourceData.wasteQuantity, 3)}
                    readOnly
                  />
                </div>
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Net Quantity<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="text"
                    className="resource-input w-100"
                    placeholder="Net Quantity"
                    value={safeToFixed(resourceData.netQuantity, 3)}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="modal-resource p-2 rounded-3 mb-3">
              <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                <Info size={20} />
                <span className="ms-2">Pricing & Currency</span>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Rate<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="number"
                    className="resource-input w-100"
                    placeholder="Enter Rate"
                    value={resourceData.rate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      const newResourceData = { ...resourceData, rate: newValue };
                      setResourceData(newResourceData);
                      handleCalculations(newResourceData);
                    }}
                  />
                </div>
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Additional Rate</label>
                  <input
                    type="number"
                    className="resource-input w-100"
                    placeholder="Enter Additional rate"
                    value={resourceData.additionalRate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      const newResourceData = { ...resourceData, additionalRate: newValue };
                      setResourceData(newResourceData);
                      handleCalculations(newResourceData);
                    }}
                  />
                </div>
                <div className="col-lg-4 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Shipping /Fright Price(+/-)</label>
                  <input
                    type="number"
                    className="resource-input w-100"
                    placeholder="Enter Shipping price"
                    value={resourceData.shippingPrice}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      const newResourceData = { ...resourceData, shippingPrice: newValue };
                      setResourceData(newResourceData);
                      handleCalculations(newResourceData);
                    }}
                  />
                </div>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Currency<span className='ms-1 text-danger'>*</span></label>
                  <Select
                    options={currencyOption}
                    placeholder="Select Currency"
                    className="w-100"
                    classNamePrefix="resource-select"
                    isClearable
                    value={currencyOption.find((option) => option.value === resourceData.currencyId)}
                    onChange={(option) => setResourceData({ ...resourceData, currencyId: option ? option.value : '' })}
                  />
                </div>
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Exchange Rate<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="number"
                    className="resource-input w-100"
                    placeholder="Enter Exchange Rate"
                    value={resourceData.exchangeRate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      const newResourceData = { ...resourceData, exchangeRate: newValue };
                      setResourceData(newResourceData);
                      handleCalculations(newResourceData);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-resource p-2 rounded-3 mb-3">
              <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                <Info size={20} />
                <span className="ms-2">Cost Summary</span>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Cost Unit Rate<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="text"
                    className="resource-input w-100"
                    placeholder="Enter Cost unit rate"
                    value={safeToFixed(resourceData.costUnitRate)}
                    readOnly
                  />
                </div>
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Resource Total Cost<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="text"
                    className="resource-input w-100"
                    placeholder="Resource Total cost"
                    value={safeToFixed(resourceData.resourceTotalCost)}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center p-2 mb-2">
                <div className="col-lg-6 col-md-6 mt-2">
                  <label className="resource-label text-start d-block">Resource Total Cost (Company Currency)<span className='ms-1 text-danger'>*</span></label>
                  <input
                    type="text"
                    className="resource-input w-100"
                    placeholder="Resource Total Cost (Company Currency)"
                    value={safeToFixed(resourceData.totalCostCompanyCurrency)}
                    readOnly
                  />
                </div>
                <div className="col-lg-6 col-md-6 mt-2">
                  <div className="d-flex ms-3 align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={resourceData.rateLock}
                      onChange={(e) => setResourceData({ ...resourceData, rateLock: e.target.checked })}
                    />
                    <label className="resource-label text-start d-block ms-2">Rate Lock<span className='ms-1 text-danger'>*</span></label>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              {resourceData.id ? (
                <button className="btn action-button" onClick={handleEditResource}>
                  <Edit size={16} />
                  <span className="ms-2">Edit Resource</span>
                </button>
              )
                :
                (
                  <button className="btn action-button" onClick={handleAddResource}>
                    <Plus />
                    <span className="ms-2">Add Resource</span>
                  </button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;