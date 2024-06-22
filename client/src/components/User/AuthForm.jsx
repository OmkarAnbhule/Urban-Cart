import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import Input from './Input';
import Otp from './Otp';
import Snackbar from 'awesome-snackbar'

const AuthForm = ({ login }) => {
    const api = import.meta.env.VITE_API_URL
    const [isLogin, setIsLogin] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [valid, setValid] = useState(true);
    const [focus, setFocus] = useState(false);
    const fileInputRef = useRef(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        otp: '',
        file: '',
    });
    const registerProps = [
        {
            name: 'name',
            id: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Enter your name',
            value: formData.name,
            required: true
        },
        {
            name: 'email',
            id: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'Enter your email',
            value: formData.email,
            required: true,
            valid: valid,
            isValid: (val) => setValid(val),
        },
        {
            name: 'password',
            id: 'password',
            label: 'Password',
            type: 'password',
            placeholder: 'Enter your password',
            value: formData.password,
            required: true,
            icon: 'bi bi-eye',
            altIcon: 'bi bi-eye-slash',
            altType: 'text',
            pattern: '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$',
            err: "Password must be at least 12 characters long and at least one capital letter , one small letter , one number and one special symbol"
        },
    ]

    const loginProps = [
        {
            name: 'email',
            id: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'Enter your email',
            value: formData.email,
            required: true
        },
        {
            name: 'password',
            id: 'password',
            label: 'Password',
            type: 'password',
            placeholder: 'Enter your password',
            value: formData.password,
            required: true,
            icon: 'bi bi-eye',
            altIcon: 'bi bi-eye-slash',
            altType: 'text',
            pattern: '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$',
            err: "Password must be at least 12 characters long and at least one capital letter , one small letter , one number and one special symbol"
        },
    ]

    useEffect(() => {
        setIsLogin(login)
    }, [login])

    const handleChange = (e) => {
        const { name, value } = e.target;
        let temp = value
        temp = temp.replace(/^\s$/, '');
        setFormData((prevData) => ({
            ...prevData,
            [name]: temp,
        }));
    };

    const handleFile = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.files[0],
        }))
    }

    const handleFocus = (e) => {
        setFocus(true)
    }

    const registerUser = async () => {
        let result = await fetch(`${api}user/sendOTP`, {
            body: JSON.stringify({ email: formData.email, isLogin: isLogin, password: formData.password }),
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        return result
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            if (formData.email != '' && formData.password != '') {
                registerUser().then((res) => {
                    if (res.success) {
                        setIsOtpSent(true);
                        new Snackbar(`<i class="bi bi-check-circle-fill"></i>&nbsp;&nbsp;&nbsp;OTP has been sent`, {
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
                    }
                    else {
                        if (res.message == 'User not found') {
                            new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;User not found`, {
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
                            })
                        }
                        else {
                            if (res.message == 'otp failed to send') {
                                new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Email Address not valid`, {
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
                                })
                            }
                            else {
                                new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Server Error`, {
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
                                })
                            }
                        }
                    }
                })
            }
            else {
                setFocus(true)
                new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Please Fill in all fields`, {
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
                })
            }
        } else {
            if (formData.name != '' && formData.email != '' && formData.password != '' && valid == true && formData.file != '') {
                registerUser().then((res) => {
                    if (res.success) {
                        setIsOtpSent(true);
                        new Snackbar(`<i class="bi bi-check-circle-fill"></i>&nbsp;&nbsp;&nbsp;OTP has been sent`, {
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

                    }
                    else {
                        if (res.message == 'otp failed to send') {
                            new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Email Address not valid`, {
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
                            })
                        }
                        else {
                            new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Server Error`, {
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
                            })
                        }
                    }
                })
            }

        }
    };

    function temp() {
        new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Empty Fields`, {
            position: 'bottom-center',
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
        new Snackbar(`<i class="bi bi-check-circle-fill"></i>&nbsp;&nbsp;&nbsp;Registration Successful`, {
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
    }



    const toggleForm = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            otp: ''
        });
    };

    return (
        <div className="auth-form">
            {!isOtpSent ? (
                <div>
                    <div className='form-side-display'>
                        {
                            isLogin ? (
                                <span>
                                    <h2>Welcome Back!</h2>
                                    <h4>Returning customers can easily log in to access their accounts and start shopping right away.</h4>
                                    <h3>Why Login?</h3>
                                    <ul style={{ listStyleType: 'disc' }}>
                                        <li><b>Order Tracking: </b>Keep tabs on your purchases and delivery status.</li>
                                        <li><b>Exclusive Deals: </b>Access member-only discounts and promotions.</li>
                                        <li><b>Fast Checkout: </b>Save your shipping details for a quicker checkout experience.</li>
                                    </ul>
                                </span>
                            )
                                :
                                (
                                    <span>
                                        <h2>Join us!</h2>
                                        <h4>Create an account to enjoy a personalized shopping experience and exclusive member benefits.</h4>
                                        <h3>Benefits of Registering:</h3>
                                        <ul style={{ listStyleType: 'disc' }}>
                                            <li><b>Personalized Recommendations:</b> Get product suggestions tailored to your tastes.</li>
                                            <li><b>Order History:</b> View all your past purchases in one place.</li>
                                            <li><b>Faster Checkout:</b> Save your shipping and billing details for quick orders.</li>
                                            <li><b>Special Offers:</b>  Receive emails with exclusive deals and early access to sales.</li>
                                        </ul>
                                    </span>
                                )
                        }
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h2>{isLogin ? 'Join Us!' : isOtpSent ? 'Otp Verification' : 'Welcome Back! '}</h2>
                        {
                            isLogin ?
                                null
                                :
                                <div className='file'>
                                    <input type='file' name='file' id='file' required hidden onChange={handleFile} accept='image/' focused={focus.toString()} ref={fileInputRef}></input>
                                    <label htmlFor='file' className='file-upload' style={{ border: focus && formData.file == '' ? '2px solid red' : '2px solid gray' }} onBlur={handleFocus} tabIndex="0">
                                        {
                                            formData.file ?
                                                <img src={URL.createObjectURL(formData.file)} alt='profile' />
                                                :
                                                <>
                                                    <i className="bi bi-cloud-arrow-up-fill"></i>
                                                    <span>Upload Profile Picture</span>
                                                </>
                                        }
                                    </label>
                                </div>
                        }
                        {
                            isLogin ?
                                loginProps.map((prop, index) => (
                                    <Input key={index} props={prop} onChange={handleChange} login={isLogin} />
                                ))
                                :
                                registerProps.map((prop, index) => (
                                    <Input key={index} props={prop} onChange={handleChange} />
                                ))
                        }
                        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                        {
                            !isOtpSent
                                ?

                                <button className='toggle-button' onClick={toggleForm}>
                                    {isLogin ? "Don't have an account? Register Now and enjoy more benefits!" : 'Already have an account? Login Here and start shopping!'}
                                </button>
                                : null
                        }
                    </form>
                </div>
            ) : (
                <Otp data={formData} login={isLogin} />
            )}
        </div>
    );
};
export default AuthForm;
