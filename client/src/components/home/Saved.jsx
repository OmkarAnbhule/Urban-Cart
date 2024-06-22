import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Saved() {
  const api = import.meta.env.VITE_API_URL;
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

  const checkIfInclude = (index, num) => {
    if (num) {
      if (cart.includes(index))
        return cart.includes(index)
      else
        if (localStorage.getItem('cart'))
          return localStorage.getItem('cart').includes(cards[index])
    }
    else {
    }
  }

  const handlefavorite = async (item) => {
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


  const getCards = async () => {
    let result = await fetch(`${api}user/save/saved`, {
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
    getCards().then(result => {
      if (result.success) {
        setCards(result.data.saved)
      }
    })
  }, [like])

  if (cards && cards.length) {
    return (
      <div className='save-root'>
        <div className='card-wrapper'>
          {
            cards.map((item, index) => (
              <div className='card' key={index} >
                <img src={item.image}></img>
                <i className='bi bi-heart-fill' style={{ color: 'red' }} onClick={() => handlefavorite(item)}></i>
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
      </div >
    )
  }
  else {
    return (
      <div className='save-root' style={{alignItems:'center' , justifyContent:'center' , height:'90%'}}>
        <h1>No Saved Products Found</h1>
      </div>
    )
  }
}
