import React, { useEffect, useState } from 'react'
import AudioVisualizer from './AudioVisualizer'
import { Buffer } from 'buffer'
import { useLocation } from 'react-router-dom'
import Modal from './Modal'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

export default function Profile() {
  const api = import.meta.env.VITE_API_URL
  const { pathname } = useLocation()
  const [user, setUser] = useState({})
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const decodeObjectId = (encodedId) => {
    const base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64, 'base64');
    return buffer.toString('hex');
  };

  const getUser = async () => {
    let result = await fetch(`${api}user/${decodeObjectId(pathname.split('/profile/')[1])}`, {
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
    getUser().then((res) => {
      if (res.success) {
        setUser(res.data)
        setLoading(false)
      }
    })
  }, [pathname])

  if (localStorage.getItem('isLoggedIn')) {
    return (
      <div className='isLogin'>
        <h1>Login to Access</h1>
      </div>
    )
  }
  return (
    <div className='profile-root' id='profile'>
      {user &&
        <Modal show={show} handleClose={handleClose} profile={true} item={user} />
      }
      <div className='head'>
        <div className='cover-img'>
          <AudioVisualizer />
        </div>
        <div className='profile-img'>
          {loading ? (
            <Skeleton circle={true} height={100} width={100} />
          ) : (
            <img width={100} height={100} src={user.avatar} alt='User Avatar' />
          )}
          <div className='name'>
            {loading ? (
              <Skeleton width={100} />
            ) : (
              <p className='name'>{user.name}</p>
            )}
            <b className='p-addr'>
              Delivery Address:{' '}
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <p style={{ fontWeight: 'lighter', fontSize: '18px' }}>
                  {user.deliveryAddress || 'your address '}
                </p>
              )}
            </b>
          </div>
          <div className='button'>
            {loading ? (
              <Skeleton width={150} height={40} />
            ) : (
              <button onClick={handleShow}>
                Edit Your Profile <i className='bi bi-pencil-square'></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='center'>
        {user.orders && user.orders.length > 0 &&
          <div className='recents'>
            <h1>Recent Orders</h1>
            {user.orders && user.orders.length > 0 ? (
              user.orders.map((item, index) => (
                <div key={index} className='order-item'>
                  {loading ? (
                    <>
                      <Skeleton circle={true} height={50} width={50} />
                      <div>
                        <Skeleton width={100} />
                        <Skeleton width={50} />
                      </div>
                    </>
                  ) : (
                    <>
                      <img width={50} height={50} src={item.ProductId[0].image} alt='Product' />
                      <div>
                        <p>{item.ProductId[0].title}</p>
                        <p>{item.ProductId[0].price}$</p>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              !loading && <p>No orders available.</p>
            )}
          </div>
        }
        <div className='most-liked-reviews'>
          {user.reviews && user.reviews.length > 0 ? (
            <>
              <h1>Top 3 Most Liked Reviews</h1>
              {user.reviews.map((item, index) => (
                <div key={index} className='review-item'>
                  {loading ? (
                    <>
                      <Skeleton width={200} />
                      <Skeleton width={300} />
                      <Skeleton width={100} />
                    </>
                  ) : (
                    <>
                      <p>Made on {item.productId.title} on {item.date}</p>
                      <p>{item.review}</p>
                      <p>{item.likeCount} likes</p>
                    </>
                  )}
                </div>
              ))}
            </>
          ) : (
            !loading && <p>No reviews available.</p>
          )}
        </div>
        <div className='stats'>
          <div>
            <p>{user.reviews && user.reviews.length}</p>
            <p>Reviews</p>
          </div>
          <div>
            <p>{user.orders && user.orders.length}</p>
            <p>Orders</p>
          </div>

        </div>
      </div>
      <div className='foot'></div>
    </div>
  )
}
