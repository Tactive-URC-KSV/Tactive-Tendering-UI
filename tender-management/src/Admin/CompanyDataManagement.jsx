export function CompanyType(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const handleAdd = () => {
        setIsEdit(false);
        setApproval({ id: null, documentName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };

    const handleDelete = (doc) => {
        doc.active = false; 
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function CompanyStatus(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const handleAdd = () => {
        setIsEdit(false);
        setApproval({ id: null, documentName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };

    const handleDelete = (doc) => {
        doc.active = false; 
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function CompanyLevel(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false); 
    const handleAdd = () => {
        setIsEdit(false);
        setApproval({ id: null, documentName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };

    const handleDelete = (doc) => {
        doc.active = false; 
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function CompanyConstitution(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const handleAdd = () => {
        setIsEdit(false);
        setApproval({ id: null, documentName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };

    const handleDelete = (doc) => {
        doc.active = false; 
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function CompanyNature(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const handleAdd = () => {
        setIsEdit(false);
        setApproval({ id: null, documentName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };

    const handleDelete = (doc) => {
        doc.active = false; 
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function CompanyNatureOfBusiness(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const handleAdd = () => {
        setIsEdit(false);
        setApproval({ id: null, documentName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };

    const handleDelete = (doc) => {
        doc.active = false; 
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function CompanyLanguage(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const handleAdd = () => {
        setIsEdit(false);
        setOpenModal(true);
    };

    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };

    const handleDelete = (doc) => {
        doc.active = false; 
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}