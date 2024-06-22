import React, { useEffect, useState } from 'react'

export default function Orders() {
  const api = import.meta.env.VITE_API_URL
  const [orders, setOrders] = useState([])
  const [show, setShow] = useState(false);

  const getOrders = async () => {
    let result = await fetch(`${api}product/order`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    result = await result.json()
    return result
  }

  const formatDate = (item, process) => {
    if (process && process.length > 0) {
      let formattedDate = 'Ongoing'
      process.forEach((obj) => {
        if (obj.status === item) {
          const date = new Date(obj.date);
          formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        }
      })
      return formattedDate
    }
    else {
      const date = new Date(item);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formattedDate;
    }
  }

  useEffect(() => {
    getOrders().then((res) => {
      if (res.success) {
        setOrders(res.data)
      }
    })
  }, [])

  const handleCancel = async (id) => {
    let result = await fetch(`${api}product/order/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  return (
    <div className='order-root'>
      {
        orders.length > 0 ?
        orders.map((item, index) => (
          <div className='order-card'>
            <div>
              <div className='order-img'>
                <img width={100} height={100} src={item.ProductId[0].image}></img>
              </div>
              <div className='order-info'>
                <button onClick={() => handleCancel(item._id)} style={{ display: item.status == 'order placed' ? 'block' : 'none' }}>Cancel Order</button>
                <p className='order-id'>Order ID: {item._id}</p>
                <p className='order-date'>Order Date: {formatDate(item.createdAt)}</p>
                <p className='order-status'>Order Status: {item.status}</p>
                <p className='order-desc'>{item.ProductId[0].category}</p>
              </div>
            </div>
            <div className='order-btn'>
              <div className='show-btn'>
                <button onClick={() => setShow(!show)}><i style={{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }} className='bi bi-chevron-down'></i></button>
              </div>
            </div>
            <div className='order-show' style={{ transform: show ? 'scaleY(1)' : 'scaleY(0)', display: show ? 'block' : 'none' }}>
              <div className="stepper-wrapper">
                <div className={`stepper-item ${item.status == 'order placed' ? 'active' : 'completed'}`}>
                  <div className="step-counter"><i className='bi bi-dot'></i></div>
                  <div className="step-name">Order Placed on <br /> {formatDate('order placed', item.orderProcess)}</div>
                </div>
                <div className={`stepper-item ${item.status == 'order shipped' ? 'active' : item.status == 'order placed' ? '' : 'completed'}`}>
                  <div className="step-counter"><i className='bi bi-dot'></i></div>
                  <div className="step-name">Order Shipped on <br /> {formatDate('order shipped', item.orderProcess)}</div>
                </div>
                <div className={`stepper-item ${item.status == 'order pickup' ? 'active' : item.status == 'order delivered' ? 'completed' : ''}`}>
                  <div className="step-counter"><i className='bi bi-dot'></i></div>
                  <div className="step-name">Order Pickup on <br /> {formatDate('order picked', item.orderProcess)}</div>
                </div>
                <div className={`stepper-item ${item.status == 'order delivered' ? 'completed' : ''}`}>
                  <div className="step-counter"><i className='bi bi-dot'></i></div>
                  <div className="step-name">Order Delivered on <br /> {formatDate('order delivered', item.orderProcess)}</div>
                </div>
              </div>
            </div>
          </div>
        ))
        :
        <h1 style={{width:'100%', display:'flex' , justifyContent:'center' , height:'100%' , alignItems:'center'}}>No Orders Found</h1>
      }
    </div>
  )
}