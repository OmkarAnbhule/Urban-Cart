import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode';

export default function Review({ item }) {
    const api = import.meta.env.VITE_API_URL
    const [islike, setIsLike] = useState(false)

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleTimeString('en-US', options);
    };

    const addLike = async () => {
        let result = await fetch(`${api}product/review/addLike/${item._id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        if (result.success) {
            setIsLike(true)
        }
    }

    const removeLike = async () => {
        let result = await fetch(`${api}product/review/removeLike/${item._id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        if (result.success) {
            setIsLike(false)
        }
    }

    return (
        <div className='message'>
            <div className='profile'>
                <img src={item.author.avatar}></img>
                <div>
                    <p>{item.author.name}</p>
                    <p>{formatTimestamp(item.timeStamp)}</p>
                </div>
                {
                    jwtDecode(localStorage.getItem('token')).id != item.author._id ?
                        <p><i className={islike || item.likedUsers.includes(jwtDecode(localStorage.getItem('token')).id) ? 'bi bi-heart-fill' : 'bi bi-heart'} style={{ color: islike || item.likedUsers.includes(jwtDecode(localStorage.getItem('token')).id) ? 'red' : 'black' }} onClick={islike ? removeLike : addLike}></i></p>
                        : null
                }
            </div>
            <div className='data'>
                <p>{item.review}</p>
            </div>
            <div className='images'>
                {
                    item.files && item.files.map((file, index) => {
                        return (
                            <img src={file} key={index} width={50} height={50}></img>
                        )
                    })
                }
            </div>
        </div>
    )
}
