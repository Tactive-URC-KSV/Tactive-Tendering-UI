import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUom } from '../Context/UomContext';

const useResourceModal = (isGlobal = false, id, idType) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [costCode, setCostCode] = useState(null);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [resourceNature, setResourceNature] = useState([]);
  const [resources, setResources] = useState([]);
  const [quantityType, setQuantityType] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [showResourceAdding, setShowResourceAdding] = useState(false);
  const [coEffdisabled, setCoEffdisabled] = useState(false);
  const [resourceData, setResourceData] = useState({
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
    projectId: isGlobal ? '' : projectId,
  });

  const uomOption = useUom().map((uom) => ({
    value: uom.id,
    label: uom.uomName,
  }));

  const resourceTypesOption = useMemo(
    () =>
      resourceTypes?.map((item) => ({
        value: item.id,
        label: item.resourceTypeName,
      })),
    [resourceTypes]
  );

  const resourceOption = useMemo(
    () =>
      resources?.map((item) => ({
        value: item.id,
        label: item.resourceCode + '-' + item.resourceName,
      })),
    [resources]
  );

  const currencyOption = useMemo(
    () =>
      currency?.map((item) => ({
        value: item.id,
        label: item.currencyName + '(' + item.currencyCode + ')',
      })),
    [currency]
  );

  const quantityTypeOption = useMemo(
    () =>
      quantityType?.map((item) => ({
        value: item.id,
        label: item.quantityType,
      })),
    [quantityType]
  );

  const resourceNatureOption = useMemo(
    () =>
      resourceNature?.map((item) => ({
        value: item.id,
        label: item.nature,
      })),
    [resourceNature]
  );

  const handleUnauthorized = () => {
    navigate('/login');
  };

  const fetchCostCode = useCallback(() => {
    if (!id || !idType) return;

    const url = idType === 'activityGroup'
      ? `${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/activityGroup/${id}`
      : `${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/costCode/${id}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setCostCode(res.data);
          if (idType === 'activityGroup') {
            setResourceData((prev) => ({ ...prev, activityGroupId: id, costCodeActivityId: '' }));
          } else {
            setResourceData((prev) => ({ ...prev, costCodeActivityId: res.data.id, activityGroupId: '' }));
          }
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error(err?.response?.data?.message || `Failed to fetch ${idType === 'activityGroup' ? 'activity group' : 'cost code'}.`);
        }
      });
  }, [id, idType]);

  const fetchResourceTypes = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setResourceTypes(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error('Failed to fetch resource types.');
        }
      });
  }, []);

  const fetchQuantityType = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setQuantityType(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error('Failed to fetch quantity types.');
        }
      });
  }, []);

  const fetchCurrency = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setCurrency(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error('Failed to fetch currencies.');
        }
      });
  }, []);

  const fetchResourceNature = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setResourceNature(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error('Failed to fetch resource natures.');
        }
      });
  }, []);

  const fetchResources = useCallback((resTypeId) => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setResources(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error('Failed to fetch resources.');
        }
      });
  }, []);

  const fetchResource = (resourceId) => {
    const resource = resources.find((item) => item.id === resourceId);
    if (!resource) {
      setResourceData((prev) => ({ ...prev, resourceId: '', rate: 0, uomId: '', quantityTypeId: '' }));
      return;
    }
    const newResourceData = {
      ...resourceData,
      resourceId: resourceId,
      rate: resource.unitRate || 0,
      uomId: resource.uom?.id || '',
      quantityTypeId: resource.quantityType?.id || '',
    };
    setResourceData(newResourceData);
    handleCalculations(newResourceData);
  };

  const handleResourceTypeChange = (resTypeId) => {
    if (resTypeId) {
      fetchResources(resTypeId);
    } else {
      setResources([]);
      setResourceData((prev) => ({ ...prev, resourceId: '', rate: 0, uomId: '', quantityTypeId: '', exchangeRate: 1 }));
    }
  };

  const handleQuantityTypeChange = (quantityTypeId) => {
    const quantityTypeItem = quantityType.find((item) => item.id === quantityTypeId);
    const isCoefficient = quantityTypeItem?.quantityType.toLowerCase() === 'coefficient';
    const newCoEfficient = isCoefficient ? resourceData.coEfficient : 1;
    setCoEffdisabled(!isCoefficient);
    const newResourceData = {
      ...resourceData,
      quantityTypeId: quantityTypeId,
      coEfficient: newCoEfficient,
    };
    setResourceData(newResourceData);
    handleCalculations(newResourceData);
  };

  const handleCalculations = (updatedData) => {
    const data = { ...resourceData, ...updatedData };
    const coEfficient = parseFloat(data.coEfficient) || 1;
    const wastePercentage = parseFloat(data.wastePercentage) || 0;
    const rate = parseFloat(data.rate) || 0;
    const additionalRate = parseFloat(data.additionalRate) || 0;
    const shippingPrice = parseFloat(data.shippingPrice) || 0;
    const exchangeRate = parseFloat(data.exchangeRate) || 1;

    const calculatedQuantity = (costCode?.quantity || 0) * coEfficient;
    const wasteQuantity = calculatedQuantity * (wastePercentage / 100);
    const netQuantity = calculatedQuantity + wasteQuantity;
    const unitRate = netQuantity > 0 ? rate + additionalRate + (shippingPrice / netQuantity) : 0;
    const totalCostCompanyCurrency = unitRate * netQuantity;
    const resourceTotalCost = totalCostCompanyCurrency * exchangeRate;

    setResourceData((prev) => ({
      ...prev,
      ...data,
      calculatedQuantity,
      wasteQuantity,
      netQuantity,
      costUnitRate: unitRate,
      resourceTotalCost: resourceTotalCost,
      totalCostCompanyCurrency: totalCostCompanyCurrency,
    }));
  };

  const handleAddResource = () => {
    const dataToSend = {
      ...resourceData,
      costCodeActivityId: idType === 'costCode' ? resourceData.costCodeActivityId : '',
      activityGroupId: idType === 'activityGroup' ? resourceData.activityGroupId : '',
    };
    if (!resourceData.resourceTypeId) {
      toast.error('Please select a Resource Type.');
      return;
    }
    if (!resourceData.resourceNatureId) {
      toast.error('Please select a Nature.');
      return;
    }
    if (!resourceData.resourceId) {
      toast.error('Please select a Resource Name.');
      return;
    }
    if (!resourceData.uomId) {
      toast.error('Please select a UOM.');
      return;
    }
    if (!resourceData.quantityTypeId) {
      toast.error('Please select a Quantity Type.');
      return;
    }
    if (!resourceData.coEfficient && resourceData.coEfficient !== 0) {
      toast.error('Please enter a Co-Efficient.');
      return;
    }
    if (!resourceData.calculatedQuantity && resourceData.calculatedQuantity !== 0) {
      toast.error('Calculated Quantity is required.');
      return;
    }
    if (!resourceData.netQuantity && resourceData.netQuantity !== 0) {
      toast.error('Net Quantity is required.');
      return;
    }
    if (!resourceData.rate && resourceData.rate !== 0) {
      toast.error('Please enter a Rate.');
      return;
    }
    if (!resourceData.currencyId) {
      toast.error('Please select a Currency.');
      return;
    }
    if (!resourceData.exchangeRate && resourceData.exchangeRate !== 0) {
      toast.error('Please enter an Exchange Rate.');
      return;
    }
    if (!resourceData.costUnitRate && resourceData.costUnitRate !== 0) {
      toast.error('Cost Unit Rate is required.');
      return;
    }
    if (!resourceData.resourceTotalCost && resourceData.resourceTotalCost !== 0) {
      toast.error('Resource Total Cost is required.');
      return;
    }
    if (!resourceData.totalCostCompanyCurrency && resourceData.totalCostCompanyCurrency !== 0) {
      toast.error('Resource Total Cost (Company Currency) is required.');
      return;
    }
    if (resourceData.rateLock === undefined) {
      toast.error('Rate Lock is required.');
      return;
    }
    if (idType === 'activityGroup' && !resourceData.activityGroupId.length) {
      toast.error('Please associate at least one activity group.');
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`, dataToSend, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res?.data?.message || 'Resource added successfully.');
          setShowResourceAdding(false);
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
            costCodeActivityId: [],
            activityGroupId: [],
            projectId: isGlobal ? '' : projectId,
          });
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error(err?.response?.data?.message || 'Failed to add resource.');
        }
      });
  };

  const openModal = () => {
    setShowResourceAdding(true);
    fetchResourceTypes();
    fetchQuantityType();
    fetchCurrency();
    fetchResourceNature();
  };

  useEffect(() => {
    fetchCostCode();
  }, [fetchCostCode]);
  const handleEditResource = () => {
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/updateResource`, resourceData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res?.data?.message || 'Resource updated successfully.');
          setShowResourceAdding(false);
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
            costCodeActivityId: [],
            activityGroupId: [],
            projectId: isGlobal ? '' : projectId,
          });
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error(err?.response?.data?.message || 'Failed to add resource.');
        }
      });
  }
  return {
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
    handleEditResource,
    fetchResource,
    openModal,
  };
};

export default useResourceModal;