import React, { useEffect, useRef, useState } from 'react'
import Timer from '../Timer';
import Snackbar from 'awesome-snackbar';
import { useNavigate } from 'react-router-dom';

export default function Otp({ data, login }) {
    const api = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [trys, setTrys] = useState(1);
    const [subStatus, setSubStatus] = useState(false);
    const [rstStatus, setRstStatus] = useState(true);
    const [inputData, setinputData] = useState({
        val1: '',
        val2: '',
        val3: '',
        val4: '',
        val5: '',
        val6: ''
    })
    const inputDataRef = useRef({
        val1: null,
        val2: null,
        val3: null,
        val4: null,
        val5: null,
        val6: null
    });

    useEffect(() => {
        setTimeout(()=>{
            if (trys > 3) {
                setSubStatus(true)
            }
        },1000)
    }, [trys])

    const handleChange = (e) => {
        let temp = e.target.value
        temp = temp.replace(/[^a-zA-Z0-9]/g, '');
        if (temp !== '') {
            temp = temp.slice(-1)
            let name = e.target.name
            if (name != 'val6')
                name = String(name.slice(0, name.length - 1) + (parseInt(name.slice(-1)) + 1))
            setinputData({
                ...inputData,
                [e.target.name]: temp
            })
            inputDataRef.current[name].focus()
        }
    }

    const handleStatus = (callback, state) => {
        callback(!state)
    }

    const verifyOtp = async () => {
        const formData = new FormData();
        if (login) {
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('otp', `${inputData.val1}${inputData.val2}${inputData.val3}${inputData.val4}${inputData.val5}${inputData.val6}`);
            formData.append('count', trys);
            let result = await fetch(`${api}user/login`, {
                body: formData,
                credentials: 'include',
                method: 'POST',
            })
            result = await result.json()
            return result;
        }
        else {
            formData.append('file', data.file);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('name', data.name);
            formData.append('otp', `${inputData.val1}${inputData.val2}${inputData.val3}${inputData.val4}${inputData.val5}${inputData.val6}`);
            formData.append('count', trys);
            let result = await fetch(`${api}user/create`, {
                body: formData,
                credentials: 'include',
                method: 'POST',
            })
            result = await result.json()
            return result;
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        if (inputData.val1 !== '' && inputData.val2 !== '' && inputData.val3 !== '' && inputData.val4 !== '' && inputData.val5 !== '' && inputData.val6 !== '' && trys <= 4) {
            setTrys(trys + 1)
            if (trys > 3) {
                setSubStatus(true)
                new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Otp has been expired`, {
                    position: 'top-center',
                    style: {
                        container: [
                            ['background', 'rgb(246, 58, 93)'],
                            ['border-radius', '5px'],
                            ['height', '50px'],
                            ['padding', '10px'],
                            ['border-radius', '20px']
                        ],
                        message: [
                            ['color', '#eee'],
                            ['font-size', '18px']
                        ],
                        bold: [
                            ['font-weight', 'bold'],
                        ],
                        actionButton: [
                            ['color', 'white'],
                        ],
                    }
                });
            }
            else {
                verifyOtp().then((res) => {
                    if (res.success) {
                        localStorage.setItem('token', res.uid);
                        localStorage.setItem('isLogin', res.success)
                        new Snackbar(`<i class="bi bi-check-circle-fill"></i>&nbsp;&nbsp;&nbsp;${login ? 'Login Successful' : 'Registration Successful'}`, {
                            position: 'bottom-center',
                            style: {
                                container: [
                                    ['background', 'rgb(130, 249, 103)'],
                                    ['border-radius', '5px'],
                                    ['height', '50px'],
                                    ['padding', '10px'],
                                    ['border-radius', '20px']
                                ],
                                message: [
                                    ['color', 'black'],
                                    ['font-size', '18px']
                                ],
                                bold: [
                                    ['font-weight', 'bold'],
                                ],
                                actionButton: [
                                    ['color', 'white'],
                                ],
                            }
                        });
                        navigate('/')
                    }
                    else{
                        new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Invalid Otp`, {
                            position: 'top-center',
                            style: {
                                container: [
                                    ['background', 'rgb(246, 58, 93)'],
                                    ['border-radius', '5px'],
                                    ['height', '50px'],
                                    ['padding', '10px'],
                                    ['border-radius', '20px']
                                ],
                                message: [
                                    ['color', '#eee'],
                                    ['font-size', '18px']
                                ],
                                bold: [
                                    ['font-weight', 'bold'],
                                ],
                                actionButton: [
                                    ['color', 'white'],
                                ],
                            }
                        });
                    }
                })
            }
        } else {
            new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Enter Otp first`, {
                position: 'top-center',
                style: {
                    container: [
                        ['background', 'rgb(246, 58, 93)'],
                        ['border-radius', '5px'],
                        ['height', '50px'],
                        ['padding', '10px'],
                        ['border-radius', '20px']
                    ],
                    message: [
                        ['color', '#eee'],
                        ['font-size', '18px']
                    ],
                    bold: [
                        ['font-weight', 'bold'],
                    ],
                    actionButton: [
                        ['color', 'white'],
                    ],
                }
            });
        }
    }

    return (
        <div className='otp-root'>
            <div className='email-display'>
                <p>otp has been sent to &nbsp;<b>{data.email}</b></p>
            </div>
            <div className='otp-form'>
                <form>
                    <div className='input-control'>
                        <input type='text' name='val1' value={inputData.val1} onChange={handleChange} ref={(e) => (inputDataRef.current.val1 = e)} required />
                        <input type='text' name='val2' value={inputData.val2} onChange={handleChange} ref={(e) => (inputDataRef.current.val2 = e)} required />
                        <input type='text' name='val3' value={inputData.val3} onChange={handleChange} ref={(e) => (inputDataRef.current.val3 = e)} required />
                        <input type='text' name='val4' value={inputData.val4} onChange={handleChange} ref={(e) => (inputDataRef.current.val4 = e)} required />
                        <input type='text' name='val5' value={inputData.val5} onChange={handleChange} ref={(e) => (inputDataRef.current.val5 = e)} required />
                        <input type='text' name='val6' value={inputData.val6} onChange={handleChange} ref={(e) => (inputDataRef.current.val6 = e)} required />
                    </div>
                    <div className='btn-control'>
                        <button type='submit' disabled={subStatus || trys > 3} style={{ background: subStatus || trys > 3 ? 'gray' : '#007bff' }} onClick={handleSubmit}>Verify OTP {3 - trys >= 0 ? `(${(3 - trys) + 1} trys)` : null} <Timer callback={() => handleStatus(setSubStatus, subStatus)} status={subStatus} /></button>
                        <button type='reset' disabled={rstStatus} style={{ background: rstStatus ? 'gray' : 'red' }} >Resend OTP <Timer callback={() => handleStatus(setRstStatus, rstStatus)} status={rstStatus} /></button>
                    </div>
                </form>
            </div>
        </div>
    )
}
