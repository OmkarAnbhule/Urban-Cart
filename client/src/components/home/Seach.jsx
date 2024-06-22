import React, { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Seach() {
    const api = import.meta.env.VITE_API_URL
    const { state } = useLocation()
    const navigate = useNavigate()
    const [cards, setCards] = useState([])
    const [like, isLike] = useState(false)
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || [])

    const handleNavigate = (item) => {
        if (window.location.pathname != '') {
            navigate(`/product/${item._id}`)
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // Optional: Adds smooth scrolling behavior
            });
        }
        else {
            if ((navigate(-1))) {
                navigate(`/product/${item._id}`)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth', // Optional: Adds smooth scrolling behavior
                });
            }
        }
    }

    const getSearch = async () => {
        let result = await fetch(`${api}product/search/${state.search}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        return result
    }

    const checkIfInclude = (index, num) => {
        if (num) {
            if (cart.includes(index))
                return cart.includes(index)
            else
                if (localStorage.getItem('cart'))
                    return localStorage.getItem('cart').includes(cards[index])
        }
        else {
            console.log(state.user)
            return state.user.saved.includes(index)
        }
    }

    useEffect(() => {
        if (state.search)
            getSearch().then((res) => {
                if (res.success) {
                    setCards(res.data)
                }
            })
    }, [state.search , isLike])

    const handlefavorite = async (item) => {
        if (!isLike) {
            let result = await fetch(`${api}user/save/${item._id}`, {
                method: 'DELETE',
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
        else {
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
    }
    if(!localStorage.getItem('isLogin')){
        return(
            <div className='isLogin'>
                <h1>Login To Access This</h1>
            </div>
        )
    }

    if (cards && cards.length > 0) {
        return (
            <div className='search-root'>
                <div className='card-wrapper'>
                    {
                        cards.map((item, index) => (
                            <div className='card' key={index} >
                                <img src={item.image}></img>
                                <i className={checkIfInclude(item._id, 0) ? 'bi bi-heart-fill' : 'bi bi-heart'} style={{ color: checkIfInclude(item._id, 0) ? 'red' : 'black' }} onClick={() => handlefavorite(item)}></i>
                                <div className='details' onClick={() => handleNavigate(item)}>
                                    <p className='name'>{item.title}</p>
                                    <p className='price'>{item.price} $</p>
                                    {
                                        /^-?[0-9]+$/.test(item.rating.rate) ? (
                                            <div className='rating'>
                                                <i className={item.rating >= 1 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                                <i className={item.rating >= 2 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                                <i className={item.rating >= 3 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                                <i className={item.rating >= 4 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                                <i className={item.rating >= 5 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                            </div>
                                        ) :
                                            (
                                                <div className='rating'>
                                                    <i className={Math.ceil(item.rating) >= 1 ? (Math.ceil(item.rating) == 1 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                                    <i className={Math.ceil(item.rating) >= 2 ? (Math.ceil(item.rating) == 2 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                                    <i className={Math.ceil(item.rating) >= 3 ? (Math.ceil(item.rating) == 3 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                                    <i className={Math.ceil(item.rating) >= 4 ? (Math.ceil(item.rating) == 4 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                                    <i className={Math.ceil(item.rating) >= 5 ? (Math.ceil(item.rating) == 5 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                                </div>
                                            )
                                    }
                                </div>
                                <button onClick={() => handleCart(index, item)} disabled={checkIfInclude(index, 1) ? true : false} style={{ background: checkIfInclude(index, 1) ? 'rgb(4, 230, 4)' : 'rgb(53, 117, 255)' }}><i className={checkIfInclude(index, 1) ? 'bi bi-cart-check' : 'bi bi-cart-plus'} style={{ color: checkIfInclude(index, 1) ? 'rgb(4, 230, 4)' : 'rgb(53, 117, 255)' }}></i>{checkIfInclude(index, 1) ? 'Added' : 'Add To Cart'}</button>
                            </div>
                        ))}
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="search-root">
                <h1>No Product Found</h1>
            </div>
        )
    }
}

