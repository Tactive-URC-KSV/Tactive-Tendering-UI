import { useParams } from 'react-router-dom';
import '../CSS/Styles.css';
import ProjectSelection from './BOQProjectInfo';
import BOQOverview from './BOQOverview';


function BOQDefintion() {
    const projectId = useParams().projectId;

    return (
        <div className="container-fluid">
            {!projectId && <><div className="text-start fw-bold ms-1 mt-1 mb-3">BOQ Definition</div><ProjectSelection /></>}
            {projectId && <BOQOverview projectId = {projectId} />}
        </div>
    );
}
export default BOQDefintion;