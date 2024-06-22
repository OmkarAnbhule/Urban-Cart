import React, { useEffect, useState } from 'react';

export default function Modal({ show, handleClose, profile, item }) {
    const api = import.meta.env.VITE_API_URL
    const [name, setName] = useState(item?.name || '');
    const [address, setAddress] = useState(item?.deliveryAddress || '');
    const [file, setFile] = useState(null)
    const sendDetails = async () => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', name)
        formData.append('address', address)
        let result = await fetch(`${api}user/update`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
        result = await result.json()
        if (result.success)
            handleClose()
    }

    useEffect(() => {
        setName(item?.name || '')
        setAddress(item?.deliveryAddress || '')
        setFile(null)
    }, [show])

    return (
        <div>
            <div className="modal" style={{ display: show ? 'flex' : 'none' }}>
                <form className='modal-form'>
                    <div className="form-control">
                        <input type='text' className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name' required></input><br />
                    </div>
                    <div className="form-control">
                        <input type='text' className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter your delivery address' required></input><br />
                    </div>
                    <div className="form-control">
                        <input type='file' className="form-control" onChange={(e) => setFile(e.target.files[0])} required></input><br />
                    </div>
                    <div className="btn-grp">
                        <button className='secondary' onClick={handleClose}>Cancel</button>
                        <button className='primary' onClick={sendDetails}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}