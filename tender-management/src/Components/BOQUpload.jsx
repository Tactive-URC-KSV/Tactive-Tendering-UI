import { useState, useRef } from 'react';
import '../CSS/Styles.css'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, FileSymlink, FileText, Folder, Link, SlidersHorizontal, X } from 'lucide-react';
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
import useDebounce from '../Utills/useDebounce.js'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

const handleUnauthorized = () => {
   const navigate = useNavigate();
   navigate('/login');
}

const throttledAutoScroll = throttle(autoScrollWhileDragging, 50);

function BOQUpload({ projectId, projectName, setUploadScreen }) {
   const [section, setSection] = useState('columnMapping');
   const [loading, setLoading] = useState(false);
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
      { fields: 'boqCode', mappingFields: '', importance: 'Required', label: 'BOQ Code' },
      { fields: 'boqName', mappingFields: '', importance: 'Required', label: 'BOQ Name' },
      { fields: 'uom', mappingFields: '', importance: 'Required', label: 'UOM' },
      { fields: 'quantity', mappingFields: '', importance: 'Required', label: 'Quantity' },
   ]);
   const [startRow, setStartRow] = useState(0);
   const [endRow, setEndRow] = useState(0);
   const [excelData, setExcelData] = useState([]);
   const [currentPage, setCurrentPage] = useState(0);
   const [pageSize, setPageSize] = useState(50);
   const [totalPages, setTotalPages] = useState(0);
   const [totalItems, setTotalItems] = useState(0);
   const [searchTerm, setSearchTerm] = useState('');
   const debouncedSearch = useDebounce(searchTerm, 600);
   const [selectedRow, setSelectedRow] = useState(new Set());
   const [levelMap, setLevelMap] = useState({});
   const [lastLevelMap, setLastLevelMap] = useState({});
   const [parentMap, setParentMap] = useState({});
   const [isParentSelecting, setIsParentSelecting] = useState(false);
   const [selectedChildLevel, setSelectedChildLevel] = useState(null);

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
            handleUnauthorized();
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
      excelData([]);
      setCurrentPage(0);
      setPageSize(50);
      setTotalPages(0);
      setTotalItems(0);
      setSearchTerm('');
      setLevelMap({});
      setLastLevelMap({});
      setParentMap({});
      setSection('columnMapping');
      setUploadScreen(false);
      setSelectedRow(new Set());
      setInternalFields(prev =>
         prev.map(f => ({ ...f, mappingFields: '' }))
      );
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
                  setColumns(response);
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
            handleUnauthorized();
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
            setColumns(res.data);
         }
      }).catch(err => {
         if (err?.response?.status === 401) {
            handleUnauthorized();
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
         toast.error("Please select an Excel sheet first to load columns.");
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
            const mappedColumnNames = Object.values(templateMapping);
            const allColumnsPresent = mappedColumnNames.every(mappedName =>
               availableColumns.has(mappedName)
            );
            if (!allColumnsPresent) {
               toast.error("Template mapping failed: The uploaded file is missing one or more columns required by this template.");
               setSelectedTemplate(null);
               setInternalFields(prev =>
                  prev.map(f => ({ ...f, mappingFields: '' }))
               );
               return;
            }
            const updatedInternalFields = internalFields.map(field => {
               const mappedColumnName = templateMapping[field.fields];

               return {
                  ...field,
                  mappingFields: mappedColumnName || ''
               };
            });

            setInternalFields(updatedInternalFields);
            toast.success("Template applied successfully.");

         }
      }).catch(err => {
         if (err?.response?.status === 401) {
            handleUnauthorized();
         }
         toast.error("Error loading template.");
      });
   }
   useEffect(() => {
      if (BOQfile) {
         fetchExcelData(0, pageSize);
      }
   }, [debouncedSearch]);
   const fetchExcelData = async (page = 0, size = 50) => {
      if (!BOQfile) {
         toast.error("Please upload a BOQ file");
         return;
      }
      const columnMapping = internalFields.reduce((acc, item) => {
         if (item.mappingFields && item.mappingFields !== "") {
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
         formData.append('startRow', startRow.toString());
         formData.append('endRow', endRow.toString());

         const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/project/extractedBOQ?page=${page}&size=${size}&search=${debouncedSearch}`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
               }
            }
         );
         const merged = response.data.data.map(item => ({
            ...item,
            level: levelMap[item.sno] ?? item.level,
            lastLevel: lastLevelMap[item.sno] ?? item.lastLevel,
            parentSno: parentMap[item.sno] ?? item.parentSno,
         }));
         setExcelData(merged);
         setCurrentPage(response.data.currentPage);
         setTotalPages(response.data.totalPages);
         setPageSize(response.data.pageSize);
         setTotalItems(response.data.totalItems);
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
   //          handleUnauthorized();
   //       }
   //       toast.error("Something went wrong");
   //    }).finally(() => {
   //       setLoading(false);
   //    })
   // }
   const saveMappedBOQ = async () => {
      try {
         if (!BOQfile) {
            toast.error("Please upload a BOQ file");
            return;
         }

         if (!selectedSheet) {
            toast.error("Sheet name required");
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

         formData.append("parentChildMapping", JSON.stringify(parentMap));
         formData.append("lastLevelMapping", JSON.stringify(lastLevelMap));
         formData.append("levelMapping", JSON.stringify(levelMap));

         const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/mapBOQ/${projectId}`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
               }
            }
         );
         if (response.status === 200) {
            toast.success("BOQ mapping saved successfully!");

            setSheetOption(prev =>
               prev.filter(option => option.value !== selectedSheet)
            );

            plate();
            setExcelData([]);
            setCurrentPage(0);
            setTotalPages(0);
            setPageSize(50);
            setTotalItems(0);
            setLastLevelMap({});
            setParentMap({});
            setLevelMap({});
            setSelectedRow(new Set());
            setSection('columnMapping');
            setSearchTerm('');
            toast.success("BOQ Data imported Successfully");

            if (sheetOption.length === 1) {
               setTimeout(() => {
                  window.location.href = `/boqdefinition/${projectId}`;
               }, 3000);
            }

            if (fileType === 'pdf') {
               setSelectedSheet(null);
               setColumns([]);
               setDraggedColumn(null);

               const updatedInternalFields = internalFields.map(field => ({
                  ...field,
                  mappingFields: ''
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
         console.error("Failed to save mapped BOQ:", error);
         toast.error("Error saving BOQ mapping");
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
         if (field.mappingFields) {
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
            handleUnauthorized();
         }
         toast.error("Error saving template");
      });
   }

   const buildTree = () => {
      if (!excelData) return [];
      const nodeMap = new Map();
      const roots = [];
      excelData.forEach(item => {
         nodeMap.set(item.sno, {
            ...item,
            children: item.lastLevel ? null : []
         });
      });
      excelData.forEach(item => {
         const node = nodeMap.get(item.sno);
         const parentId = item.parentSno || parentMap[item.sno];
         if (!parentId) {
            roots.push(node);
         } else {
            const parent = nodeMap.get(parentId);
            if (parent) {
               if (!item.lastLevel) {
                  parent.children.push(node);
               } else {
                  parent.children.push(node);
               }
            }
         }
      });
      return roots;
   };

   const renderNode = (node) => {
      const marginClass = node.children === null
         ? "ms-3"
         : `ms-${(node.level - 1) * 2}`;
      const icon = node.level === 1 ? <Folder size={16} color={'#9333EA'} />
         : node.level === 2 ? <Folder size={16} color={'#2563EB'} />
            : node.level === 3 ? <Folder size={16} color={'#CA8A04'} />
               : node.lastLevel ? <FileText size={16} color={'#2BA95A'} />
                  : null;
      return (
         <div key={node.sno}>
            <div className={marginClass}>
               {icon}<span className='ms-1' style={{ fontSize: '14px' }}>{boqNameDisplay(node.boqCode || node.boqName, 10)}</span>
            </div>
            {Array.isArray(node.children) &&
               node.children.map(child => renderNode(child))}
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
   const levelMapping = () => {
      const treeData = buildTree();
      console.log(treeData);
      const goToPreviousPage = () => {
         if (currentPage > 0) {
            fetchExcelData(currentPage - 1);
         }
      };
      const goToNextPage = () => {
         if (currentPage < totalPages - 1) {
            fetchExcelData(currentPage + 1);
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
         if (level === 3) {
            let canAssign = true;
            excelData.forEach(item => {
               if (item.level === 2) {
                  const parent = parentMap[item.sno];
                  if (!parent) {
                     canAssign = false;
                  }
               }
            })
            Object.keys(levelMap).forEach(sno => {
               if (levelMap[sno] === 2) {
                  const parent = parentMap[sno];
                  if (!parent) {
                     canAssign = false;
                  }
               }
            })
            if (!canAssign) {
               toast.error("Cannot assign level 3 without assigning parents to all level 2 items.");
               return;
            }
         }

         setLevelMap(prev => {
            const updated = { ...prev };
            selectedRow.forEach(sno => {
               updated[sno] = level;
            });
            return updated;
         });
         setExcelData(prev =>
            prev.map(item =>
               selectedRow.has(item.sno) ? { ...item, level: level } : item
            )
         );

         setSelectedRow(new Set());
      };
      const clearLevel = () => {
         setLevelMap(prev => {
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
                  ? { ...item, level: 0, lastLevel: false }
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
      const levelDisplay = (level, lastLevel) => {
         if (lastLevel) {
            return (
               <span
                  className="badge px-2 py-1"
                  style={{ backgroundColor: "#2BA95A", color: "#ffffff" }}
               >
                  Last Level
               </span>
            );
         }
         const levelStyles = {
            1: "#9333EA",
            2: "#2563EB",
            3: "#CA8A04",
         };
         if (levelStyles[level]) {
            return (
               <span
                  className="badge px-2 py-1"
                  style={{ backgroundColor: levelStyles[level], color: "#ffffff" }}
               >
                  Level {level}
               </span>
            );
         }
         return <span>-</span>;
      };
      const startParentSelection = () => {
         if (selectedRow.size === 0) {
            toast.error("Please select at least one BOQ item.");
            return;
         }
         const selectedItems = [...selectedRow].map(sno =>
            excelData.find(item => item.sno === sno)
         );
         const nonLastLevelItems = selectedItems.filter(item => !item?.lastLevel);
         let childLevel;
         if (nonLastLevelItems.length === 0) {
            childLevel = 999;
         } else {
            const levels = nonLastLevelItems.map(item => item?.level || 0);
            const uniqueLevels = [...new Set(levels)];

            if (uniqueLevels.length > 1) {
               toast.error("Please select BOQs with the SAME level (Last level items ignored).");
               return;
            }
            childLevel = uniqueLevels[0];
            if (childLevel === 0) {
               toast.error("Level 0 items cannot have a parent. Assign a level first.");
               return;
            }
         }
         setSelectedChildLevel(childLevel);
         setIsParentSelecting(true);
      };

      const handleParentAssign = (parentSno) => {
         const updated = { ...parentMap };
         selectedRow.forEach(childSno => {
            if (childSno !== parentSno) {
               updated[childSno] = parentSno;
            }
         });
         setParentMap(updated);
         setIsParentSelecting(false);
         setExcelData(prev =>
            prev.map(item => ({
               ...item,
               parentSno: updated[item.sno] ?? item.parentSno
            }))
         );
         setSelectedRow(new Set());
      };
      const clearParent = () => {
         const updated = { ...parentMap };
         selectedRow.forEach(sno => delete updated[sno]);
         setParentMap(updated);

         setExcelData(prev =>
            prev.map(item =>
               selectedRow.has(item.sno)
                  ? { ...item, parentSno: 0 }
                  : item
            )
         );
         setSelectedRow(new Set());
      };

      return (
         <>
            <div className='row g-3 ms-1 me-2 mt-4'>
               <div className='col-lg-9 col-md-8 col-sm-12 p-2'>
                  <div className='bg-white rounded-3 h-100' style={{ border: '1px solid #0051973D' }}>
                     <div className='row g-2 p-3 align-items-end'>
                        <div className='col-lg-8 col-md-8 col-sm-8'>
                           <label className="text-start d-block">Search BOQ</label>
                           <input
                              type="text"
                              className="form-search-input w-100"
                              placeholder="Search by BOQ Code or Description..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                        {excelData.length > 0 && (
                           <div className='col-lg-4 col-md-4 col-sm-4 text-end'>
                              <div className='d-flex justify-content-around align-items-center'>
                                 <span className="text-muted small">
                                    {((currentPage) * pageSize) + 1} - {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems.toLocaleString()} items
                                 </span>
                                 <div className='d-flex align-items-center'>
                                    <button
                                       className="btn pagination btn-sm border-none me-2"
                                       onClick={goToPreviousPage}
                                       disabled={currentPage === 0}
                                    >
                                       <ChevronLeft size={18} />
                                    </button>
                                    <button
                                       className="btn pagination btn-sm border-none"
                                       onClick={goToNextPage}
                                       disabled={currentPage >= totalPages - 1}
                                    >
                                       <ChevronRight size={18} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                     <div className='p-3'>
                        {excelData.length > 0 ? (
                           <div className="boq-data table-responsive">
                              <table className="table align-middle">
                                 <thead className="text-white">
                                    <tr>
                                       <th></th>
                                       <th className="text-center text-nowrap" style={{ width: '80px' }}>S.No</th>
                                       <th style={{ width: '100px' }} className='text-nowrap'>BOQ Code</th>
                                       <th className='text-nowrap'>BOQ Description</th>
                                       <th className="text-center text-nowrap" style={{ width: '100px' }}>Unit</th>
                                       <th className="text-end text-nowrap" style={{ width: '80px' }}>Quantity</th>
                                       <th className="text-center text-nowrap" style={{ width: '140px' }}>Level</th>
                                       <th className="text-center text-nowrap" style={{ width: '100px' }}>Parent</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {excelData.map((item) => (
                                       <tr
                                          key={item.sno}
                                          className={
                                             `${item.lastLevel ? "last-level " : ""}` +
                                             (isParentSelecting &&
                                                (
                                                   item.lastLevel || item.level === 0 ||
                                                   (selectedChildLevel !== 999 &&
                                                      item.level !== selectedChildLevel - 1) ||
                                                   item.sno === [...selectedRow][0]
                                                )
                                                ? " disabled-parent-row"
                                                : ""
                                             ) +
                                             (isParentSelecting &&
                                                (
                                                   !item.lastLevel &&
                                                   (
                                                      selectedChildLevel === 999
                                                         ? (item.level > 0)
                                                         : (item.level === selectedChildLevel - 1)
                                                   )
                                                )
                                                ? " parent-selectable-row"
                                                : ""
                                             )
                                          }
                                          onClick={() => {
                                             if (!isParentSelecting) return;
                                             if (!item.lastLevel && item.level < selectedChildLevel) {
                                                handleParentAssign(item.sno);
                                             }
                                          }}
                                       >
                                          <td>{isParentSelecting && !item.lastLevel && item.level !== 0 && item.level < selectedChildLevel ? (<span></span>) : (<input
                                             type="checkbox"
                                             className="form-check-input"
                                             style={{ borderColor: '#005197' }}
                                             checked={selectedRow.has(item.sno)}
                                             onChange={() => toggleSelection(item.sno)}
                                          />)}
                                          </td>
                                          <td className="text-center text-nowrap">{item.sno}</td>
                                          <td className='text-nowrap' title={item.boqCode}>
                                             {boqNameDisplay(item.boqCode, 9)}
                                          </td>
                                          <td className='text-nowrap' title={item.boqName}>
                                             {boqNameDisplay(item.boqName, 15)}
                                          </td>
                                          <td className="text-center text-nowrap">{item.uom || '-'}</td>
                                          <td className="text-end text-nowrap">
                                             {item.quantity && item.quantity !== 0 ? item.quantity.toFixed(3) : "-"}
                                          </td>
                                          <td className="text-center text-nowrap">{levelDisplay(item.level, item.lastLevel)}</td>
                                          <td className="text-center text-muted small text-nowrap">
                                             {item.parentSno > 0 ? item.parentSno : 'Not Assigned'}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                              <div className='d-flex justify-content-between align-items-center mt-3'>
                                 <button
                                    className="btn pagination-bottom btn-sm border-none me-2"
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 0}
                                 >
                                    <ChevronLeft size={20} /> Previous
                                 </button>
                                 <span className='text-muted' style={{ fontSize: '13px' }}>{currentPage + 1 + " of " + totalPages + " Pages "}</span>
                                 <button
                                    className="btn pagination-bottom btn-sm border-none"
                                    onClick={goToNextPage}
                                    disabled={currentPage >= totalPages - 1}
                                 >
                                    Next <ChevronRight size={20} />
                                 </button>
                              </div>
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
               <div className='col-lg-3 col-md-4 col-sm-12 p-2'>
                  <div className='bg-white p-2 rounded-2 pt-3 h-100' style={{ border: '1px solid #0051973D' }}>
                     <div className='ms-2' style={{ borderBottom: '1px solid #0051973D' }}>
                        <div className='text-start fw-bold'>Assign Levels</div>
                        <div className='text-start text-muted pb-1 pt-1' style={{ fontSize: '13px' }}>Assign selected rows to a level</div>
                     </div>
                     <div className='d-flex ms-2 flex-column mt-3 align-items-around' style={{ borderBottom: '1px solid #0051973D' }}>
                        <button className='btn level1 rounded-2 p-2 mb-3' disabled={selectedRow.length < 0} onClick={() => assignLevel(1)}>
                           <span className=''></span>Level 1
                        </button>
                        <button className='btn level2 rounded-2 p-2 mb-3' disabled={selectedRow.length < 0} onClick={() => assignLevel(2)}>
                           Level 2
                        </button>
                        <button className='btn level3 rounded-2 p-2 mb-3' disabled={selectedRow.length < 0} onClick={() => assignLevel(3)}>
                           Level 3
                        </button>
                        <button className='btn lastLevel rounded-2 p-2 mb-3' disabled={selectedRow.length < 0} onClick={() => assignLastLevel()}>
                           Last Level
                        </button>
                        <button className='btn cancel rounded-2 p-2 mb-3' disabled={selectedRow.length < 0} onClick={clearLevel}>
                           <X size={16} /><span className='ms-2'>Clear Level</span>
                        </button>

                     </div>
                     <div className='ms-2 mt-3' style={{ borderBottom: '1px solid #0051973D' }}>
                        <div className='text-start fw-bold mb-3'>Parent Mapping</div>
                        <button className='btn parent rounded-2 p-2 mb-3 w-100' disabled={isParentSelecting} onClick={startParentSelection}>
                           <Link size={16} /><span className='ms-2'>Assign Parent</span>
                        </button>
                        <button className='btn cancel rounded-2 p-2 mb-3 w-100' disabled={selectedRow.length < 0} onClick={clearParent}>
                           <X size={16} /><span className='ms-2'>Remove Parent</span>
                        </button>
                     </div>
                     <div className='ms-2 mt-3'>
                        <div className='text-start fw-bold mb-3'>Live Structure Preview</div>
                        <div className="structure-preview">
                           {!excelData ? (
                              <div className="text-muted small">No structure assigned.</div>
                           ) : (
                              <div className="text-start">{treeData.map(node => renderNode(node))}</div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className='d-flex justify-content-end mt-4'>
               <button className='btn cancel-button mt-2 me-4' onClick={removeFile}>Cancel</button>
               <button className='btn action-button mt-2 fs-6' onClick={saveMappedBOQ}>{loading ? (<span className="spinner-border spinner-border-sm text-white"></span>) : (<span>Import BOQ Data</span>)}</button>
            </div>
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
                              prev.map(f => ({ ...f, mappingFields: '' }))
                           );
                        }
                     }}
                  />
               </div>
            </div>
            {(selectedSheet || columns) && (<div className='mt-5'>
               <div className='mb-4 text-start fw-bold'>Map the Fields</div>
               <div className='row d-flex justify-content-between'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                     <ColumnIcon /><span className='fw-bold fs-6 ms-2'>Excel Feilds</span>
                     <div className='mt-1 rounded-3 p-2'>
                        {columns
                           .filter(col => !internalFields.some(f => f.mappingFields === col))
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
                              <div className={`internal-column-container ${col.mappingFields ? 'mapped ' : ' '} me-2 p-3 rounded-3 mt-3 mb-3 d-flex flex-column justify-content-between text-start`}
                                 onDragOver={(e) => e.preventDefault()}
                                 onDrop={() => {
                                    if (draggedColumn) {
                                       const updated = [...internalFields];
                                       updated[index].mappingFields = draggedColumn;
                                       setInternalFields(updated);
                                       setDraggedColumn(null);
                                    }
                                 }}>
                                 <div className='d-flex justify-content-between'>
                                    <span className='mb-1'>{col.label}</span>
                                    <span className={`mapping-condition ${!col.mappingFields ? (col.importance === 'Required' ? 'required' : 'optional') : 'mapped'}`}>
                                       {col.mappingFields ? 'Mapped' : col.importance}
                                    </span>
                                 </div>
                                 {col?.mappingFields &&
                                    <div className='d-flex justify-content-between bg-white w-100 rounded'>
                                       <div>
                                          <span className='ms-2'><Mapping /></span>
                                          <span className='ms-2'>{col.mappingFields}</span>
                                       </div>
                                       <span className='me-2' style={{ cursor: 'pointer' }}>
                                          <X color='#C33D1B' size={14} onClick={() => {
                                             const updated = [...internalFields];
                                             updated[index].mappingFields = '';
                                             setInternalFields(updated);
                                          }} />
                                       </span>
                                    </div>}
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
               <button className='btn action-button mt-2 fs-6' onClick={() => fetchExcelData(currentPage, pageSize)}><ArrowRight size={18} /> <span className='ms-1'>Next</span></button>
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
               <div className='d-flex justify-content-between mt-1'>
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
                        Excel Sheet
                     </label>
                     <Select placeholder="Select Excel Sheet"
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
                        isDisabled={fileType === 'pdf'}
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
      <div className='container-fluid min-vh-100'>
         <div className="text-start fw-bold ms-1 mt-2 mb-4">
            <ArrowLeft size={20} onClick={() => setUploadScreen(false)} /><span className='ms-2'>BOQ Definition</span>
         </div>
         {!BOQfile && (
            <div className='ms-2 mt-3 rounded-3 bg-white' style={{ border: '0.5px solid #0051973D' }}>
               <div className='tab-info col-12 h-100'>Upload BOQ File</div>
               <div className='text-start p-3 ms-4 mt-2 me-4'>
                  <p className='fw-bold'>{projectName}</p>
                  {renderContent('fileUpload')}
               </div>
            </div>
         )}
         {BOQfile && (renderContent('mappingConfig'))}
      </div>
   );
}
export default BOQUpload;