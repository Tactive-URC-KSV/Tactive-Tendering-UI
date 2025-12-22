import { useState } from "react";

export function Addresstype(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [addressType,setAddressType] = useState({
        id:'',
        addressType:'',
        active: true,
    })
    const handleAdd = () => {
        setIsEdit(false);
        setAddressType({ id: null, addressType: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (addressType) => {
        setIsEdit(true);
        setAddressType({ ...addressType });
        setOpenModal(true);
    };

    const handleDelete = (addressType) => {
        addressType.active = false; 
    };

    const handleSave = () => {
        if (!addressType.addressType.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function Countries(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [country,setCountry] = useState({
        id : '',
        country : '',
        countryCode: '',
        active : true
    })
    const handleAdd = () => {
        setIsEdit(false);
        setCountry({id:null ,country: '', countryCode:'', active: true});
        setOpenModal(true);
    };

    const handleEdit = (country) => {
        setIsEdit(true);
        setCountry(...country);
        setOpenModal(true);
    };

    const handleDelete = (country) => {
        country.active = false; 
    };

    const handleSave = () => {
        if (!country.country.trim() && !country.countryCode.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}
export function States(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [state, setState] = useState({
        id: '', 
        state : '',
        active: true,
        countryId: ''
    })
    const handleAdd = () => {
        setIsEdit(false);
        setState({
        id: '', 
        state : '',
        active: true,
        countryId: ''
    });
        setOpenModal(true);
    };

    const handleEdit = (state) => {
        setIsEdit(true);
        setState(...state);
        setOpenModal(true);
    };

    const handleDelete = (state) => {
        state.active = false; 
    };

    const handleSave = () => {
        if (!state.state.trim() && !state.countryId.trim()) return;
        setOpenModal(false);
    };
    return (
        <div></div>
    );
}
export function Cities(){
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [city, setCity] = useState({
        id: '',
        city: '',
        countryId: '',
        stateId : '',
        active : true
    })
    const handleAdd = () => {
        setIsEdit(false);
        setCity({
            id : null,
            city: '',
            stateId : '',
            countryId : '',
            active: true
        })
        setOpenModal(true);
    };

    const handleEdit = (city) => {
        setIsEdit(true);
        setCity(...city);
        setOpenModal(true);
    };

    const handleDelete = (city) => {
        city.active = false; 
    };

    const handleSave = () => {
        if (!city.city.trim() && !city.countryId.trim() && !city.stateId.trim()) return;
        setOpenModal(false);
    };
    return(
        <div></div>
    );
}