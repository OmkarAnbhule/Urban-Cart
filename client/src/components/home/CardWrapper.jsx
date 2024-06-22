import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Buffer } from 'buffer';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

export default function CardWrapper(props) {
    const api = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const location = useLocation()
    const [like, isLike] = useState(false)
    const [cart, setCart] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true);
    const handleNavigate = (item) => {
        if (window.location.pathname != '') {
            navigate(`/product/${encodeObjectId(item._id)}`)
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
        else {
            if ((navigate(-1))) {
                navigate(`/product/${item._id}`)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        }
    }
    const handlefavorite = async (item) => {
        let result = await fetch(`${api}user/save/${item._id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        if (result.success) {
            isLike(!like)
        }
    }

    const getUser = async () => {
        let result = await fetch(`${api}user/${jwtDecode(localStorage.getItem('token')).id}`, {
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
    const encodeObjectId = (objectId) => {
        const buffer = Buffer.from(objectId, 'hex');
        let base64 = buffer.toString('base64');
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return base64;
    };

    useEffect(() => {
        if (localStorage.length > 0 && localStorage.getItem('token'))
            getUser().then((res) => {
                if (res.success) {
                    setUser(res.data)
                    setLoading(false)
                }
            })
    }, [like])

    useEffect(() => {
        if (props) {
            setTimeout(() => {

                setLoading(false)
            }, 2000)
        }
    }, [])



    const checkIfInclude = (index, num) => {
        if (num) {
            if (cart.includes(index))
                return cart.includes(index)
            else
                if (localStorage.getItem('cart'))
                    return JSON.parse(localStorage.getItem('cart')).includes(props.card[index])
        }
        else {
            if (user && user.saved)
                return user.saved.includes(index)
        }
    }
    const handleCart = (i, val) => {
        if (cart.includes(i) && cartItems.includes(val)) {

        }
        else {
            setCart(pre => ([
                ...pre,
                i
            ]))
            const storedData = localStorage.getItem('cart');
            const existingArray = storedData ? JSON.parse(storedData) : [];
            if (!existingArray.includes(val)) {
                const newArray = [...existingArray, val];
                setCartItems(newArray)
            }
        }
    }
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    return (
        <div className='container-card-wrapper'>
            <h2>{loading ? <Skeleton width={200} /> : 'Items'}</h2>
            <div className='card-wrapper'>
                {loading ?
                    Array.from({ length: 4 }).map((_, index) => (
                        <div className='card' key={index}>
                            <Skeleton height={150} width={150} style={{ marginBottom: '10px' }} baseColor="#ddd" highlightColor="#eee" />
                            <div className='details'>
                                <Skeleton width={100} />
                                <Skeleton width={80} />
                                <div className='rating'>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} circle={true} height={20} width={20} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                    : (
                        props.card.map((item, index) => (
                            <div className='card' key={index}>
                                <img src={item.image} alt={`Item ${index}`} />
                                <div className='details'>
                                    <p className='name'>{item.title}</p>
                                    <p className='price'>{item.price} $</p>
                                    <div className='rating'>
                                        {Array.from(Array(5), (_, i) => (
                                            <i key={i} className={`bi ${i < item.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
            </div>
        </div >
    )
}
