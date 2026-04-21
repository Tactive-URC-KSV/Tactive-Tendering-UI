import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { ArrowLeft, BookOpenText, ChevronDown, Info, IndianRupee, X, Settings, Search, AlertTriangle } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUom } from "../Context/UomContext";
import Area from '../assest/Area.svg?react';
import useDebounce from "../Utills/useDebounce";
import { searchBoq } from "../Utills/projectApi";

function AddResource() {
    const navigate = useNavigate();
    const { boqId, projectId: projectIdParam, resourceId } = useParams();
    const [searchParams] = useSearchParams();
    const isInternal = searchParams.get('isInternal') === 'true';
    const internalBoqId = searchParams.get('internalBoqId');
    const isEditModeQuery = searchParams.get('isEdit') === 'true';
    const darkBlue = '#005197';


    const vibrantBlue = '#007BFF';

    const [boq, setBoq] = useState(null);
    const safeResolve = (val) => (val && val !== 'undefined' && val !== 'null') ? val : null;
    const projectId = safeResolve(projectIdParam) || safeResolve(searchParams.get('projectId')) || boq?.projectId || null;
    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [quantityType, setQuantityType] = useState([]);
    const [currency, setCurrency] = useState([]);
    const [estimatedResources, setEstimatedResources] = useState([]);
    const [globalValues, setGlobalValues] = useState([]);
    const [formulaConfig, setFormulaConfig] = useState({
        elements: [],
        step: 'source', // source, item, value, operator
        activeElement: null
    });

    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedUom, setSelectedUom] = useState(null);
    const [selectedNature, setSelectedNature] = useState(null);
    const [selectedQuantityType, setSelectedQuantityType] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    const [expandedSections, setExpandedSections] = useState({
        'Wastage & Net Quantity': false,
        'Pricing & Currency': false,
    });
    const [isInternalBoqMode, setIsInternalBoqMode] = useState(isInternal);
    const [showMergeModal, setShowMergeModal] = useState(false);
    const [duplicateCandidate, setDuplicateCandidate] = useState(null);

    const compareAttributes = (a1, a2) => {
        // a1 is from estimatedResources item
        // a2 is currently selected attributes (mapped to array)
        if (!a1 && !a2) return true;
        const list1 = Array.isArray(a1) ? a1 : [];
        const list2 = Array.isArray(a2) ? a2 : [];
        if (list1.length !== list2.length) return false;

        return list1.every(attr1 => {
            const g1 = attr1.attributeGroupId || attr1.attributeGroup?.id;
            const i1 = attr1.attributeId || attr1.attribute?.id;
            return list2.some(attr2 => 
                (attr2.attributeGroupId === g1 || attr2.groupId === g1) && 
                (attr2.attributeId === i1 || attr2.value === i1)
            );
        });
    };
    const [showBoqModal, setShowBoqModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(isEditModeQuery || !resourceId);
    const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);

    const [resourceData, setResourceData] = useState({
        id: '',
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
        exchangeRate: 1,
        totalCostCompanyCurrency: 0,
        resourceTypeId: "",
        quantityTypeId: "",
        resourceNatureId: "",
        uomId: "",
        currencyId: "",
        resourceId: "",
        refCode: "",
        boqId: boqId,
        projectId: projectId
    });


    const fetchBOQ = useCallback(() => {
        if (!boqId && !internalBoqId) return;

        if (isInternal) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/internal-boq/${internalBoqId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    const internal = (Array.isArray(res.data) ? res.data[0] : res.data) || {};
                    const boq = {
                        id: internal.id || internal.internalBoqId || internalBoqId,
                        boqCode: internal.resource?.resourceCode || internal.resourceCode || "N/A",
                        boqName: internal.resource?.resourceName || internal.resourceName || "N/A",
                        uom: {
                            uomCode: internal.uom?.uomCode || internal.uomCode || "N/A"
                        },
                        quantity: internal.totalQuantity || 0,
                        projectId: projectId
                    };
                    setBoq(boq);
                    handleCalculations({ calculatedQuantity: boq.quantity || 0 });
                }
            }).catch(err => {
                console.error(err);
                toast.error('Failed to fetch internal BOQ information.');
            });
        } else {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/BOQ/${boqId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    setBoq(res.data);
                    handleCalculations({ calculatedQuantity: res.data.quantity || 0 });
                }
            }).catch(err => {
                if (err.response?.status === 401) {
                    // navigate('/login');
                } else {
                    console.error(err);
                    toast.error('Failed to fetch BOQ information.');
                }
            });
        }
    }, [boqId, internalBoqId, isInternal, navigate, projectId]);

    const fetchTenderEstimationResource = useCallback(() => {
        if (!resourceId) return;

        axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/tender/estimatedResource/${resourceId}${isInternal ? '' : `?boqId=${boqId}`}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if (res.status === 200) {
                const tender = res.data.tenderEstimation || res.data;
                const cost = res.data.costDetails || res.data; // Handle unwrapped cost details

                const resource = tender.resource || tender.resources;
                
                let rTypeId = typeof tender.resourceType === 'string' ? tender.resourceType : (tender.resourceType?.code || tender.resourceType?.id || "");
                if (!rTypeId && tender.resource?.resourceType) {
                    rTypeId = typeof tender.resource.resourceType === 'string' ? tender.resource.resourceType : tender.resource.resourceType.code || tender.resource.resourceType.id;
                }
                const qTypeId = typeof tender.quantityType === 'string' ? tender.quantityType : (tender.quantityType?.id || "");
                const rNatureId = typeof tender.resourceNature === 'string' ? tender.resourceNature : (tender.resourceNature?.code || tender.resourceNature?.id || "");

                const mappedData = {
                    id: tender.id,
                    coEfficient: tender.coEfficient ?? 1,
                    calculatedQuantity: cost?.calculatedQuantity ?? 0,
                    wastePercentage: tender.wastePercentage ?? 0,
                    wasteQuantity: cost?.wasteQuantity ?? 0,
                    netQuantity: cost?.netQuantity ?? 0,
                    rate: tender.rate ?? 0,
                    additionalRate: tender.additionalRate ?? 0,
                    shippingPrice: tender.shippingPrice ?? 0,
                    costUnitRate: cost?.costUnitRate ?? 0,
                    resourceTotalCost: cost?.resourceTotalCost ?? 0,
                    exchangeRate: tender.exchangeRate ?? 1,
                    totalCostCompanyCurrency: cost?.totalCostCompanyCurrency ?? 0,
                    rateLock: tender.rateLock ?? false,
                    resourceTypeId: rTypeId,
                    quantityTypeId: qTypeId,
                    resourceNatureId: rNatureId,
                    uomId: tender.uom?.id || "",
                    currencyId: tender.currency?.id || "",
                    resourceId: resource?.id || "",
                    refCode: tender.refCode ?? ""
                };
                
                let mappedElements = [];
                if (tender.formulaElements && Array.isArray(tender.formulaElements)) {
                    mappedElements = tender.formulaElements
                        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
                        .map(el => ({
                            id: el.id || Date.now() + Math.random(),
                            type: el.type,
                            sourceType: el.sourceType,
                            refId: el.boq?.id || el.resource?.id || el.globalValue?.id,
                            refCode: el.boq?.boqCode || el.resource?.refCode || el.globalValue?.name,
                            value: el.value,
                            operator: el.operator,
                            sequence: el.sequence,
                            label: el.type === 'OPERATOR' 
                                ? el.operator 
                                : el.type === 'NUMBER' 
                                    ? String(el.value) 
                                    : `[${el.sourceType}] ${el.boq?.boqCode || el.resource?.refCode || el.globalValue?.name || el.refCode || ''}`
                        }));

                    setFormulaConfig(prev => ({
                        ...prev,
                        elements: mappedElements
                    }));
                }

                handleCalculations(mappedData, mappedElements);

                // Set select values
                const capitalize = (s) => (typeof s === 'string' && s.length > 0) ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
                
                const rTypeObj = typeof tender.resourceType === 'string' 
                    ? { value: tender.resourceType, label: capitalize(tender.resourceType) } 
                    : tender.resourceType ? { value: tender.resourceType.code || tender.resourceType.id, label: tender.resourceType.label || tender.resourceType.resourceTypeName } : null;

                const rNatureObj = typeof tender.resourceNature === 'string'
                    ? { value: tender.resourceNature, label: capitalize(tender.resourceNature) }
                    : tender.resourceNature ? { value: tender.resourceNature.code || tender.resourceNature.id, label: tender.resourceNature.label || tender.resourceNature.nature } : null;

                const rQtyObj = typeof tender.quantityType === 'string'
                    ? { value: tender.quantityType, label: capitalize(tender.quantityType) }
                    : tender.quantityType ? { value: tender.quantityType.id, label: tender.quantityType.label || tender.quantityType.quantityType } : null;

                setSelectedResourceType(rTypeObj);
                setSelectedNature(rNatureObj);
                setSelectedQuantityType(rQtyObj);

                setSelectedResource(resource ? { value: resource.id, label: `${resource.resourceCode}-${resource.resourceName}`, resource: resource } : null);
                setSelectedUom(tender.uom ? { value: tender.uom.id, label: tender.uom.uomName && tender.uom.uomCode ? `${tender.uom.uomName} - ${tender.uom.uomCode}` : (tender.uom.uomName || tender.uom.uomCode || 'N/A') } : null);
                setSelectedCurrency(tender.currency ? { value: tender.currency.id, label: tender.currency.currencyName } : null);

                // Fetch resources and attributes
                if (rTypeId) {
                    fetchResources(rTypeId);
                }
                if (resource?.id) {
                    fetchResourceAttributes(resource.id, tender.attributes || []);
                }
            }
        }).catch(err => {
            console.error("Error fetching tender resource:", err);
            toast.error("Failed to load resource data");
        });
    }, [resourceId, boqId, isInternal]);

    const fetchEstimatedResources = useCallback(() => {
        if (!boqId && !internalBoqId) return;
        const url = isInternal 
          ? `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/internal-boq/${internalBoqId}`
          : `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/estimatedResources/${boqId}`;
        axios.get(url, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(res => {
            if (res.status === 200) {
                if (isInternal) {
                    const internal = res.data;
                    const enrichedItems = (internal.items || [])
                        .filter(item => item.id !== internal.internalBoqId)
                        .map(item => ({
                            ...item,
                            tenderEstimation: {
                                ...item,
                                id: item.id,
                                resource: {
                                    resourceName: item.resourceName || item.resource?.resourceName,
                                    resourceCode: item.resourceCode || item.resource?.resourceCode || item.refCode
                                },
                                uom: { uomCode: item.uomCode || item.uom?.uomCode },
                                costUnitRate: item.rate || item.costUnitRate || 0,
                                formulaElements: item.formulaElements || []
                            },
                            netQuantity: item.quantity || item.netQuantity || 0,
                            totalCostCompanyCurrency: item.totalCost || item.amount || item.totalCostCompanyCurrency || 0
                        }));
                    setEstimatedResources(enrichedItems);
                } else {
                    setEstimatedResources(Array.isArray(res.data) ? res.data : (res.data?.content || []));
                }
            }
        }).catch(err => console.error("Failed to fetch estimated resources", err));
    }, [boqId, internalBoqId, isInternal]);

    const fetchGlobalValues = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/globalValue/${projectId}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        }).then(res => {
            if (res.status === 200) {
                setGlobalValues(res.data || []);
            }
        }).catch(err => {
            console.error("Error fetching global values:", err);
        });
    }, [projectId]);

    useEffect(() => {
        fetchBOQ();
        fetchEstimatedResources();
        fetchGlobalValues();
    }, [fetchBOQ, fetchEstimatedResources, fetchGlobalValues]);

    useEffect(() => {
        if (resourceId && (boqId || internalBoqId)) {
            fetchTenderEstimationResource();
        }
    }, [fetchTenderEstimationResource, resourceId, boqId, internalBoqId]);

    const handleUnauthorized = useCallback(() => {
        toast.error("Session expired or unauthorized. Please log in again.");
        navigate('/login');
    }, [navigate]);

    const uomData = useUom();
    const uomOptions = useMemo(() =>
        (Array.isArray(uomData) ? uomData : []).map(uom => ({ value: uom.id, label: uom.uomName && uom.uomCode ? `${uom.uomName} - ${uom.uomCode}` : (uom.uomName || uom.uomCode) })),
        [uomData]
    );

    const handleCalculations = useCallback((updatedData, forcedFormulaElements) => {
        setResourceData((prev) => {
            const data = { ...prev, ...updatedData };
            const coEfficient = parseFloat(data.coEfficient) || 1;
            const wastePercentage = parseFloat(data.wastePercentage) || 0;
            const rate = parseFloat(data.rate) || 0;
            const additionalRate = parseFloat(data.additionalRate) || 0;
            const shippingPrice = parseFloat(data.shippingPrice) || 0;
            const exchangeRate = parseFloat(data.exchangeRate) || 1;
            const boqQuantity = parseFloat(boq?.quantity) || 0;

            const currentElements = forcedFormulaElements || formulaConfig.elements;

            let calculatedQuantity = 0;
            if (data.quantityTypeId === 'FORMULA') {
                calculatedQuantity = evaluateFormula(currentElements);
            } else if (data.quantityTypeId === 'DIRECT') {
                calculatedQuantity = boqQuantity;
            } else {
                calculatedQuantity = boqQuantity * coEfficient;
            }

            if (calculatedQuantity === 0 && updatedData?.calculatedQuantity) {
                calculatedQuantity = parseFloat(updatedData.calculatedQuantity) || 0;
            }

            const wasteQuantity = calculatedQuantity * (wastePercentage / 100);
            const netQuantity = calculatedQuantity + wasteQuantity;

            const unitRate = netQuantity > 0
                ? rate + additionalRate + (shippingPrice / netQuantity)
                : rate + additionalRate;

            const totalCostCompanyCurrency = unitRate * netQuantity;
            const resourceTotalCost = totalCostCompanyCurrency * exchangeRate;

            return {
                ...data,
                calculatedQuantity,
                wasteQuantity,
                netQuantity: netQuantity || parseFloat(updatedData?.netQuantity || 0),
                costUnitRate: unitRate || parseFloat(updatedData?.costUnitRate || 0),
                resourceTotalCost: resourceTotalCost || parseFloat(updatedData?.resourceTotalCost || 0),
                totalCostCompanyCurrency: totalCostCompanyCurrency || parseFloat(updatedData?.totalCostCompanyCurrency || 0)
            };
        });
    }, [boq, formulaConfig.elements]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'number' || name === 'coEfficient' ||
            name.includes('Rate') || name.includes('Price') || name.includes('Percentage')
            ? parseFloat(value) || 0
            : type === 'checkbox'
                ? checked
                : value;
        handleCalculations({ [name]: newValue });
    }, [handleCalculations]);

    // Fetch methods remain the same but with better error handling
    const fetchResourceTypes = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setResourceTypes(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch resource types.');
            });
    }, [handleUnauthorized]);

    const fetchResourceNature = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setResourceNature(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch resource natures.');
            });
    }, [handleUnauthorized]);

    const fetchResources = useCallback((resTypeCode) => {
        if (!resTypeCode) return;
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resources?page=0&size=50&resourceType=${resTypeCode}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setResources(res?.data?.content || res.data || []); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch resources.');
            });
    }, [handleUnauthorized]);

    const loadResourceOptions = (inputValue, callback) => {
        if (!selectedResourceType?.value) {
            callback([]);
            return;
        }

        const url = `${import.meta.env.VITE_API_BASE_URL}/resources/search?page=0&size=30&search=${inputValue || ""}&resourceType=${selectedResourceType.value}`;

        axios.get(url, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 200) {
                    const data = res.data.content || res.data || [];
                    // Store the full resource objects so handleResourceChange can access them
                    setResources(data);

                    const options = data.map(item => ({
                        value: item.id,
                        label: `${item.resourceCode}-${item.resourceName}`,
                        resource: item // Include the full object
                    }));
                    callback(options);
                } else {
                    callback([]);
                }
            })
            .catch(err => {
                console.error("Error searching resources:", err);
                callback([]);
            });
    };

    const fetchQuantityType = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setQuantityType(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch quantity types.');
            });
    }, [handleUnauthorized]);

    const fetchCurrency = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setCurrency(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch currencies.');
            });
    }, [handleUnauthorized]);

    useEffect(() => {
        fetchResourceTypes();
        fetchResourceNature();
        fetchQuantityType();
        fetchCurrency();
    }, [fetchResourceTypes, fetchResourceNature, fetchQuantityType, fetchCurrency]);

    useEffect(() => {
        if (boq) {
            handleCalculations({});
        }
    }, [boq, handleCalculations]);

    // Memoized options
    const resourceTypeOptions = useMemo(() =>
        resourceTypes.map(item => ({ value: item.code || item.id, label: item.label || item.resourceTypeName })),
        [resourceTypes]
    );
    const resourceOption = useMemo(() =>
        resources.map(item => ({ value: item.id, label: `${item.resourceCode}-${item.resourceName}` })),
        [resources]
    );
    const resourceNatureOption = useMemo(() =>
        resourceNature.map(item => ({ value: item.code || item.id, label: item.label || item.nature })),
        [resourceNature]
    );
    const quantityTypeOption = useMemo(() => {
        const options = quantityType.map(item => ({ value: item.code || item.id, label: item.label || item.quantityType }));
        if (!options.some(o => o.value === 'FORMULA')) {
            options.push({ value: 'FORMULA', label: 'Formula' });
        }
        return options;
    }, [quantityType]);
    const currencyOptions = useMemo(() =>
        currency.map(item => ({ value: item.id, label: item.currencyName })),
        [currency]
    );

    const handleBack = () => {
        if (isInternal) {
            navigate(`/tender-resource/${projectId}/${boqId}?isInternal=true&internalBoqId=${internalBoqId}`);
        } else {
            navigate(`/tenderestimation/${projectId}`);
        }
    };

    // State for dynamic attributes
    const [resourceAttributes, setResourceAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    // Fetch assigned attribute groups and their options
    const fetchResourceAttributes = useCallback((resourceId, savedAttributes = []) => {
        if (!resourceId) {
            setResourceAttributes([]);
            setSelectedAttributes({});
            return;
        }

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-by-resource/${resourceId}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
            .then(res => {
                const assignments = res.data || [];
                if (assignments.length === 0) {
                    setResourceAttributes([]);
                    setSelectedAttributes({});
                    return;
                }

                // Map assignments using the structure provided
                const mappedGroups = assignments.map(a => {
                    const group = a.attributeGroup || {};
                    const options = (a.attributes || group.attributes || []).map(attr => ({
                        value: attr.id,
                        label: attr.attributeName
                    }));
                    
                    return {
                        groupId: group.id || a.attributeGroupId,
                        groupName: group.groupName || "Unknown Group",
                        isMandatory: !!a.mandatory,
                        orderNo: a.orderNo || 0,
                        options: options
                    };
                }).filter(g => g.groupId && g.options.length > 0);

                // Sort groups by orderNo
                const validGroups = mappedGroups.sort((a, b) => a.orderNo - b.orderNo);

                setResourceAttributes(validGroups);
                applyInitialAttributes(validGroups, savedAttributes);
            })
            .catch(err => {
                console.error("Failed to fetch resource attributes", err);
                toast.error("Failed to load resource attributes");
            });
    }, []);

    // Helper to apply initial/saved attributes to the groups
    const applyInitialAttributes = (groups, savedAttributes) => {
        if (savedAttributes && savedAttributes.length > 0) {
            const initialSelected = {};
            savedAttributes.forEach(savedAttr => {
                const groupId = savedAttr.attributeGroup?.id || savedAttr.attributeGroupId;
                const attributeId = savedAttr.attribute?.id || savedAttr.attributeId;

                const group = groups.find(g => g.groupId === groupId);
                if (group) {
                    const option = group.options.find(opt => opt.value === attributeId);
                    if (option) {
                        initialSelected[groupId] = option;
                    }
                }
            });
            setSelectedAttributes(initialSelected);
        } else {
            setSelectedAttributes({});
        }
    };


    const handleResourceTypeChange = useCallback((selected) => {
        setSelectedResourceType(selected);
        setSelectedResource(null); // Reset resource
        setResources([]); // Clear resources
        setResourceAttributes([]); // Clear attributes
        setSelectedAttributes({});
        handleCalculations({
            resourceTypeId: selected?.value || "",
            resourceId: "",
            refCode: ""
        });
        // We no longer fetch all resources here; AsyncSelect will handle it via search
    }, [handleCalculations]);

    const handleResourceChange = useCallback((selectedOption) => {
        setSelectedResource(selectedOption);

        // Use the resource object directly from the selected option if available, 
        // otherwise find it in the local resources cache (fallback for initial load)
        const selectedResObj = selectedOption?.resource || resources.find((r) => r.id === selectedOption?.value);

        // Fetch attributes for the selected resource
        if (selectedOption?.value) {
            fetchResourceAttributes(selectedOption.value);
        } else {
            setResourceAttributes([]);
            setSelectedAttributes({});
        }

        if (selectedResObj) {
            const matchingUomOption = uomOptions.find((u) => u.value === selectedResObj.uom?.id);
            if (matchingUomOption) setSelectedUom(matchingUomOption);

            handleCalculations({
                resourceId: selectedResObj.id,
                rate: selectedResObj.unitRate || 0,
                uomId: selectedResObj.uom?.id || ""
            });

        } else {
            setSelectedUom(null);
            handleCalculations({
                resourceId: "",
                rate: 0,
                uomId: ""
            });
        }
    }, [resources, uomOptions, handleCalculations, fetchResourceAttributes]);

    const handleAttributeChange = (groupId, selectedOption) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [groupId]: selectedOption
        }));
    };

    const handleAddResource = useCallback(() => {
        const requiredFields = [];
        const isComplex = selectedNature?.label?.toLowerCase() === 'complex';

        if (!selectedResourceType?.value) requiredFields.push("Resource Type");
        if (!selectedNature?.value) requiredFields.push("Nature");
        if (!selectedResource?.value) requiredFields.push("Resource Name");
        if (!isComplex && (!resourceData.rate || resourceData.rate === 0)) requiredFields.push("Rate");
        if (!selectedUom?.value) requiredFields.push("UOM");
        if (!selectedQuantityType?.value) requiredFields.push("Quantity Type");
        if (!resourceData.coEfficient) requiredFields.push("Coefficient");
        if (!resourceData.calculatedQuantity) requiredFields.push("Calculated Quantity");

        // Formula validation
        if (resourceData.quantityTypeId === 'FORMULA' && formulaConfig.elements.length === 0) {
            requiredFields.push("Formula (cannot be empty when Quantity Type is Formula)");
        }

        resourceAttributes.forEach(attr => {
            if (attr.isMandatory && !selectedAttributes[attr.groupId]) {
                requiredFields.push(`${attr.groupName} (Attribute)`);
            }
        });

        if (requiredFields.length > 0) {
            toast.error(`Please fill in: ${requiredFields.join(", ")}`);
            return;
        }

        if (!projectId) {
            toast.error("Project ID is missing");
            return;
        }

        // Duplicate Validation
        const currentSelectionAttrs = Object.entries(selectedAttributes)
            .filter(([_, opt]) => opt?.value)
            .map(([groupId, opt]) => ({
                attributeGroupId: groupId,
                attributeId: opt.value
            }));

        const duplicate = estimatedResources.find(r => {
            const tender = r.tenderEstimation || r;
            const rId = tender.resource?.id || tender.resources?.id || tender.resourceId;
            const uomId = tender.uom?.id || tender.uomId;
            const attrs = tender.attributes || [];
            
            // For both, check resource and attributes first
            const baseMatch = rId === selectedResource.value && compareAttributes(attrs, currentSelectionAttrs);
            
            if (isComplex) {
                // For complex, also match UOM within the same breakup (estimatedResources is already scope-limited)
                return baseMatch && uomId === selectedUom.value;
            } else {
                // For simple, if baseMatch is true, it might be a duplicate in this BOQ/Project 
                // (Backend will catch the global BOQ+Project case, but we can catch same-level here)
                return baseMatch;
            }
        });

        if (duplicate && !resourceId) { 
            if (isComplex) {
                setDuplicateCandidate(duplicate);
                setShowMergeModal(true);
                return;
            } else {
                toast.error("This simple resource already exists with same attributes in this BOQ/Project");
                return;
            }
        }

        performSave();
    }, [resourceData, selectedResourceType, selectedResource, selectedUom, selectedNature, selectedQuantityType, selectedCurrency, resourceId, navigate, handleUnauthorized, resourceAttributes, selectedAttributes, estimatedResources, isInternal, internalBoqId, boqId]);

    const performSave = (isMerge = false) => {
        const isComplex = selectedNature?.label?.toLowerCase() === 'complex';
        // Force send netQuantity directly for update scenarios to omit aggregation bugs
        const finalNetQty = resourceData.netQuantity;
        const finalRate = resourceData.rate;

        const payload = {
            ...resourceData,
            boqId: boqId,
            internalBoqId: isInternal ? internalBoqId : null,
            resourceTypeId: selectedResourceType?.value || resourceData.resourceTypeId,
            resourceId: selectedResource?.value || resourceData.resourceId,
            uomId: selectedUom?.value || resourceData.uomId,
            resourceNatureId: selectedNature?.value || resourceData.resourceNatureId,
            quantityTypeId: selectedQuantityType?.value || resourceData.quantityTypeId,
            currencyId: selectedCurrency?.value || resourceData.currencyId,
            refCode: resourceData.refCode ? parseInt(resourceData.refCode) : 0,
            isInternal: isInternal,
            projectId: projectId,
            attributes: Object.entries(selectedAttributes)
                .filter(([_, opt]) => opt?.value)
                .map(([groupId, opt]) => ({
                    attributeGroupId: groupId,
                    attributeId: opt.value
                })),
            formula: formulaConfig.elements.map((el, index) => ({
                type: el.type,
                sourceType: el.sourceType || null,
                refId: el.refId || null,
                refCode: el.refCode || null,
                value: el.type === 'OPERATOR' ? null : el.value,
                operator: el.operator || null,
                sequence: index
            }))
        };
        if (!payload.id) { delete payload.id; } // Prevent 500 API exception parsing UUID empty strings
        if (!payload.internalBoqId) { delete payload.internalBoqId; }

        console.log("Final Payload:", payload);

        const endpoint = resourceId
            ? `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/updateResources`
            : `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`;

        axios.post(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
              const savedResource = res.data.tenderEstimation || res.data;
              toast.success(resourceId ? "Resource updated successfully" : "Resource added successfully");
              // Go back to the resource list with highlightId
              const backUrl = isInternal 
                ? `/tender-resource/${projectId}/${boqId}?isInternal=true&internalBoqId=${internalBoqId}&highlightId=${savedResource.id}`
                : `/tender-resource/${projectId}/${boqId}?highlightId=${savedResource.id}`;
              navigate(backUrl);
            }
        }).catch((err) => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else if (err?.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(resourceId ? "Failed to update resource" : "Failed to add resource");
            }
        });
    }; // end performSave

    const toggleSelection = useCallback((sectionName) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    }, []);


    const handleSelectChange = useCallback((field, selected) => {
        const fieldMap = {
            nature: { setter: setSelectedNature, idField: 'resourceNatureId' },
            quantityType: { setter: setSelectedQuantityType, idField: 'quantityTypeId' },
            currency: { setter: setSelectedCurrency, idField: 'currencyId' },
            uom: { setter: setSelectedUom, idField: 'uomId' }
        };

        const config = fieldMap[field];
        if (config) {
            config.setter(selected);
            handleCalculations({ [config.idField]: selected?.value || "" });
        }
    }, [handleCalculations]);

    const isComplex = selectedNature?.label?.toLowerCase() === 'complex';

    const customSelectStyles = {
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        option: (base) => ({
            ...base,
            whiteSpace: 'normal',
            wordWrap: 'break-word',
        }),
        singleValue: (base) => ({
            ...base,
            whiteSpace: 'normal',
            wordWrap: 'break-word',
        })
    };

    const evaluateFormula = (elements) => {
        if (!elements || elements.length === 0) return 0;
        let expression = '';
        elements.forEach(el => {
            if (el.type === 'OPERATOR') {
                expression += ` ${el.operator} `;
            } else {
                expression += ` ${el.value || 0} `;
            }
        });
        try {
            // Simple evaluate for safety
            const result = eval(expression);
            return isNaN(result) ? 0 : result;
        } catch (e) {
            return 0;
        }
    };

    const FormulaBuilder = () => {
        const [inlineInput, setInlineInput] = useState('');
        const inputRef = useRef(null);
        const [selectedSourceType, setSelectedSourceType] = useState(null);

        const commitFormulaString = (str) => {
            if (!str) return;
            
            // Allow implied multiplication like `3(15+5)` -> `3 * (15+5)`
            let sanitizedStr = str.replace(/([0-9.])\s*\(/g, "$1 * (");
            sanitizedStr = sanitizedStr.replace(/\)\s*([0-9.])/g, ") * $1");

            const regex = /([+\-*/()])|([0-9.]+)/g;
            const matches = [...sanitizedStr.matchAll(regex)];

            setFormulaConfig(prev => {
                let currentElements = [...prev.elements];
                
                for (let match of matches) {
                    const token = match[0];
                    if (['+', '-', '*', '/', '(', ')'].includes(token)) {
                        currentElements.push({ id: Date.now() + Math.random(), type: 'OPERATOR', operator: token, value: null, label: token });
                    } else {
                        const val = parseFloat(token);
                        if (!isNaN(val)) {
                            currentElements.push({ id: Date.now() + Math.random(), type: 'NUMBER', value: val, label: val.toString() });
                        }
                    }
                }
                
                const calcQty = evaluateFormula(currentElements);
                setResourceData(rPrev => ({ ...rPrev, calculatedQuantity: calcQty }));
                setInlineInput('');
                return { ...prev, elements: currentElements };
            });
        };

        const handleInlineChange = (e) => {
            setInlineInput(e.target.value);
        };

        const handleInlineKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const trimmed = inlineInput.trim();
                if (trimmed) commitFormulaString(trimmed);
            } else if (e.key === 'Backspace' && inlineInput === '') {
                e.preventDefault();
                setFormulaConfig(prev => {
                    if (prev.elements.length > 0) {
                        const updatedElements = prev.elements.slice(0, -1);
                        setResourceData(rPrev => ({ ...rPrev, calculatedQuantity: evaluateFormula(updatedElements) }));
                        return { ...prev, elements: updatedElements };
                    }
                    return prev;
                });
            }
        };
        const sourceTypes = [
            { value: 'BOQ', label: 'BOQ' },
            { value: 'RESOURCE', label: 'Resource' },
            { value: 'GLOBAL', label: 'Global' }
        ];
        const loadBoqOptions = (inputValue, callback) => {
            if (!inputValue) return callback([]);
            searchBoq(projectId, inputValue)
                .then(data => {
                    const options = (data || [])
                        .filter(item => item.lastLevel === true)
                        .map(item => ({
                            value: item.quantity ?? 0,
                            label: item.boqCode,
                            id: item.id
                        }));
                    callback(options);
                })
                .catch(() => callback([]));
        };

        const itemOptions = useMemo(() => {
            if (!selectedSourceType) return [];
            if (selectedSourceType.value === 'RESOURCE') {
                return estimatedResources.map(res => ({
                    value: res.calculatedQuantity ?? 0,
                    label: res.tenderEstimation?.refCode?.toString() || res.tenderEstimation?.resource?.resourceCode || res.tenderEstimation?.resources?.resourceCode || 'N/A',
                    id: res.tenderEstimation?.id
                }));
            }
            if (selectedSourceType.value === 'GLOBAL') {
                return globalValues.map(gv => ({
                    value: gv.value ?? 0,
                    label: gv.name,
                    id: gv.id
                }));
            }
            return [];
        }, [selectedSourceType, estimatedResources, globalValues]);

        const handleAddElement = (option) => {
            if (!option || !selectedSourceType) return;

            if (formulaConfig.elements.length > 0) {
                const last = formulaConfig.elements[formulaConfig.elements.length - 1];
                if (last.type !== 'OPERATOR') {
                    toast.warning("Please select an operator first");
                    return;
                }
            }

            const newElement = { 
                id: Date.now(),
                type: 'SOURCE', 
                sourceType: selectedSourceType.value,
                refId: option.id,
                refCode: option.label,
                value: option.value, 
                label: `[${selectedSourceType.label}] ${option.label}`
            };
            const updatedElements = [...formulaConfig.elements, newElement];
            setFormulaConfig(prev => ({ ...prev, elements: updatedElements }));
            
            const calculated = evaluateFormula(updatedElements);
            setResourceData(prev => ({ ...prev, calculatedQuantity: calculated }));
        };

        const removeElement = (id) => {
            const updatedElements = formulaConfig.elements.filter(el => el.id !== id);
            setFormulaConfig(prev => ({ ...prev, elements: updatedElements }));
            
            const calculated = evaluateFormula(updatedElements);
            setResourceData(prev => ({ ...prev, calculatedQuantity: calculated }));
        };

        return (
            <div className="col-12 mt-2">
                <div className="p-3 border rounded-3 bg-light shadow-sm">
                    <div 
                        className="d-flex flex-wrap gap-2 mb-3 p-2 bg-white border rounded align-items-center"
                        style={{ minHeight: '50px', cursor: isEditMode ? 'text' : 'default' }}
                        onClick={(e) => {
                            if (isEditMode && e.target !== inputRef.current) {
                                inputRef.current?.focus();
                            }
                        }}
                    >
                        {formulaConfig.elements.length > 0 && 
                            formulaConfig.elements.map((el) => (
                                <div key={el.id} className={`badge d-flex align-items-center p-2 rounded-pill ${el.type === 'OPERATOR' ? 'bg-dark' : 'bg-primary'}`}>
                                    <span style={{ fontSize: '13px' }}>{el.label}</span>
                                    {isEditMode && <X size={14} className="ms-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} />}
                                </div>
                            ))
                        }
                        
                        {!isEditMode && formulaConfig.elements.length === 0 && (
                            <span className="text-muted small italic">Formula is empty.</span>
                        )}

                        {isEditMode && (
                            <input 
                                ref={inputRef}
                                type="text"
                                style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: '100px', cursor: 'inherit', caretColor: '#000' }}
                                value={inlineInput}
                                onChange={handleInlineChange}
                                onKeyDown={handleInlineKeyDown}
                                placeholder={formulaConfig.elements.length === 0 ? "Type formula (5 + 10) or choose source..." : ""}
                            />
                        )}

                        {formulaConfig.elements.length > 0 && (
                            <div className="ms-auto text-primary fw-bold px-2 border-start">
                                = {evaluateFormula(formulaConfig.elements).toFixed(3)}
                            </div>
                        )}
                    </div>

                    {isEditMode && (
                        <>
                            <div className="row g-2 align-items-center mb-3">
                        <div className="col-md-3">
                            <Select
                                options={sourceTypes}
                                value={selectedSourceType}
                                onChange={(opt) => setSelectedSourceType(opt)}
                                placeholder="Source..."
                                className="w-100"
                                classNamePrefix="select"
                                menuPortalTarget={document.body}
                                styles={customSelectStyles}
                            />
                        </div>
                        <div className="col-md-9">
                            {selectedSourceType?.value === 'BOQ' ? (
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadBoqOptions}
                                    onChange={handleAddElement}
                                    placeholder="Search BOQ Code..."
                                    className="w-100"
                                    classNamePrefix="select"
                                    menuPortalTarget={document.body}
                                    styles={customSelectStyles}
                                    value={null}
                                />
                            ) : (
                                <Select
                                    options={itemOptions}
                                    onChange={handleAddElement}
                                    placeholder={!selectedSourceType ? "Select source..." : `Choose ${selectedSourceType.label}...`}
                                    className="w-100"
                                    classNamePrefix="select"
                                    isDisabled={!selectedSourceType}
                                    menuPortalTarget={document.body}
                                    styles={customSelectStyles}
                                    value={null}
                                />
                            )}
                        </div>
                    </div>
                        </>
                    )}

                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid mt-4 min-vh-100 p-4">
            <div className="sticky-top bg-white pb-2" style={{ top: 0, zIndex: 100 }}>
                <div className="d-flex justify-content-between align-items-center mb-4 pt-3 ms-3 me-3">
                    <div className="fw-bold text-start">
                        <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
                        <span className="ms-2 fs-5">
                            {!resourceId ? 'Add New Resource' : isEditMode ? 'Edit Resource' : 'View Resource'}
                        </span>
                    </div>
                    {resourceId && !isEditMode && (
                        <button
                            className="btn btn-outline-primary d-flex align-items-center"
                            onClick={() => setIsEditMode(true)}
                        >
                            <Info size={16} className="me-2" /> Edit Resource
                        </button>
                    )}
                </div>

                {/* Fixed BOQ Summary */}
                <div className="ms-3 me-3">
                    <div
                        className="text-white p-3 d-flex justify-content-between align-items-center"
                        style={{
                            background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`,
                            borderRadius: '0.5rem'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <BookOpenText size={20} className="me-2" />
                            <div className="d-flex flex-column text-start">
                                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{isInternal ? 'Complex Resource Summary' : 'BOQ Summary'}</span>
                                <span

                                    className="fw-bold cursor-pointer"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowBoqModal(true)}
                                    title="Click to view full BOQ Name"
                                >
                                    {boq?.boqName && boq.boqName.length > 15
                                        ? boq.boqName.substring(0, 15) + '...'
                                        : boq?.boqName || 'Loading...'}
                                </span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center">
                            <div className="text-end me-4">
                                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>UOM</div>
                                <div className="fw-bold">{boq?.uom?.uomCode || 'N/A'}</div>
                            </div>
                            <div className="text-end">
                                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Quantity</div>
                                <div className="fw-bold">{(boq?.quantity || 0).toFixed(3)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 ms-2 me-2 mt-2">
                {/* Left Column - Form Inputs */}
                <div className="col-lg-8 col-md-8 col-12">
                    {/* ... other sections remain same ... */}

                    {/* Basic Information Section */}
                    <div className="rounded-3 mb-3 bg-white pb-3 shadow-sm border overflow-hidden">
                        <div className="text-start fw-bold p-3" style={{ backgroundColor: '#EFF6FF', color: '#005197' }}>
                            <Info size={20} className="me-1" />
                            Basic Information
                        </div>
                        <div className="row g-3 p-3">
                            <div className="col-md-6">
                                <label className="form-label text-start w-100 italic">
                                    Resource Type <span style={{ color: "red" }}>*</span>
                                </label>
                                <Select
                                    options={resourceTypeOptions}
                                    placeholder="Select Resource Type"
                                    className="w-100"
                                    classNamePrefix="select"
                                    value={selectedResourceType}
                                    onChange={handleResourceTypeChange}
                                    isDisabled={!isEditMode}
                                    menuPortalTarget={document.body}
                                    styles={customSelectStyles}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-start w-100">
                                    Nature <span style={{ color: "red" }}>*</span>
                                </label>
                                <Select
                                    options={resourceNatureOption}
                                    placeholder="Select Nature"
                                    className="w-100"
                                    classNamePrefix="select"
                                    value={selectedNature}
                                    onChange={(selected) => handleSelectChange('nature', selected)}
                                    isDisabled={!isEditMode}
                                    menuPortalTarget={document.body}
                                    styles={customSelectStyles}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-start w-100">
                                    Resource Name <span style={{ color: "red" }}>*</span>
                                </label>
                                <AsyncSelect
                                    cacheOptions
                                    key={selectedResourceType?.value || 'empty'}
                                    defaultOptions={true}
                                    loadOptions={loadResourceOptions}
                                    placeholder="Type to search resource..."
                                    className="w-100 text-start"
                                    classNamePrefix="select"
                                    value={selectedResource}
                                    onChange={handleResourceChange}
                                    isDisabled={!selectedResourceType || !isEditMode}
                                    menuPortalTarget={document.body}
                                    styles={customSelectStyles}
                                />
                            </div>

                            {!isComplex && (
                                <div className="col-md-6">
                                    <label className="form-label text-start w-100">
                                        Rate <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        name="rate"
                                        value={resourceData.rate ?? 0}
                                        onChange={handleChange}
                                        disabled={!isEditMode}
                                        style={{ borderRadius: '0.5rem' }}
                                        placeholder="0.00"
                                        className="form-input w-100"
                                        step="0.01"
                                    />
                                </div>
                            )}

                            {/* Attributes Toggle Field */}
                            {resourceAttributes.length > 0 && (
                                <div className="col-md-6">
                                    <label className="form-label text-start w-100">
                                        Attributes {Object.keys(selectedAttributes).length > 0 && 
                                            <span className="badge bg-primary ms-2">
                                                {Object.keys(selectedAttributes).length} Configured
                                            </span>
                                        }
                                    </label>
                                    <div className="w-100">
                                        <input
                                            type="text"
                                            readOnly
                                            className="form-input w-100 bg-white"
                                            style={{ cursor: 'pointer', borderRadius: '0.5rem' }}
                                            placeholder="Click to configure attributes..."
                                            value={Object.values(selectedAttributes)
                                                .map(opt => opt.label)
                                                .join(', ') || ''}
                                            onClick={() => setIsAttributeModalOpen(true)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quantity & Measurements Section */}
                    <div className="rounded-3 mt-3 mb-3 bg-white pb-3 shadow-sm border overflow-hidden">
                        <div className="text-start fw-bold p-3" style={{ backgroundColor: '#EFF6FF', color: '#005197' }}>
                            <Area size={20} className="me-1" />
                            Quantity & Measurements
                        </div>
                        <div className="row g-3 p-3">
                            <div className="col-md-6">
                                <label className="form-label text-start w-100">
                                    UOM <span style={{ color: "red" }}>*</span>
                                </label>
                                <Select
                                    options={uomOptions}
                                    value={selectedUom}
                                    placeholder="Select UOM"
                                    className="w-100"
                                    classNamePrefix="select"
                                    onChange={(selected) => handleSelectChange('uom', selected)}
                                    isDisabled={!isEditMode}
                                    menuPortalTarget={document.body}
                                    styles={customSelectStyles}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-start w-100">
                                    Quantity Type <span style={{ color: "red" }}>*</span>
                                </label>
                                <Select
                                    options={quantityTypeOption}
                                    placeholder="Select Quantity Type"
                                    className="w-100"
                                    classNamePrefix="select"
                                    value={selectedQuantityType}
                                    onChange={(selected) => handleSelectChange('quantityType', selected)}
                                    isDisabled={!isEditMode}
                                    menuPortalTarget={document.body}
                                    styles={customSelectStyles}
                                />
                            </div>

                            {selectedQuantityType?.value === 'FORMULA' && (
                                <div className="col-12 px-3">
                                    <FormulaBuilder />
                                </div>
                            )}

                            <div className="col-md-6">
                                <label className="form-label text-start w-100">
                                    Coefficient <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    name="coEfficient"
                                    value={resourceData.coEfficient}
                                    onChange={handleChange}
                                    disabled={!isEditMode || resourceData.quantityTypeId !== 'COEFFICIENT'}
                                    style={{ borderRadius: '0.5rem' }}
                                    placeholder="1.00000"
                                    className="form-input w-100"
                                    step="0.00001"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-start w-100">
                                    Calculated Quantity
                                </label>
                                <input
                                    type="text"
                                    value={(resourceData.calculatedQuantity || 0).toFixed(3)}
                                    style={{ borderRadius: '0.5rem' }}
                                    placeholder="0.000"
                                    readOnly
                                    className="form-input w-100 bg-light"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Wastage & Net Quantity Section */}
                    <div className="rounded-3 mt-3 mb-3 bg-white pb-3 shadow-sm border overflow-hidden">
                        <div className="d-flex justify-content-between p-3"
                            onClick={() => toggleSelection('Wastage & Net Quantity')}
                            style={{ backgroundColor: '#EFF6FF', color: '#005197', cursor: 'pointer' }}>
                            <div className="text-start fw-bold">
                                <Area size={20} className="me-1" />
                                Wastage & Net Quantity
                            </div>
                            <ChevronDown className={expandedSections["Wastage & Net Quantity"] ? 'rotate-180' : ''} />
                        </div>
                        {expandedSections["Wastage & Net Quantity"] && (
                            <div className="row g-3 p-3">
                                <div className="col-md-4">
                                    <label className="form-label text-start w-100">Wastage %</label>
                                    <input
                                        type="number"
                                        name="wastePercentage"
                                        value={resourceData.wastePercentage ?? 0}
                                        onChange={handleChange}
                                        disabled={!isEditMode}
                                        placeholder="0.00"
                                        className="form-input w-100"
                                        style={{ borderRadius: "0.5rem" }}
                                        onWheel={(e) => e.target.blur()}
                                        step="0.01"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-start w-100">Wastage Quantity</label>
                                    <input
                                        type="text"
                                        value={(resourceData.wasteQuantity || 0).toFixed(3)}
                                        readOnly
                                        className="form-input w-100 bg-light"
                                        placeholder="0.000"
                                        style={{ borderRadius: "0.5rem" }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-start w-100">Net Quantity</label>
                                    <input
                                        type="text"
                                        value={(resourceData.netQuantity || 0).toFixed(3)}
                                        readOnly
                                        className="form-input w-100 bg-light"
                                        placeholder="0.000"
                                        style={{ borderRadius: "0.5rem" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pricing & Currency Section */}
                    {!isComplex && (
                        <div className="rounded-3 mt-3 mb-3 bg-white pb-3 shadow-sm border overflow-hidden">
                            <div className="d-flex justify-content-between p-3"
                                onClick={() => toggleSelection('Pricing & Currency')}
                                style={{ backgroundColor: '#EFF6FF', color: '#005197', cursor: 'pointer' }}>
                                <div className="text-start fw-bold">
                                    <Area size={20} className="me-1" />
                                    Pricing & Currency
                                </div>
                                <ChevronDown className={expandedSections["Pricing & Currency"] ? 'rotate-180' : ''} />
                            </div>
                            {expandedSections["Pricing & Currency"] && (
                                <div className="row g-3 p-3">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label text-start w-100">Additional Rate</label>
                                            <input
                                                type="number"
                                                name="additionalRate"
                                                value={resourceData.additionalRate ?? 0}
                                                onChange={handleChange}
                                                disabled={!isEditMode}
                                                className="form-input w-100"
                                                placeholder="0.00"
                                                style={{ borderRadius: "0.5rem" }}
                                                onWheel={(e) => e.target.blur()}
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-start w-100">Currency</label>
                                            <Select
                                                options={currencyOptions}
                                                placeholder="Select Currency"
                                                className="w-100"
                                                classNamePrefix="select"
                                                value={selectedCurrency}
                                                onChange={(selected) => handleSelectChange('currency', selected)}
                                                isDisabled={!isEditMode}
                                                menuPortalTarget={document.body}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label text-start w-100">Shipping / Freight Price (+ / -)</label>
                                            <input
                                                type="number"
                                                name="shippingPrice"
                                                value={resourceData.shippingPrice ?? 0}
                                                onChange={handleChange}
                                                disabled={!isEditMode}
                                                className="form-input w-100"
                                                placeholder="0.00"
                                                style={{ borderRadius: "0.5rem" }}
                                                onWheel={(e) => e.target.blur()}
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-start w-100">Exchange Rate</label>
                                            <input
                                                type="number"
                                                name="exchangeRate"
                                                value={resourceData.exchangeRate ?? 1}
                                                onChange={handleChange}
                                                disabled={!isEditMode}
                                                className="form-input w-100"
                                                onWheel={(e) => e.target.blur()}
                                                placeholder="1.00000"
                                                step="0.0001"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cost Summary Section */}
                    {!isComplex && (
                        <div className="rounded-3 mt-3 mb-3 bg-white pb-3 shadow-sm border overflow-hidden">
                            <div className="text-start fw-bold p-3" style={{ backgroundColor: '#EFF6FF', color: '#005197' }}>
                                <Area size={20} className="me-1" />
                                Cost Summary
                            </div>
                            <div className="d-flex justify-content-end align-items-center px-3 mt-3 mb-3">
                                <span className="me-2">Rate Lock</span>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="rateLockSwitch"
                                        name="rateLock"
                                        checked={resourceData.rateLock ?? false}
                                        onChange={handleChange}
                                        disabled={!isEditMode}
                                    />
                                </div>
                            </div>
                            <div className="row g-3 text-center p-3">
                                <div className="col-md-4">
                                    <div className="p-3 shadow-sm rounded border bg-light">
                                        <div className="text-muted small">Cost Unit Rate</div>
                                        <div className="fw-bold fs-5">{(resourceData.costUnitRate || 0).toFixed(4)}</div>
                                        <small className="text-muted">per {boq?.uom?.uomCode || 'unit'}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 shadow-sm rounded border" style={{ backgroundColor: '#EFF6FF' }}>
                                        <div className="text-muted small">Total Cost (Company)</div>
                                        <div className="fw-bold fs-5">{(resourceData.totalCostCompanyCurrency || 0).toFixed(2)}</div>
                                        <small className="text-muted">per {boq?.uom?.uomCode || 'unit'}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 shadow-sm rounded border" style={{ backgroundColor: '#F0FDF4' }}>
                                        <div className="text-muted small">Total Cost (Resource)</div>
                                        <div className="fw-bold fs-5">{(resourceData.resourceTotalCost || 0).toFixed(2)}</div>
                                        <small className="text-muted">per {boq?.uom?.uomCode || 'unit'}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-end pt-3 mb-5">
                        {(() => {
                            const currentSelectionAttrs = Object.entries(selectedAttributes)
                                .filter(([_, opt]) => opt?.value)
                                .map(([groupId, opt]) => ({
                                    attributeGroupId: groupId,
                                    attributeId: opt.value
                                }));

                            const isSimpleDuplicate = !isComplex && estimatedResources.some(r => {
                                const tender = r.tenderEstimation || r;
                                const rId = tender.resource?.id || tender.resources?.id || tender.resourceId;
                                const uomId = tender.uom?.id || tender.uomId;
                                const attrs = tender.attributes || [];
                                return rId === selectedResource?.value && 
                                       uomId === selectedUom?.value && 
                                       compareAttributes(attrs, currentSelectionAttrs);
                            });

                            return (!resourceId || isEditMode) && (
                                <button
                                    className="btn action-button px-5"
                                    onClick={handleAddResource}
                                    disabled={!selectedResourceType || !selectedResource || (!isComplex && resourceData.rate === 0) || (isSimpleDuplicate && !resourceId)}
                                >
                                    {isSimpleDuplicate && !resourceId ? 'Resource Already Exists' : (resourceId ? 'Update Resource' : 'Add Resource')}
                                </button>
                            );
                        })()}
                    </div>
                </div>

                <div className="col-lg-4 col-md-4 col-12">
                    <div className="d-flex align-items-center mb-4">
                        <span className="fs-5 fw-bold">Estimated Resources</span>
                    </div>
                    <div className="bg-white rounded-3 shadow-sm border p-3" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        {(() => {
                            let displayedResources = [];
                            if (isInternal) {
                                displayedResources = estimatedResources || []; 
                            } else {
                                displayedResources = estimatedResources || [];
                            }



                            return displayedResources.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {displayedResources.map((item, idx) => (
                                        <div key={idx} className="p-3 border rounded-3 bg-light shadow-sm">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <span className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                                                    {item.tenderEstimation?.resource?.resourceName || item.tenderEstimation?.resources?.resourceName || (typeof item.tenderEstimation?.resourceType === 'object' ? item.tenderEstimation?.resourceType?.resourceTypeName : item.tenderEstimation?.resourceType) || 'N/A'}
                                                </span>
                                                <span className="fw-bold text-success" style={{ whiteSpace: 'nowrap' }}>
                                                    <IndianRupee size={14} />{(item.totalCostCompanyCurrency || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between small text-muted mb-1">
                                                <span>Nature: {item.tenderEstimation?.resourceNature ? item.tenderEstimation.resourceNature.charAt(0).toUpperCase() + item.tenderEstimation.resourceNature.slice(1).toLowerCase() : 'N/A'}</span>
                                                <span>Rate: {(item.tenderEstimation?.costUnitRate || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between small text-muted">
                                                <span>Coefficient:</span>
                                                <span>{(item.tenderEstimation?.coEfficient || 0).toFixed(5)}</span>
                                            </div>
                                            <div className="d-flex justify-content-end small text-muted mt-1 pt-1 border-top">
                                                <span>Qty: {(item.netQuantity || 0).toFixed(3)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-muted mb-0">No resources estimated yet.</p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {showBoqModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: '#005197' }}>
                                <h5 className="modal-title fw-medium text-white">BOQ Name : {boq?.boqCode}</h5>
                                <button type="button" className="btn-close text-white bg-white" onClick={() => setShowBoqModal(false)}></button>
                            </div>
                            <div className="modal-body text-start" style={{ maxHeight: '60vh', overflowY: 'auto', wordWrap: 'break-word', borderBottom: 'none' }}>
                                <p className="fs-6 lh-lg" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{boq?.boqName}</p>
                            </div>
                            <div className="modal-footer" style={{ borderTop: 'none' }}>
                                <button type="button" className="btn btn-secondary px-4 mt-2 mb-2" onClick={() => setShowBoqModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Attribute Modal */}
            {isAttributeModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header text-white" style={{ backgroundColor: '#005197' }}>
                                <h5 className="modal-title d-flex align-items-center">
                                    <Settings className="me-2" size={20} />
                                    Resource Attributes Configuration
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setIsAttributeModalOpen(false)}></button>
                            </div>
                            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="row g-4">
                                    {resourceAttributes.map((attr) => (
                                        <div className="col-md-6 text-start" key={attr.groupId}>
                                            <label className="form-label fw-bold small text-muted text-uppercase">
                                                {attr.groupName} {attr.isMandatory && <span className="text-danger">*</span>}
                                            </label>
                                            <Select
                                                options={attr.options}
                                                placeholder={`Select ${attr.groupName}`}
                                                className="w-100"
                                                classNamePrefix="select"
                                                value={selectedAttributes[attr.groupId] || null}
                                                onChange={(selected) => handleAttributeChange(attr.groupId, selected)}
                                                isDisabled={!isEditMode}
                                                menuPortalTarget={document.body}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button 
                                    type="button" 
                                    className="btn px-4 bg-white border fw-bold text-muted rounded-pill shadow-sm hover-elevate transition-all" 
                                    onClick={() => setIsAttributeModalOpen(false)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Merge Confirmation Modal */}
            {showMergeModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1100 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-warning justify-content-between">
                                <h5 className="modal-title d-flex align-items-center">
                                    <AlertTriangle className="me-2" /> Duplicate Detected
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowMergeModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 text-start">
                                <p className="mb-3">
                                    The resource <strong>{selectedResource?.label}</strong> already exists with the same UOM and attributes.
                                </p>
                                <div className="alert alert-info py-2 small">
                                    <Info size={16} className="me-2" />
                                    Since this is a <strong>Complex Resource</strong>, the quantity you specified will be <strong>merged</strong> into the existing entry.
                                </div>
                                <p className="text-muted small mb-0">Do you want to continue?</p>
                            </div>
                            <div className="modal-footer border-0">
                                <button className="btn btn-light px-4 rounded-pill" onClick={() => setShowMergeModal(false)}>Cancel</button>
                                <button className="btn btn-warning px-4 rounded-pill fw-bold" onClick={() => {
                                    setShowMergeModal(false);
                                    performSave(true);
                                }}>Merge & Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default AddResource;