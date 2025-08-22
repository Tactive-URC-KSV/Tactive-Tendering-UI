import { useState, useRef } from 'react';
import '../CSS/Styles.css'
import { ArrowLeft, X } from 'lucide-react';
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
import { toast } from 'react-toastify';

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
      { fields: 'level', mappingFields: '', importance: 'Required', label: 'Level' },
      { fields: 'quantity', mappingFields: '', importance: 'Required', label: 'Quantity' },
      { fields: 'slno', mappingFields: '', importance: 'Optional', label: 'S.No' },
      { fields: 'parentLevel', mappingFields: '', importance: 'Optional', label: 'Parent Level' },
      { fields: 'installationRate', mappingFields: '', importance: 'Optional', label: 'Installation Rate' },
      { fields: 'supplyRate', mappingFields: '', importance: 'Optional', label: 'Supply Rate' },
      { fields: 'totalRate', mappingFields: '', importance: 'Optional', label: 'Total Rate' },
      { fields: 'installationAmount', mappingFields: '', importance: 'Optional', label: 'Installation Amount' },
      { fields: 'supplyAmount', mappingFields: '', importance: 'Optional', label: 'Supply Amount' },
      { fields: 'totalAmount', mappingFields: '', importance: 'Optional', label: 'Total Amount' },
      { fields: 'lastLevel', mappingFields: '', importance: 'Optional', label: 'Last Level' },
      { fields: 'rateOnly', mappingFields: '', importance: 'Optional', label: 'Rate Only' },
      { fields: 'remarks', mappingFields: '', importance: 'Optional', label: 'Remarks' },
      { fields: 'qtyType', mappingFields: '', importance: 'Optional', label: 'Quantity type' },
      { fields: 'wo', mappingFields: '', importance: 'Optional', label: 'Wo' },

   ]);

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
         console.log(err);
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
         console.log(err);
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
         console.log(err);
      })
   }
   const handleDragStart = (e, column) => {
      setDraggedColumn(column);
      const ghost = document.createElement("div");
      ghost.style.position = "absolute";
      ghost.style.top = "-9999px";
      ghost.style.left = "-9999px";
      ghost.style.padding = "8px 12px";
      ghost.style.background = "#f0f0f0";
      ghost.style.border = "1px solid #ccc";
      ghost.style.borderRadius = "6px";
      ghost.style.fontSize = "14px";
      ghost.innerHTML = column;
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 0, 0);

      setTimeout(() => {
         document.body.removeChild(ghost);
      }, 0);
   };
   const loadTemplate = (templateId) => {
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
            const updated = internalFields.map(field => ({
               ...field,
               mappingFields: response.templateMapping[field.fields] || ''
            }));
            setInternalFields(updated);

         }
      }).catch(err => {
         console.log(err);
      })
   }

   const mapFields = () => {
      setLoading(true);
      const mapping = {};
      const formData = new FormData();
      formData.append('file', BOQfile);
      internalFields.forEach(field => {
         if (field.mappingFields) {
            mapping[field.fields] = field.mappingFields;
         }
      })
      const mappingBlob = new Blob(
         [JSON.stringify(mapping)],
         { type: 'application/json' }
      );
      formData.append('columnMapping', mappingBlob);
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/mapBOQ/${selectedSheet ? selectedSheet : 'null'}/${projectId}`, formData,
         {
            headers: {
               Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
         }
      ).then((res) => {
         if (res.status === 200) {
            setSheetOption(prev =>
               prev.filter(option => option.value !== selectedSheet)
            );
            setSelectedSheet(null);
            setColumns([]);
            setDraggedColumn(null);
            const updatedInternalFields = internalFields.map(field => ({
               ...field,
               mappingFields: ''
            }));
            setInternalFields(updatedInternalFields);
            setSelectedTemplate();
            toast.success("BOQ Data imported SuccessFully");
            sheetOption.length === 1 && (setTimeout(() => {
               window.location.href = `/BOQdefinition/${projectId}`;
            }, 3000));
            if(fileType === 'pdf'){
               (setTimeout(() => {
               window.location.href = `/BOQdefinition/${projectId}`;
            }, 3000))
            }

         }
      }
      ).catch(err => {
         console.log(err);
         toast.error("Something went wrong");
      }).finally(() => {
         setLoading(false);
      })

   }
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
         console.error(err);
         toast.error("Error saving template");
      });


   }

   return (
      <div>
         <div className="text-start fw-bold ms-1 mt-2 mb-4">
            <ArrowLeft size={20} onClick={() => setUploadScreen(false)} /><span className='ms-2'>BOQ Definition</span>
         </div>
         <div className='ms-2 mt-3 rounded-3 bg-white' style={{ border: '0.5px solid #0051973D' }}>
            <div className='tab-info col-12 h-100'>Upload BOQ File</div>
            <div className='text-start p-3 ms-4 mt-2 me-4'>
               <p className='fw-bold'>{projectName}</p>
               {!BOQfile && (
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
                           <li>Required columns: BOQ Code, Parent BOQ, Item Description (or) BOQ Name, Unit, Quantity</li>
                        </ul>
                     </div>
                  </>
               )}

               {BOQfile && (<>
                  <div className='rounded-3 px-3 py-3 mt-4' style={{ border: '0.5px solid #0051973D' }}>
                     <div className='d-flex justify-content-between mt-1'>
                        <div className='col-lg-6 col-md-6 col-sm-12 mb-4'>
                           <div className='file-preview d-flex align-items-center justify-content-between'>
                              <div>
                                 <span className='ms-2'><FileIcon /></span>
                                 <span className='ms-2'>{BOQfile ? BOQfile.name : 'No file selected'}</span>
                              </div>
                              <span className='me-2' style={{ cursor: 'pointer' }}><X color='#C33D1B' size={20} onClick={removeFile} /></span>
                           </div>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-12 mb-4'>
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
                     <h5 className='mb-3'>Map the Fields</h5>
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

               </>)}
            </div>

         </div>
         <div className='d-flex justify-content-end mt-4'>
            <button className='btn cancel-button mt-2 me-4'>Cancel</button>
            <button className='btn action-button mt-2 fs-6' onClick={mapFields}>{loading ? (<span className="spinner-border spinner-border-sm text-white"></span>) : (<span>Import BOQ Data</span>)}</button>
         </div>
      </div>
   );
}
export default BOQUpload;