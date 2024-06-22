import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Buffer } from 'buffer'

export default function Navbar() {
    const api = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [isSide, setSide] = useState(false)
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || [])
    const [lineStyle1, setLineStyle1] = useState()
    const [lineStyle2, setLineStyle2] = useState()
    const [lineStyle3, setLineStyle3] = useState()
    const [isDisable, setDisable] = useState(false)
    const [display, setDisplay] = useState('none')
    const [isCartDisplay, setCartDisplay] = useState(false)
    const [search, setSearch] = useState('')
    const [totalPay, setTotalPay] = useState(0)
    const options = [
        "men's clothing",
        "women's wear",
        "kids's wear",
        "accessories",
        "electronics",
        "home & lifestyle"
    ]
    const handleSideBar = () => {
        setSide(!isSide)
        setDisable(true)
        if (!isSide) {
            setLineStyle2({
                display: 'none'
            })
            setLineStyle1({
                transform: 'translateY(10px) rotate(45deg)',
                width: '50px',
                position: 'relative'
            })
            setLineStyle3({
                transform: 'translateY(-10px) rotate(-45deg)',
                width: '50px',
                position: 'relative',
                top: '-5px',
            })
            setDisable(false)
        }
        else {
            setLineStyle1({
                transform: 'translateY(0px) rotate(0deg)',
                width: '40px',
            })
            setLineStyle3({
                transform: 'translateY(0px) rotate(0deg)',
                width: '40px',
                top: '0px'
            })
            setLineStyle2({
                display: 'block'
            })
            setDisable(false)
        }
    }
    const handleCartDisplay = () => {
        setCartDisplay(!isCartDisplay)
    }

    const getUser = async (id) => {
        let result = await fetch(`${api}user/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            },
        })
        result = await result.json()
        return result
    }

    useEffect(() => {
        if (localStorage.getItem('isLogin')) {
            getUser(jwtDecode(localStorage.getItem('token')).id).then((res) => {
                if (res.success) {
                    setUser(res.data)
                }
            })
        }
    }, [])

    const encodeObjectId = (objectId) => {
        const buffer = Buffer.from(objectId, 'hex');
        let base64 = buffer.toString('base64');
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return base64;
    };



    const handlePayment = () => {
        navigate('/payment', {
            state: {
                'payment': localStorage.getItem('cart'),
                'totalPay': totalPay
            },
        })
    }

    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        cart.forEach((item) => {
            if (item._id === id) {
                cart.splice(cart.indexOf(item), 1)
            }
        })
        setCart(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart')))
    }, [localStorage.getItem('cart')])

    useEffect(() => {
        if (cart)
            cart.forEach((item, index) => {
                setTotalPay(totalPay + item.price)
            })
    }, [cart])

    const logout = async () => {
        let result = await fetch(`${api}user/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        if (result.success) {
            localStorage.clear()
            navigate('/')
        }
    }

    return (
        <div className='navbar'>
            <div className='sidebar' onMouseLeave={handleSideBar} style={{ transform: isSide ? 'scale(1)' : 'scale(0)', width: isSide ? '300px' : '0px' }}>
                <div className='icon-group'>
                    <img src={logo} width={60} height={60} style={{ marginRight: '-10px' }}></img>
                    UrbanCart
                </div>
                <div className='list'>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}><p>Home</p></Link>
                    <Link to="/Orders" style={{ textDecoration: 'none', color: 'inherit' }}><p>Orders</p></Link>
                    <Link to="/Rewards" style={{ textDecoration: 'none', color: 'inherit' }}><p>Rewards</p></Link>
                    {
                        localStorage.getItem('isLogin')
                            ?
                            <>
                                {user &&
                                    <>
                                        <Link to={`profile/${encodeObjectId(user._id)}`} style={{ textDecoration: 'none', color: 'inherit' }}><p>Profile</p></Link>
                                        <Link to="" style={{ textDecoration: 'none', color: 'inherit' }} onClick={logout}><p>Logout</p></Link>
                                    </>}
                            </>
                            :
                            <div className='btn-grp relative'>
                                <button onClick={() => navigate('/login')}>Login</button>
                                <button onClick={() => navigate('/signup')}>Signup</button>
                            </div>
                    }

                </div>
            </div>
            <div className='icon-group'>
                <div id="menu" className="menu" style={{ pointerEvents: isDisable ? 'none' : 'auto' }} onClick={handleSideBar}>
                    <span id="span" style={lineStyle1}></span>
                    <span id="span" style={lineStyle2}></span>
                    <span id="span" style={lineStyle3}></span>
                </div>
                <div>
                    <img src={logo} width={60} height={60} style={{ marginRight: '-10px' }}></img>
                    UrbanCart
                </div>
                <div className='tabs'>
                    <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}><p>Home</p></Link>
                    <Link to='/Orders' style={{ textDecoration: 'none', color: 'inherit' }}><p>Orders</p></Link>
                    <Link to='/Rewards' style={{ textDecoration: 'none', color: 'inherit' }}><p>Rewards</p></Link>
                    {localStorage.getItem('isLogin') ? <p onClick={logout}>Logout</p> : null}
                </div>
            </div>
            <div className='search-control'>
                <i className='bi bi-search'></i>
                <input type='search' onFocus={() => { setDisplay('grid'); navigate('search', { state: { search: search, user: user } }) }} value={search} onChange={(e) => setSearch(e.target.value)} onBlur={() => setTimeout(() => setDisplay('none'), 300)}></input>
                <div className='items' style={{ display: display }}>
                    {
                        options.map((item, index) => (
                            <p key={index} onClick={() => setSearch(item)}>{item}</p>
                        ))
                    }
                </div>
            </div>
            {!localStorage.getItem('isLogin')
                ?
                <div className='btn-grp'>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Signup</button>
                </div>
                :
                <div className='nav-symbols'>
                    <div className='icon-control'>
                        <div className='cart-items' onMouseLeave={handleCartDisplay} style={{ transform: isCartDisplay ? 'scaleY(1)' : 'scaleY(0)' }}>
                            {
                                cart && cart.map((item, index) => (
                                    <div className='cart-order' key={index} style={{ transform: isCartDisplay ? 'scaleX(1)' : 'scaleX(0)' }}>
                                        <img width={50} height={50} src={item.image}></img>
                                        <p>
                                            {item.title}
                                        </p>
                                        <p>${item.price}</p>
                                        <div className='rm-item'><i className='bi bi-trash' onClick={() => deleteCartItem(item._id)}></i></div>
                                    </div>
                                ))

                            }
                            {localStorage.getItem('cart') && localStorage.getItem('cart') == '[]' ? (
                                <div className='cart-order' style={{ transform: isCartDisplay ? 'scaleX(1)' : 'scaleX(0)' }}>
                                    <p>
                                        No Items Added In Cart
                                    </p>
                                </div>
                            ) : <div className='btn-group'>
                                <button onClick={handlePayment}><i className='bi bi-cart4'></i> Buy ${totalPay.toFixed(2)}</button>
                                <button onClick={() => { localStorage.removeItem('cart'); setCartDisplay(false) }}><i className='bi bi-trash'></i>Clear All</button>
                            </div>
                            }
                        </div>
                        <i className='bi bi-cart' onClick={handleCartDisplay}></i>
                    </div>
                    <div className='icon-control' onClick={() => navigate('/saved')}>
                        <i className='bi bi-heart-fill'></i>
                    </div>
                    <div className='icon-control'>
                        {user &&
                            <Link to={`/profile/${encodeObjectId(user._id)}`}><img width={50} height={50} src={user.avatar}></img></Link>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
