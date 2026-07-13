import { useState, useRef, useMemo } from 'react';
import '../CSS/Styles.css'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, FileSymlink, FileText, Folder, Link, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Select from 'react-select';
import { throttle } from 'lodash';
import FileIcon from '../assest/BoqFile.svg?react';
import ColumnIcon from '../assest/columns.svg?react';
import InternalIcon from '../assest/Internal_Fields.svg?react';
import Drag from '../assest/Drag.svg?react';
import Template from '../assest/Template.svg?react';
import Mapping from '../assest/Mapping.svg?react';
import ExpandIcon from '../assest/Expand.svg?react';
import CollapseIcon from '../assest/Collapse.svg?react';
import useDebounce from '../Utills/useDebounce.js'
import { toast } from 'react-toastify';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const autoScrollWhileDragging = (e) => {
   const padding = 100;
   const scrollSpeed = 100;
   const mouseY = e.clientY;
   const windowHeight = window.innerHeight;

   if (mouseY < padding) {
      window.scrollBy({ top: -scrollSpeed, behavior: 'smooth' });
   } else if (mouseY > windowHeight - padding) {
      window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
   }
};

const throttledAutoScroll = throttle(autoScrollWhileDragging, 50);

function BOQUpload({ projectId, projectName, setUploadScreen }) {
   const navigate = useNavigate();
   const location = useLocation();
   const { token } = useParams();
   const [section, setSection] = useState('columnMapping');
   const [confirmModal, setConfirmModal] = useState({ show: false, type: '', message: '' });
   const [loading, setLoading] = useState(false);

   const isExternalAccess = location.pathname.startsWith('/external');

   // Parse query parameters from URL
   const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

   const getQueryParam = (name) => {
      if (queryParams.has(name)) return queryParams.get(name);
      const normalizedName = name.toLowerCase().replace(/[\s\._-]/g, '');
      for (const key of queryParams.keys()) {
         const normalizedKey = key.toLowerCase().replace(/[\s\._-]/g, '');
         if (normalizedKey === normalizedName) {
            return queryParams.get(key);
         }
      }
      return null;
   };

   const externalModuleRef = useMemo(() => isExternalAccess ? (getQueryParam("Module_Reference") || getQueryParam("moduleReference") || getQueryParam("moduleRef") || getQueryParam("projectId")) : null, [isExternalAccess, queryParams]);
   const externalEnqirySlno = useMemo(() => isExternalAccess ? (getQueryParam("EnqirySlno") || getQueryParam("enquirySlno") || getQueryParam("EnquirySlNo") || getQueryParam("enqirySlno")) : null, [isExternalAccess, queryParams]);
   const externalTenderRevNo = useMemo(() => isExternalAccess ? (getQueryParam("Tender_Rev_No") || getQueryParam("tenderRevNo") || getQueryParam("TenderRevNo") || getQueryParam("tenderRev")) : null, [isExternalAccess, queryParams]);
   const externalTederCode = useMemo(() => isExternalAccess ? (getQueryParam("Teder_Code") || getQueryParam("tenderCode") || getQueryParam("TederCode") || getQueryParam("tender_code") || getQueryParam("Tender_Code")) : null, [isExternalAccess, queryParams]);
   const externalTenderName = useMemo(() => isExternalAccess ? (getQueryParam("Tender_Name") || getQueryParam("tenderName") || getQueryParam("TenderName") || getQueryParam("tender_name")) : null, [isExternalAccess, queryParams]);

   const effectiveProjectId = (isExternalAccess && externalEnqirySlno) ? externalEnqirySlno : projectId;

   const displayProjectName = (isExternalAccess && (externalTederCode || externalTenderName))
      ? `${externalTederCode ? externalTederCode.replace(/_/g, '/') : ''} - ${externalTenderName ? externalTenderName.replace(/_/g, ' ') : ''}`
      : projectName;
   const fileInputRef = useRef(null);
   const [BOQfile, setBOQfile] = useState(null);
   const [sheetOption, setSheetOption] = useState([]);
   const [selectedSheet, setSelectedSheet] = useState('');
   const [columns, setColumns] = useState([]);
   const [draggedColumn, setDraggedColumn] = useState(null);
   const [template, setTemplate] = useState({
      templateName: '',
      templateCode: '',
      description: ''
   });
   const [templateList, setTemplateList] = useState([]);
   const [selectedTemplate, setSelectedTemplate] = useState(null);
   const [fileType, setFileType] = useState('')

   const [internalFields, setInternalFields] = useState([
      { fields: 'boqCode', mappingFields: [], importance: 'Required', label: 'BOQ Code' },
      { fields: 'boqName', mappingFields: [], importance: 'Required', label: 'BOQ Name' },
      { fields: 'uom', mappingFields: [], importance: 'Required', label: 'UOM' },
      { fields: 'quantity', mappingFields: [], importance: 'Required', label: 'Quantity' },
      { fields: 'division', mappingFields: [], importance: 'Optional', label: 'Division' },
   ]);
   const [excelData, setExcelData] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const debouncedSearch = useDebounce(searchTerm, 600);
   const [selectedRow, setSelectedRow] = useState(new Set());
   const [levelMap, setLevelMap] = useState({});
   const [lastLevelMap, setLastLevelMap] = useState({});
   const [parentMap, setParentMap] = useState({});
   const [expandedRows, setExpandedRows] = useState(new Set());
   const [selectedBoqForModal, setSelectedBoqForModal] = useState(null);
   const [isAssigningParent, setIsAssigningParent] = useState(false);
   const [autoIncreaseLevel, setAutoIncreaseLevel] = useState(true);
   const [pageBreakWord, setPageBreakWord] = useState('');
   const [pageBreakModal, setPageBreakModal] = useState(false);

   const isLastLevelRow = (row) => {
      return (
         row.lastLevel ||
         row.uom ||
         (row.quantity && row.quantity !== 0)
      );
   };

   const findParentSno = (currentIndex, level) => {
      if (level <= 1) return 0;
      // Look for the nearest previous row with level = level - 1
      for (let i = currentIndex - 1; i >= 0; i--) {
         if (excelData[i].level === level - 1) {
            return excelData[i].sno;
         }
      }
      return 0;
   };

   const isRowVisible = (row) => {
      // Root rows (level 0 or 1) are always visible unless a level 0 item is nested (which shouldn't happen)
      // Actually, any row whose parent is expanded is visible.
      if (!row.parentSno) return true;

      let currentParentSno = row.parentSno;
      while (currentParentSno) {
         if (!expandedRows.has(currentParentSno)) return false;
         const parent = excelData.find(item => item.sno === currentParentSno);
         currentParentSno = parent?.parentSno || 0;
      }
      return true;
   };

   useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllTemplate`, {
         headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            "Content-Type": "application/json",

         }
      }).then(res => {
         if (res.status === 200) {
            setTemplateList(res.data);
         }
      }).catch(err => {
         if (err?.response?.status === 401) {
            handleUnauthorized(navigate);
         }
      })
   }, [])
   const templateOption = templateList.map(temp => ({
      value: temp.id,
      label: temp.templateName
   }));

   useEffect(() => {
      const handleDragOver = (e) => {
         throttledAutoScroll(e);
      };
      window.addEventListener('dragover', handleDragOver);
      return () => {
         window.removeEventListener('dragover', handleDragOver);
      };
   }, []);


   const removeFile = () => {
      setBOQfile(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
      setSelectedSheet(null);
      setColumns([]);
      setDraggedColumn(null);
      setSelectedTemplate(null);
      setFileType('');
      setSheetOption([]);
      setExcelData([]);
      setSearchTerm('');
      setLevelMap({});
      setLastLevelMap({});
      setParentMap({});
      setSection('columnMapping');
      setUploadScreen(false);
      setSelectedRow(new Set());
      setInternalFields(prev =>
         prev.map(f => ({ ...f, mappingFields: [] }))
      );
      setPageBreakWord('');
   };
   const getExcelSheets = (event) => {
      const file = event.target.files[0];
      setBOQfile(file);

      const fileName = file.name;
      const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      setFileType(ext);

      const formData = new FormData();
      formData.append('file', file);

      axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/excel/getSheets`, formData, {
         headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
         }
      }).then(res => {
         if (res.status === 200) {
            const response = res.data;
            switch (ext) {
               case 'pdf':
                  setSheetOption(response.map(name => ({ label: `Page ${name}`, value: name })));
                  break;
               case 'xlsx':
               case 'xls':
                  setSheetOption(response.map(name => ({ label: name, value: name })));
                  break;
               default:
                  toast.error(`Unsupported file type: ${ext}`);
            }
         }
      }).catch(err => {
         if (err?.response?.status === 401) {
            handleUnauthorized(navigate);
         }
      })
   }

   const loadSheetColumn = (sheetValue) => {
      const formData = new FormData();
      formData.append('file', BOQfile);
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/excel/getColumns/${sheetValue}`, formData, {
         headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
         }
      }).then(res => {
         if (res.status === 200) {
            setColumns(Array.isArray(res.data) ? res.data : []);
         }
      }).catch(err => {
         if (err?.response?.status === 401) {
            handleUnauthorized(navigate);
         }
      })
   }
   const handleDragStart = (e, column) => {
      setDraggedColumn(column);
      const ghost = document.createElement("div");
      ghost.style.position = "absolute";
      ghost.style.top = "-9999px";
      ghost.style.left = "-9999px";
      ghost.style.padding = "8px 12px";
      ghost.style.background = "#F0FDF4";
      ghost.style.border = "0.5px solid #2BA95A";
      ghost.style.borderRadius = "6px";
      ghost.style.fontSize = "14px";
      ghost.style.minWidth = "10%";
      ghost.style.textAlign = "center";
      ghost.style.maxWidth = "30%";
      ghost.innerHTML = column;
      ghost.style.color = "#2BA95A";
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 0, 0);

      setTimeout(() => {
         document.body.removeChild(ghost);
      }, 0);
   };
   const loadTemplate = (templateId) => {
      if (columns.length === 0 && fileType !== 'pdf' && !selectedSheet) {
         toast.error(fileType === 'pdf' ? "Please select a start page first to load columns." : "Please select an Excel sheet first to load columns.");
         setSelectedTemplate(null);
         return;
      }
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getTemplate/${templateId}`,
         {
            headers: {
               Authorization: `Bearer ${sessionStorage.getItem('token')}`,
               "Content-Type": 'application/json'
            }
         }
      ).then(res => {
         if (res.status === 200) {
            const response = res.data;
            const templateMapping = response.templateMapping;
            const availableColumns = new Set(columns);
            // Flatten all mapped column names from the template (now arrays)
            const allMappedNames = Object.values(templateMapping).flat();
            const allColumnsPresent = allMappedNames.every(mappedName =>
               availableColumns.has(mappedName)
            );
            if (!allColumnsPresent) {
               toast.error("Template mapping failed: The uploaded file is missing one or more columns required by this template.");
               setSelectedTemplate(null);
               setInternalFields(prev =>
                  prev.map(f => ({ ...f, mappingFields: [] }))
               );
               return;
            }
            const updatedInternalFields = internalFields.map(field => {
               const mappedColumns = templateMapping[field.fields];

               return {
                  ...field,
                  mappingFields: Array.isArray(mappedColumns) ? mappedColumns : (mappedColumns ? [mappedColumns] : [])
               };
            });

            setInternalFields(updatedInternalFields);
            toast.success("Template applied successfully.");

         }
      }).catch(err => {
         if (err?.response?.status === 401) {
            handleUnauthorized(navigate);
         }
         toast.error("Error loading template.");
      });
   }
   useEffect(() => {
      if (BOQfile) {
         fetchExcelData();
      }
   }, [debouncedSearch]);
   const fetchExcelData = async () => {
      if (!BOQfile) {
         toast.error("Please upload a BOQ file");
         return;
      }
      const columnMapping = internalFields.reduce((acc, item) => {
         if (item.mappingFields && item.mappingFields.length > 0) {
            acc[item.fields] = item.mappingFields;
         }
         return acc;
      }, {});

      if (Object.keys(columnMapping).length === 0) {
         toast.error("Please map at least one column");
         return;
      }
      try {
         setLoading(true);
         const formData = new FormData();
         formData.append('file', BOQfile);
         formData.append('sheetName', selectedSheet);
         const columnMappingBlob = new Blob([JSON.stringify(columnMapping)], {
            type: 'application/json'
         });
         formData.append('columnMapping', columnMappingBlob);
         formData.append('pageBreakWord', pageBreakWord);

         const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/project/extractedBOQ?search=${debouncedSearch}`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
               }
            }
         );
         const merged = response.data.map(item => ({
            ...item,
            level: levelMap[item.sno] ?? item.level,
            lastLevel: isLastLevelRow(item),
            parentSno: parentMap[item.sno] ?? item.parentSno,
         }));
         setExcelData(merged);

         // Auto-expand Level 1 items
         const level1Snos = merged.filter(item => item.level === 1).map(item => item.sno);
         if (level1Snos.length > 0) {
            setExpandedRows(prev => {
               const updated = new Set(prev);
               level1Snos.forEach(sno => updated.add(sno));
               return updated;
            });
         }
      } catch (error) {
         console.error("Error fetching Excel data:", error);
         toast.error("Failed to load Excel data");
      } finally {
         setLoading(false);
         setSection('levelMapping');
      }
   };

   // const mapFields = () => {
   //    setLoading(true);
   //    const mapping = {};
   //    const formData = new FormData();
   //    formData.append('file', BOQfile);
   //    internalFields.forEach(field => {
   //       if (field.mappingFields) {
   //          mapping[field.fields] = field.mappingFields;
   //       }
   //    })
   //    const mappingBlob = new Blob(
   //       [JSON.stringify(mapping)],
   //       { type: 'application/json' }
   //    );
   //    formData.append('columnMapping', mappingBlob);
   //    axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/mapBOQ/${selectedSheet ? selectedSheet : 'null'}/${projectId}`, formData,
   //       {
   //          headers: {
   //             Authorization: `Bearer ${sessionStorage.getItem('token')}`,
   //          }
   //       }
   //    ).then((res) => {
   //       if (res.status === 200) {
   //          setSheetOption(prev =>
   //             prev.filter(option => option.value !== selectedSheet)
   //          );
   //          plate();
   //          toast.success("BOQ Data imported SuccessFully");
   //          sheetOption.length === 1 && (setTimeout(() => {
   //             window.location.href = `/boqdefinition/${projectId}`;
   //          }, 3000));
   //          if (fileType === 'pdsetSelectedSheet(null);
   //          setColumns([]);
   //          setDraggedColumn(null);
   //          const updatedInternalFields = internalFields.map(field => ({
   //             ...field,
   //             mappingFields: ''
   //          }));
   //          setInternalFields(updatedInternalFields);
   //          setSelectedTemf') {
   //             (setTimeout(() => {
   //                window.location.href = `/boqdefinition/${projectId}`;
   //             }, 3000))
   //          }
   //       }
   //    }
   //    ).catch(err => {
   //       if (err?.response?.status === 401) {
   //          handleUnauthorized(navigate);
   //       }
   //       toast.error("Something went wrong");
   //    }).finally(() => {
   //       setLoading(false);
   //    })
   // }
   const saveMappedBOQ = async () => {
      setLoading(true)
      try {
         if (!BOQfile) {
            toast.error("Please upload a BOQ file");
            return;
         }

         if (!selectedSheet) {
            toast.error(fileType === 'pdf' ? "Start page required" : "Sheet name required");
            return;
         }
         const formData = new FormData();
         formData.append("file", BOQfile);
         formData.append("sheetName", selectedSheet);
         formData.append("columnMapping", JSON.stringify(
            internalFields.reduce((acc, item) => {
               acc[item.fields] = item.mappingFields;
               return acc;
            }, {})
         ));

         formData.append("pageBreakWord", pageBreakWord);

         formData.append("parentChildMapping", JSON.stringify(parentMap));
         formData.append("lastLevelMapping", JSON.stringify(lastLevelMap));
         formData.append("levelMapping", JSON.stringify(levelMap));

         const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/mapBOQ/${effectiveProjectId}`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
               }
            }
         );
         if (response.status === 200) {
            toast.success("BOQ mapping saved successfully!");
            if (isExternalAccess) {
               window.parent.postMessage(
                  {
                     type: "FORM_SAVE_COMPLETED",
                     status: "SUCCESS",
                     message: "Data saved successfully",
                     data: {
                        projectId: effectiveProjectId,
                        boqCode: externalTederCode
                     },
                  },
                  "*"
               );
               setTimeout(() => {
                  navigate(`/external/boq-overview/${effectiveProjectId}/${token}${location.search}`);
               }, 3000);
               setSheetOption(prev =>
                  prev.filter(option => option.value !== selectedSheet)
               );
               setExcelData([]);
               setLastLevelMap({});
               setParentMap({});
               setLevelMap({});
               setSelectedRow(new Set());
               setSection('columnMapping');
               setSearchTerm('');
               toast.success("BOQ Data imported Successfully");
               return;
            }
            if (sheetOption.length === 1) {
               setTimeout(() => {
                  window.location.href = `/boqdefinition/${projectId}`;
               }, 3000);
            }
            setSheetOption(prev =>
               prev.filter(option => option.value !== selectedSheet)
            );
            plate();
            setExcelData([]);
            setLastLevelMap({});
            setParentMap({});
            setLevelMap({});
            setSelectedRow(new Set());
            setSection('columnMapping');
            setSearchTerm('');
            toast.success("BOQ Data imported Successfully");
            if (fileType === 'pdf') {
               setSelectedSheet(null);
               setColumns([]);
               setDraggedColumn(null);

               const updatedInternalFields = internalFields.map(field => ({
                  ...field,
                  mappingFields: []
               }));
               setInternalFields(updatedInternalFields);
               setSelectedTemplate(null);
               setTimeout(() => {
                  window.location.href = `/boqdefinition/${projectId}`;
               }, 3000);
            }
         }
      }
      catch (error) {
         // toast.error("Error saving BOQ mapping");
         if (isExternalAccess) {
            window.parent.postMessage(
               {
                  type: "FORM_SAVE_COMPLETED",
                  status: "FAILED",
                  message: error.response?.data?.message || "Save failed",
               },
               "*"
            );
         }
      }
      finally {
         setLoading(false);
         if (!isExternalAccess) {
            window.location.href = `/boqdefinition/${projectId}`;
         }
      }
   };

   const templateSave = () => {
      if (!template.templateName || !template.templateCode) {
         toast.error("Template Name and Code are required");
         return;
      }
      const mapping = {};
      const formData = new FormData();
      formData.append('file', BOQfile);
      internalFields.forEach(field => {
         if (field.mappingFields && field.mappingFields.length > 0) {
            mapping[field.fields] = field.mappingFields;
         }
      })
      formData.append(
         "template",
         new Blob([JSON.stringify(template)], { type: "application/json" })
      );
      formData.append(
         "mapping",
         new Blob([JSON.stringify(mapping)], { type: "application/json" })
      );

      axios.post(
         `${import.meta.env.VITE_API_BASE_URL}/project/saveTemplateMapping`,
         formData,
         {
            headers: {
               Authorization: `Bearer ${sessionStorage.getItem("token")}`,
               "Content-Type": "multipart/form-data"
            }
         }
      ).then(res => {
         if (res.status === 200) {
            toast.success(res.data);
         }
      }).catch(err => {
         if (err?.response?.status === 401) {
            handleUnauthorized(navigate);
         }
         toast.error("Error saving template");
      });
   }

   const buildTree = () => {
      if (!excelData || excelData.length === 0) return [];
      const nodeMap = new Map();
      const roots = [];

      excelData.forEach(item => {
         nodeMap.set(item.sno, {
            ...item,
            children: []
         });
      });

      excelData.forEach(item => {
         const node = nodeMap.get(item.sno);
         const parentId = item.parentSno;
         if (!parentId) {
            roots.push(node);
         } else {
            const parent = nodeMap.get(parentId);
            if (parent) {
               parent.children.push(node);
            } else {
               roots.push(node);
            }
         }
      });
      return roots;
   };

   const toggleExpand = (sno) => {
      setExpandedRows(prev => {
         const updated = new Set(prev);
         if (updated.has(sno)) {
            updated.delete(sno);
         } else {
            updated.add(sno);
         }
         return updated;
      });
   };

   const getLevelColor = (level) => {
      const colors = ['#9333EA', '#2563EB', '#CA8A04', '#DC2626', '#059669', '#D97706'];
      if (level > 0) {
         return colors[(level - 1) % colors.length];
      }
      return '#6B7280';
   };

   const renderNode = (node) => {
      const isExpanded = expandedRows.has(node.sno);
      const isLeaf = isLastLevelRow(node) || (node.children && node.children.length === 0);

      const icon = isLeaf
         ? <FileText size={15} color={'#2BA95A'} strokeWidth={2.5} />
         : <Folder size={15} color={getLevelColor(node.level)} strokeWidth={2.5} />;

      const chevron = !isLeaf && (
         <span onClick={(e) => { e.stopPropagation(); toggleExpand(node.sno); }} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginRight: '4px' }}>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
         </span>
      );

      return (
         <div key={node.sno} className="tree-node-container" style={{ marginLeft: node.parentSno ? '15px' : '0' }}>
            <div className="d-flex align-items-center mb-1">
               {chevron}
               {icon}
               <span className='ms-1' style={{ fontSize: '13px', fontWeight: node.level === 1 ? '600' : '400', whiteSpace: 'nowrap' }}>
                  {boqNameDisplay(node.boqName || node.boqCode, 20)}
               </span>
            </div>
            {isExpanded && Array.isArray(node.children) && node.children.length > 0 && (
               <div className="tree-children">
                  {node.children.map(child => renderNode(child))}
               </div>
            )}
         </div>
      );
   };

   const fileUpload = () => {
      return (
         <>
            <div className='upload-file p-2'>
               <div className='col-12 text-center'>
                  <FaCloudUploadAlt size={40} />
               </div>
               <div className='col-12 text-center mt-2'>
                  Upload BOQ file
               </div>
               <div className='col-12 text-center mt-2'>
                  <button className='btn action-button mt-2 px-5' onClick={() => { fileInputRef.current.click() }}>Choose File</button>
                  <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => getExcelSheets(e)} />
               </div>
               <div className='col-12 text-center mt-4' style={{ fontSize: '12px' }}>
                  Supported formats: .xlsx, .xls, .pdf .
               </div>
            </div>
            <div className='file-description p-2 mt-3'>
               <p className='fw-bold ms-2 mt-3'>File Description :</p>
               <ul className='ms-4' style={{ fontSize: '15px' }}>
                  <li>File format (.xlsx, .xls, .pdf)</li>
                  <li>Pdf must contains data in table format</li>
                  <li>First row of excel file should contain column headers</li>
                  <li>Required columns: BOQ Code,Item Description (or) BOQ Name, Unit, Quantity</li>
                  <li>Ensured that the BOQ table contains only BOQ-related details</li>
               </ul>
            </div>
         </>
      );
   }
   const boqNameDisplay = (boqName, length) => {
      return boqName && boqName.length > length
         ? boqName.substring(0, length) + '...'
         : boqName;
   }
   function handleBulkClear() {
      if (confirmModal.type === 'level') {
         setLevelMap({});
         setParentMap({});
         setLastLevelMap({});
         setExpandedRows(new Set());
         setExcelData(prev =>
            prev.map(item => ({
               ...item,
               level: 0,
               parentSno: 0,
               lastLevel: (item.uom || (item.quantity && item.quantity !== 0)) ? true : false
            }))
         );
         toast.success("All levels and structure cleared successfully.");
      } else if (confirmModal.type === 'parent') {
         setParentMap({});
         setExcelData(prev =>
            prev.map(item => ({
               ...item,
               parentSno: 0
            }))
         );
         toast.success("All parents removed successfully.");
      }
      setConfirmModal({ show: false, type: '', message: '' });
   }

   const levelMapping = () => {
      const treeData = buildTree();
      console.log(treeData);

      const handleSingleLevelChange = (sno, level) => {
         const itemIndex = excelData.findIndex(item => item.sno === sno);
         if (itemIndex === -1) return;

         const updatedLevelMap = { ...levelMap };
         const updatedParentMap = { ...parentMap };

         if (level === 0 || isNaN(level)) {
            updatedLevelMap[sno] = 0;
            delete updatedParentMap[sno];
         } else {
            // Level L for current row, L+1 for all subsequent rows
            updatedLevelMap[sno] = level;
            updatedParentMap[sno] = findParentSno(itemIndex, level);

            const nextLevel = autoIncreaseLevel ? level + 1 : level;
            const parentSnoForSubsequent = autoIncreaseLevel ? sno : updatedParentMap[sno];

            let hasFoundLastLevel = false;
            for (let i = itemIndex + 1; i < excelData.length; i++) {
               const currentRow = excelData[i];
               const currentSno = currentRow.sno;
               const isLast = isLastLevelRow(currentRow);

               if (hasFoundLastLevel && !isLast) {
                  break;
               }

               updatedLevelMap[currentSno] = nextLevel;
               updatedParentMap[currentSno] = parentSnoForSubsequent;

               if (isLast) {
                  hasFoundLastLevel = true;
               }
            }
         }

         setLevelMap(updatedLevelMap);
         setParentMap(updatedParentMap);

         setExcelData(prev =>
            prev.map(item => {
               const newLevel = updatedLevelMap[item.sno] ?? item.level;
               const newParent = updatedParentMap[item.sno] ?? item.parentSno;
               return {
                  ...item,
                  level: newLevel,
                  parentSno: newParent,
                  lastLevel: isLastLevelRow({ ...item, level: newLevel })
               };
            })
         );

         // Expand all parents in the chain
         if (level > 0) {
            setExpandedRows(prev => {
               const updated = new Set(prev);
               // Expand the current one and all newly created parents in the chain
               for (let i = itemIndex; i < excelData.length; i++) {
                  updated.add(excelData[i].sno);
               }
               return updated;
            });
         }
      };

      const toggleSelection = (sno) => {
         setSelectedRow(prev => {
            const updated = new Set(prev);
            if (updated.has(sno)) {
               updated.delete(sno);
            } else {
               updated.add(sno);
            }
            return updated;
         });
      };

      const assignLevel = (level) => {
         if (selectedRow.size === 0) {
            toast.error("Please select at least one row.");
            return;
         }

         const sortedSelected = [...selectedRow].sort((a, b) => {
            const indexA = excelData.findIndex(item => item.sno === a);
            const indexB = excelData.findIndex(item => item.sno === b);
            return indexA - indexB;
         });

         sortedSelected.forEach(sno => {
            handleSingleLevelChange(sno, level);
         });

         setSelectedRow(new Set());
      };

      const clearLevel = () => {
         if (selectedRow.size === 0) {
            setConfirmModal({
               show: true,
               type: 'level',
               message: "Are you sure you want to clear levels for all the BOQs?"
            });
            return;
         }

         setLevelMap(prev => {
            const updated = { ...prev };
            selectedRow.forEach(sno => delete updated[sno]);
            return updated;
         });
         setParentMap(prev => {
            const updated = { ...prev };
            selectedRow.forEach(sno => delete updated[sno]);
            return updated;
         });
         setLastLevelMap(prev => {
            const updated = { ...prev };
            selectedRow.forEach(sno => delete updated[sno]);
            return updated;
         });
         setExcelData(prev =>
            prev.map(item =>
               selectedRow.has(item.sno)
                  ? {
                     ...item,
                     level: 0,
                     parentSno: 0,
                     lastLevel: isLastLevelRow(item)
                  }
                  : item
            )
         );
         setSelectedRow(new Set());
      };

      const assignLastLevel = () => {
         setLastLevelMap(prev => {
            const updated = { ...prev };
            selectedRow.forEach(sno => {
               updated[sno] = true;
            });
            return updated;
         });
         setExcelData(prev =>
            prev.map(item =>
               selectedRow.has(item.sno)
                  ? { ...item, lastLevel: true, level: item.level ?? 0 }
                  : item
            )
         );
         setSelectedRow(new Set());
      };

      const assignParent = () => {
         if (selectedRow.size === 0) {
            toast.error("Please select the rows you want to assign to a parent first.");
            return;
         }
         setIsAssigningParent(true);
         toast.info("Click on a row in the table to set it as the parent.");
      };

      const handleParentSelect = (pSno) => {
         if (!isAssigningParent) return;

         const parentRow = excelData.find(item => item.sno === pSno);
         if (!parentRow) return;

         if (selectedRow.has(pSno)) {
            toast.error("Cannot assign a row as its own parent.");
            setIsAssigningParent(false);
            return;
         }

         setParentMap(prev => {
            const updated = { ...prev };
            selectedRow.forEach(sno => {
               updated[sno] = pSno;
            });
            return updated;
         });
         setExcelData(prev =>
            prev.map(item =>
               selectedRow.has(item.sno)
                  ? { ...item, parentSno: pSno }
                  : item
            )
         );

         setExpandedRows(prev => {
            const updated = new Set(prev);
            updated.add(pSno);
            return updated;
         });

         setSelectedRow(new Set());
         setIsAssigningParent(false);
         toast.success(`Assigned selected items to parent S.No: ${pSno}`);
      };

      const removeParent = () => {
         if (selectedRow.size === 0) {
            setConfirmModal({
               show: true,
               type: 'parent',
               message: "Are you sure you want to remove parents for all the BOQs?"
            });
            return;
         }
         setParentMap(prev => {
            const updated = { ...prev };
            selectedRow.forEach(sno => delete updated[sno]);
            return updated;
         });
         setExcelData(prev =>
            prev.map(item =>
               selectedRow.has(item.sno)
                  ? { ...item, parentSno: 0 }
                  : item
            )
         );
         setSelectedRow(new Set());
         toast.success("Removed parents from selected rows.");
      };

      const isRowVisible = (item) => {
         if (!item.parentSno) return true;
         let currentParent = item.parentSno;
         while (currentParent) {
            if (!expandedRows.has(currentParent)) return false;
            const parent = excelData.find(i => i.sno === currentParent);
            currentParent = parent?.parentSno || 0;
         }
         return true;
      };

      const expandAll = () => {
         const allSnos = excelData.map(item => item.sno);
         setExpandedRows(new Set(allSnos));
      };

      const collapseAll = () => {
         setExpandedRows(new Set());
      };

      return (
         <>
            {isAssigningParent && (
               <div className="alert alert-info alert-dismissible fade show mb-0 rounded-0 border-0" style={{ position: 'sticky', top: 0, zIndex: 1050, backgroundColor: '#f0f9ff', color: '#0369a1' }}>
                  <div className="d-flex align-items-center justify-content-between px-3">
                     <div className="d-flex align-items-center">
                        <Link size={18} className="me-2" />
                        <span><strong>Manual Parent Assignment:</strong> Click on a row in the table to set it as the parent for the selected items.</span>
                     </div>
                     <button type="button" className="btn btn-sm btn-outline-info" onClick={() => setIsAssigningParent(false)}>
                        Cancel
                     </button>
                  </div>
               </div>
            )}

            <div className='row g-3 ms-1 me-2 mt-4'>
               <div className='col-12 p-2'>
                  <div className='bg-white rounded-3 h-100' style={{ border: '1px solid #0051973D' }}>
                     <div className='row g-2 p-3 align-items-center justify-content-between'>
                        <div className='col-lg-4 col-md-5 col-sm-12'>
                           <label className="text-start d-block">Search BOQ</label>
                           <div className="position-relative" style={{ width: '100%' }}>
                              <Search
                                 className="position-absolute"
                                 style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', zIndex: 1 }}
                                 size={18}
                              />
                              <input
                                 type="text"
                                 className="form-input w-100"
                                 placeholder="Search by BOQ Code or Description..."
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                                 style={{ paddingRight: '30px' }}
                              />
                           </div>
                        </div>
                        <div className='col-lg-8 col-md-7 col-sm-12 d-flex justify-content-end align-items-end pt-4'>
                           <div className="form-check d-flex align-items-center me-3 mb-2">
                              <input
                                 type="checkbox"
                                 className="form-check-input me-2 mt-0"
                                 id="autoIncrease"
                                 checked={autoIncreaseLevel}
                                 onChange={(e) => setAutoIncreaseLevel(e.target.checked)}
                                 style={{ cursor: 'pointer' }}
                              />
                              <label className="form-check-label text-nowrap" htmlFor="autoIncrease" style={{ fontSize: '13px', cursor: 'pointer', color: '#005197', fontWeight: '500' }}>Auto-increase levels</label>
                           </div>
                           <button className='btn cancel rounded-2 p-2 me-2' style={{ fontSize: '13px' }} onClick={expandAll}>
                              <ExpandIcon width={20} height={20} /><span className='ms-1'>Expand All</span>
                           </button>
                           <button className='btn cancel rounded-2 p-2 me-2' style={{ fontSize: '13px' }} onClick={collapseAll}>
                              <CollapseIcon width={20} height={20} /><span className='ms-1'>Collapse All</span>
                           </button>
                           <button className='btn cancel rounded-2 p-2 me-2' style={{ fontSize: '13px' }} onClick={clearLevel}>
                              <X size={20} /><span className='ms-1'>Clear Level</span>
                           </button>
                        </div>
                     </div>
                     <div className='p-3'>
                        {excelData.length > 0 ? (
                           <div className="boq-data table-responsive" style={{ maxHeight: '140vh', overflowY: 'auto' }}>
                              <table className="table align-middle boq-config-table">
                                 <thead className="text-white">
                                    <tr>
                                       <th style={{ width: '30px' }}></th>
                                       <th className="text-center text-nowrap" style={{ width: '60px' }}>Level</th>
                                       <th style={{ width: '100px' }} className='text-nowrap'>BOQ Code</th>
                                       <th className='text-nowrap text-start'>BOQ Description</th>
                                       <th className="text-center text-nowrap" style={{ width: '100px' }}>Division</th>
                                       <th className="text-center text-nowrap" style={{ width: '100px' }}>Unit</th>
                                       <th className="text-center text-nowrap" style={{ width: '140px' }}>Quantity</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {excelData.filter(isRowVisible).map((item, index) => (
                                       <tr key={item.sno}
                                          className={`${item.level > 0 ? `level-bg-${((item.level - 1) % 10) + 1}` : ''} ${selectedRow.has(item.sno) ? 'selected-row' : ''} ${isAssigningParent ? 'assign-parent-mode' : ''}`}
                                          onClick={() => {
                                             if (isAssigningParent) {
                                                handleParentSelect(item.sno);
                                             } else {
                                                toggleSelection(item.sno);
                                             }
                                          }}

                                          style={{ cursor: 'pointer' }}
                                       >
                                          <td className="text-center" style={{ width: '30px' }}>
                                             {!isLastLevelRow(item) && item.level > 0 && (
                                                <span
                                                   onClick={(e) => { e.stopPropagation(); toggleExpand(item.sno); }}
                                                   style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                   {expandedRows.has(item.sno) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </span>
                                             )}
                                          </td>
                                          <td className="text-center text-nowrap">
                                             <input
                                                type="number"
                                                className="form-control form-control-sm mx-auto"
                                                style={{
                                                   width: '50px',
                                                   fontSize: '12px',
                                                   padding: '2px 4px',
                                                   borderRadius: '4px',
                                                   border: '1px solid #0051973D'
                                                }}
                                                min="0"
                                                value={item.level || ''}
                                                onClick={(e) => e.stopPropagation()}
                                                onWheel={(e) => e.target.blur()}
                                                onChange={(e) => handleSingleLevelChange(item.sno, parseInt(e.target.value))}
                                             />
                                          </td>
                                          <td className='text-nowrap' title={item.boqCode}>
                                             {boqNameDisplay(item.boqCode, 9)}
                                          </td>
                                          <td className="text-start" title="Click to view the full description" onClick={(e) => { e.stopPropagation(); setSelectedBoqForModal(item); }} style={{ cursor: 'pointer', whiteSpace: 'normal', wordBreak: 'break-word', minWidth: '400px' }}>
                                             <div>
                                                {item.boqName}
                                             </div>
                                          </td>
                                          <td className="text-center text-nowrap">{item.division || '-'}</td>
                                          <td className="text-center text-nowrap">{item.uom || '-'}</td>
                                          <td className="text-center text-nowrap">
                                             {item.quantity && item.quantity !== 0 ? item.quantity.toFixed(3) : "-"}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>

                           </div>
                        ) : (
                           <div className="text-center py-5 text-muted">
                              <h5>No BOQ items extracted</h5>
                              <p>Please upload an Excel file and map the columns.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

            </div>
            <div className='d-flex justify-content-end mt-4'>
               <button className='btn cancel-button mt-2 me-4' onClick={removeFile}>Cancel</button>
               <button className='btn action-button mt-2 fs-6' onClick={saveMappedBOQ}>{loading ? (<span className="spinner-border spinner-border-sm text-white"></span>) : (<span>Import BOQ Data</span>)}</button>
            </div>
            {selectedBoqForModal && (
               <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
                  <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                     <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                        <div className="modal-header border-0 pb-0">
                           <h5 className="modal-title fw-bold" style={{ color: '#005197' }}>BOQ Description : {selectedBoqForModal.boqCode}</h5>
                           <button type="button" className="btn-close" onClick={() => setSelectedBoqForModal(null)}></button>
                        </div>
                        <div className="modal-body py-4 text-start">
                           <p className="mb-0 text-muted" style={{ fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                              {selectedBoqForModal.boqName}
                           </p>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                           <button
                              type="button"
                              className="btn action-button px-4"
                              onClick={() => setSelectedBoqForModal(null)}
                           >
                              Close
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </>

      );

   }
   const columnMapping = () => {
      return (
         <div className='ms-3 me-3 bg-white mt-5 rounded-3 p-3' style={{ border: '1px solid #0051973D' }}>
            <div className='text-start fw-bold mb-4'>
               Column Mapping
            </div>
            <div className='row mt-3'>
               <div className='col-12'>
                  <label className="projectform-select text-start d-block">
                     Mapping Template
                  </label>
                  <Select placeholder="Select Mapping Template"
                     options={templateOption}
                     className="w-100"
                     classNamePrefix="select"
                     isClearable
                     onChange={(option) => {
                        const templateValue = option?.value || null;
                        setSelectedTemplate(templateValue);
                        if (templateValue) {
                           loadTemplate(templateValue);
                        } else {
                           setInternalFields(prev =>
                              prev.map(f => ({ ...f, mappingFields: [] }))
                           );
                        }
                     }}
                  />
               </div>
            </div>
            {(selectedSheet || (Array.isArray(columns) && columns.length > 0)) && (<div className='mt-5'>
               <div className='mb-4 text-start fw-bold'>Map the Fields</div>
               <div className='row d-flex justify-content-between'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                     <ColumnIcon /><span className='fw-bold fs-6 ms-2'>Excel Feilds</span>
                     <div className='mt-1 rounded-3 p-2'>
                        {(Array.isArray(columns) ? columns : [])
                           .filter(col => !internalFields.some(f => Array.isArray(f.mappingFields) && f.mappingFields.includes(col)))
                           .map((col, index) => (
                              <div className={`excel-column-container me-2 p-3 rounded-3 mt-3 mb-3 d-flex justify-content-between align-items-center`} key={index} draggable={true}
                                 onDragStart={(e) =>
                                    handleDragStart(e, col)
                                 }
                              >
                                 <span>{col}</span>
                                 <span><Drag /></span>
                              </div>
                           ))}
                     </div>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                     <InternalIcon /><span className='fw-bold fs-6 ms-2'>Internal Feilds</span>
                     <div className='mt-1 rounded-3 p-2'>
                        {internalFields.map((col, index) => (
                           <div key={index}>
                              <div className={`internal-column-container ${col.mappingFields.length > 0 ? 'mapped ' : ' '} me-2 p-3 rounded-3 mt-3 mb-3 d-flex flex-column justify-content-between text-start`}
                                 onDragOver={(e) => e.preventDefault()}
                                 onDrop={() => {
                                    if (draggedColumn) {
                                       const updated = [...internalFields];
                                       const currentMappings = [...updated[index].mappingFields];
                                       if (!currentMappings.includes(draggedColumn)) {
                                          currentMappings.push(draggedColumn);
                                          updated[index].mappingFields = currentMappings;
                                          setInternalFields(updated);
                                       }
                                       setDraggedColumn(null);
                                    }
                                 }}>
                                 <div className='d-flex justify-content-between'>
                                    <span className='mb-1'>{col.label}</span>
                                    <span className={`mapping-condition ${col.mappingFields.length === 0 ? (col.importance === 'Required' ? 'required' : 'optional') : 'mapped'}`}>
                                       {col.mappingFields.length > 0 ? 'Mapped' : col.importance}
                                    </span>
                                 </div>
                                 {col.mappingFields.length > 0 &&
                                    col.mappingFields.map((mappedCol, chipIndex) => (
                                       <div key={chipIndex} className='d-flex justify-content-between bg-white w-100 rounded mt-1'>
                                          <div>
                                             <span className='ms-2'><Mapping /></span>
                                             <span className='ms-2'>{mappedCol}</span>
                                          </div>
                                          <span className='me-2' style={{ cursor: 'pointer' }}>
                                             <X color='#C33D1B' size={14} onClick={() => {
                                                const updated = [...internalFields];
                                                updated[index].mappingFields = updated[index].mappingFields.filter((_, i) => i !== chipIndex);
                                                setInternalFields(updated);
                                             }} />
                                          </span>
                                       </div>
                                    ))
                                 }
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>)}
            {!selectedTemplate && (
               <div className='mt-4'>
                  <div className='fw-bold text-start mb-4'>Save as Template</div>
                  <div className='d-flex justify-content-between'>
                     <div className='col-lg-6 col-md-6 col-sm-12 mb-4'>
                        <div className='p-2'>
                           <label className="projectform-select text-start d-block">
                              Template Name
                           </label>
                           <input type="text" className="form-input w-100" placeholder="Enter Template Name" value={template.templateName}
                              onChange={(e) => { setTemplate({ ...template, templateName: e.target.value }) }}
                           />
                        </div>
                     </div>
                     <div className='col-lg-6 col-md-6 col-sm-12 mb-4'>
                        <div className='p-2'>
                           <label className="projectform-select text-start d-block">
                              Template code
                           </label>
                           <input type="text" className="form-input w-100" placeholder="Enter Template Code" value={template.templateCode}
                              onChange={(e) => { setTemplate({ ...template, templateCode: e.target.value }) }}
                           />
                        </div>

                     </div>
                  </div>
                  <div className='col-12 mb-4'>
                     <div className='p-2'>
                        <label className="projectform-select text-start d-block">
                           Template Description
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Template Description" value={template.description}
                           onChange={(e) => { setTemplate({ ...template, description: e.target.value }) }}
                        />
                     </div>
                  </div>
                  <div className='d-flex justify-content-end'>
                     <button className='btn template-button' onClick={templateSave}><Template /> <span className='ms-2'>Save Template</span></button>
                  </div>
               </div>
            )}
            <div className='d-flex justify-content-end mt-4'>
               <button className='btn action-button mt-2 fs-6' onClick={() => setPageBreakModal(true)}><ArrowRight size={18} /> <span className='ms-1'>Next</span></button>
            </div>
         </div>
      )
   }
   const mappingConfig = () => {
      const renderSection = (section) => {
         switch (section) {
            case 'columnMapping':
               return columnMapping();
            case 'levelMapping':
               return levelMapping();
            default:
               return null;
         }
      }
      return (
         <>
            <div className='rounded-3 bg-white p-3 ms-3 me-3' style={{ border: '0.5px solid #0051973D' }}>
               <div className='d-flex justify-content-between mt-1 gap-2'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                     <div className='file-preview d-flex align-items-center justify-content-between mb-2'>
                        <div>
                           <span className='ms-2'><FileIcon /></span>
                           <span className='ms-2'>{BOQfile ? BOQfile.name : 'No file selected'}</span>
                        </div>
                        <span className='me-2' style={{ cursor: 'pointer' }}><X color='#C33D1B' size={20} onClick={removeFile} /></span>
                     </div>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                     <label className="projectform-select text-start d-block">
                        {fileType === 'pdf' ? 'Start Page' : 'Excel Sheet'}
                     </label>
                     <Select placeholder={fileType === 'pdf' ? 'Select Start Page' : 'Select Excel Sheet'}
                        options={sheetOption}
                        className="w-100"
                        classNamePrefix="select"
                        value={sheetOption.find(option => option.value === selectedSheet)}
                        isClearable
                        menuPlacement='auto'
                        onChange={(option) => {
                           const sheetValue = option?.value ?? null;
                           setSelectedSheet(sheetValue);
                           if (sheetValue) {
                              loadSheetColumn(sheetValue);
                           }
                        }}
                        isDisabled={false}
                     />
                  </div>
               </div>
            </div>
            <div className="d-flex ms-3 mt-5">
               <button className={`btn ${section === 'columnMapping' ? 'activeView' : 'bg-white'} px-3 py-2 border border-end-0 rounded-start rounded-0`} onClick={() => setSection('columnMapping')}>
                  <FileSymlink size={20} color={`${section === 'columnMapping' ? '#FFFFFF' : '#005197'}`} />
                  <span className="ms-2 fs-6">Column Mapping</span>
               </button>
               <button className={`btn ${section === 'levelMapping' ? 'activeView' : 'bg-white'} px-3 py-2 border border-start-0 rounded-end rounded-0`} onClick={() => { setSection('levelMapping'); }}>
                  <SlidersHorizontal size={20} color={`${section === 'levelMapping' ? '#FFFFFF' : '#005197'}`} />
                  <span className="ms-2 fs-6">Level Configuraton</span>
               </button>
            </div>
            {renderSection(section)}
         </>
      );
   }
   const renderContent = (section) => {
      switch (section) {
         case 'fileUpload':
            return fileUpload();
         case 'mappingConfig':
            return mappingConfig();
         default:
            return null;
      }
   }
   return (
      <div className='container-fluid p-2 min-vh-100'>
         <div className="text-start fw-bold ms-1 mt-2 mb-4">
            <ArrowLeft size={20} onClick={() => {
               if (isExternalAccess) {
                  navigate(`/external/boq-overview/${effectiveProjectId}/${token}${location.search}`);
               } else {
                  setUploadScreen(false);
               }
            }} /><span className='ms-2'>BOQ Definition</span>
         </div>
         {!BOQfile && (
            <div className='ms-2 mt-3 rounded-3 bg-white' style={{ border: '0.5px solid #0051973D' }}>
               <div className='tab-info col-12 h-100'>Upload BOQ File</div>
               <div className='text-start p-3 ms-4 mt-2 me-4'>
                  <p className='fw-bold'>{displayProjectName}</p>
                  {renderContent('fileUpload')}
               </div>
            </div>
         )}
         {BOQfile && (renderContent('mappingConfig'))}
         {confirmModal.show && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
               <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                     <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold" style={{ color: '#005197' }}>Confirm Action</h5>
                        <button type="button" className="btn-close" onClick={() => setConfirmModal({ show: false, type: '', message: '' })}></button>
                     </div>
                     <div className="modal-body py-4">
                        <p className="mb-0 text-muted" style={{ fontSize: '15px' }}>{confirmModal.message}</p>
                     </div>
                     <div className="modal-footer border-0 pt-0">
                        <button
                           type="button"
                           className="btn cancel-button px-4"
                           onClick={() => setConfirmModal({ show: false, type: '', message: '' })}
                        >
                           Cancel
                        </button>
                        <button
                           type="button"
                           className="btn action-button px-4"
                           onClick={handleBulkClear}
                        >
                           Confirm
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         {pageBreakModal && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
               <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                     <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold" style={{ color: '#005197' }}>Page Break Configuration</h5>
                        <button type="button" className="btn-close" onClick={() => setPageBreakModal(false)}></button>
                     </div>
                     <div className="modal-body py-4">
                        <label className="projectform-select text-start d-block mb-2">
                           Page Break Word
                        </label>
                        <input type="text" className="form-input w-100" placeholder="e.g. PTO, carried to summary" value={pageBreakWord} onChange={(e) => setPageBreakWord(e.target.value)} />
                     </div>
                     <div className="modal-footer border-0 pt-0">
                        <button
                           type="button"
                           className="btn cancel-button px-4"
                           onClick={() => {
                              setPageBreakWord('');
                              setPageBreakModal(false);
                              fetchExcelData();
                           }}
                        >
                           Continue without page
                        </button>
                        <button
                           type="button"
                           className="btn action-button px-4"
                           onClick={() => {
                              setPageBreakModal(false);
                              fetchExcelData();
                           }}
                           disabled={!pageBreakWord.trim()}
                        >
                           Proceed
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
export default BOQUpload;