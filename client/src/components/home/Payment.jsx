import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Snackbar from 'awesome-snackbar'

export default function Payment(props) {
    const api = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const location = useLocation();
    const cart = JSON.parse(location.state.payment);
    const pay = location.state.totalPay
    const [inputValue, setInputValue] = useState({
        cardNumber: '',
        cardName: '',
        cardMonth: '',
        cardYear: '',
        cardCVV: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        let result = await fetch(`${api}product/order`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ inputValue, cart }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        if (result.success) {
            new Snackbar(`<i class="bi bi-check-circle-fill"></i>&nbsp;&nbsp;&nbsp;Transaction Successful. Order Placed`, {
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
        else {
            new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;Transaction Failed`, {
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

    const handleInput = (e, type) => {
        let temp = e.target.value

        if (type === 'cardNumber') {
            if (temp.length > 16) {
                temp = temp.slice(0, 16)
            }
            temp = temp.replace(/[^0-9]/g, '');
        }
        else if (type === 'cardMonth') {
            temp = temp.replace(/[^0-9]/g, '')
            temp = parseInt(temp);
            if (temp > 31) {
                temp = '0' + (temp % 10)
            }
        }
        else if (type === 'cardYear') {
            temp = temp.replace(/[^0-9]/g, '')
            temp = parseInt(temp);
            if (temp > 9999) {
                temp = Math.floor(temp / 10);
            }
        }
        else if (type === 'cardCVV') {
            temp = temp.replace(/[^0-9]/g, '')
            temp = parseInt(temp);
            if (temp > 999) {
                temp = Math.floor(temp / 10);
            }
        }
        else if (type === 'cardName') {
            temp = temp.replace(/[^a-zA-Z]/g, '')
        }

        setInputValue(
            {
                ...inputValue,
                [type]: temp
            }
        );
    }

    return (
        <div className='payment-root'>
            <div>
                <h1>Payment Gateway</h1>
            </div>
            {
                cart &&
                cart.map((item, index) => (
                    <div className='payment-details' key={index}>
                        <img width={50} height={50} src={item.image}></img>
                        <p className='desc'>{item.title}</p>
                        <p>{item.price}$</p>
                    </div>
                ))
            }
            <h1>Payment of {pay.toFixed(2)}$</h1>
            <form>
                <div className='input-control'>
                    <input type='text' className='input-text' id='cardnumber' value={inputValue.cardNumber} onChange={(e) => handleInput(e, 'cardNumber')} placeholder='Card Number' />
                </div>
                <div className='input-control'>
                    <input type='text' className='input-text' id='cardname' value={inputValue.cardName} onChange={(e) => handleInput(e, 'cardName')} placeholder='Card Holder Name' />
                </div>
                <div className='input-group'>
                    <div className='input-control'>
                        <input type='text' className='input-text' id='cardmonth' value={inputValue.cardMonth} onChange={(e) => handleInput(e, 'cardMonth')} placeholder='MM' />
                    </div>
                    <div className='input-control'>
                        <input type='text' className='input-text' id='cardyear' value={inputValue.cardYear} onChange={(e) => handleInput(e, 'cardYear')} placeholder='YYYY' />
                    </div>
                    <div className='input-control'>
                        <input type='text' className='input-text' id='cardcvv' value={inputValue.cardCVV} onChange={(e) => handleInput(e, 'cardCVV')} placeholder='CVV' />
                    </div>
                </div>
                <div className='btn-control'>
                    <button onClick={handleSubmit}>Pay</button>
                    <button onClick={() => navigate('/')}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
