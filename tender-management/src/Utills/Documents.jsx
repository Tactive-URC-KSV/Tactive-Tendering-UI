import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

function Documents() {

    const fileInputRef = useRef();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
    }
    return (
        <div className='mb-3 bg-white'>
            <div className='upload-file row p-3 ms-auto me-auto'>
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
                <div className='col-12 text-center mt-4' style={{ fontSize: '12px' }}>
                    Any format up to 20MB
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
        </div>
    );
}
export default Documents;