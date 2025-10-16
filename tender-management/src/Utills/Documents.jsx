import { ArrowLeft, UploadIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

function Documents({ project, setActiveTab }) {

    const fileInputRef = useRef();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
    }
    const handleFileUpload = () => {
        setLoading(true);
        const currentProjectId = project?.id;
        if (uploadedFiles.length > 0 && currentProjectId) {
            const formData = new FormData();
            uploadedFiles.forEach((file) => formData.append("files", file));

            axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/project/saveProjectFiles/${currentProjectId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }).then(res => {
                    if (res.status === 201) {
                        toast.success(res.data);
                    }
                }).catch(err => {
                    toast.error(err?.response?.data?.message);
                }).finally(() => {
                    setLoading(false);
                    setUploadedFiles([]);
                    setActiveTab('document');
                });
        }
    }
    return (
        <div className='mb-3 min-vh-100'>
            <div className='upload-file row p-3 ms-auto me-auto bg-white'>
                <div className='col-12 text-center'>
                    <FaCloudUploadAlt size={48} />
                </div>
                <div className='col-12 text-center mt-2'>
                    Optional Documents
                </div>
                <div className='col-12 text-center mt-2'>
                    <button className='btn action-button mt-2' onClick={() => { fileInputRef.current.click() }}>Choose File</button>
                    <input type="file" ref={fileInputRef} multiple style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
                {uploadedFiles.length > 0 && (
                    <div className="mt-3 px-3 text-start">
                        <div className="row g-3">
                            {uploadedFiles.map((file, idx) => (
                                <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="border rounded p-2 position-relative bg-light">
                                        <FaTimes
                                            size={16}
                                            className="position-absolute top-0 end-0 m-2 text-danger"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                setUploadedFiles(prev => prev.filter((_, i) => i !== idx))
                                            }
                                        />
                                        <div className="small text-truncate">{file.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            <div className='d-flex justify-content-between mt-5'>
                <button className='btn cancel-button mt-2 me-4' onClick={() => setActiveTab('feasibility')}><ArrowLeft size={18} /><span className='ms-2'>Previous</span></button>
                <button className='btn action-button mt-2 me-4' onClick={handleFileUpload}>{loading ? (<span className="spinner-border spinner-border-sm text-white"></span>) : (<><UploadIcon size={18} /><span className='ms-2'>Upload</span></>)}</button>
            </div>
        </div>
    );
}
export default Documents;