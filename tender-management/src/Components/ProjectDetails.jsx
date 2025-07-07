import '../CSS/Styles.css';
import { ReactComponent as Edit } from '../assest/Edit.svg';

function ProjectDetails() {

    const editDetails = () => {

    }

    return (
        <div className='container-fluid'>
            <div className="row align-items-center mb-4">
                <div className="col-auto">
                    <p className="fw-bold mb-0 ms-2">Project Info</p>
                </div>
                <div className="col-auto ms-auto">
                    <button className="btn action-button btn-sm me-1" onClick={editDetails}><Edit /><span className="ms-2">Edit Project</span></button>
                </div>
            </div>
        </div>
    );
}
export default ProjectDetails;