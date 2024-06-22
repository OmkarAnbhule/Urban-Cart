import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import CardWrapper from './CardWrapper'
import Snackbar from 'awesome-snackbar';
import Review from './Review';
import { Buffer } from 'buffer';

export default function Product() {
    const api = import.meta.env.VITE_API_URL;
    const inputRef = useRef();
    const { pathname } = useLocation()
    const [review, setReview] = useState()
    const [img, setImg] = useState(null)
    const [files, setFiles] = useState([])
    const fileRef = useRef(null)
    const [product, setProduct] = useState([])
    const [card, setCard] = useState([])
    const [cartItems, setCartItems] = useState([])

    const getCard = async (category) => {
        let result = await fetch(`${api}product/getProducts/${category}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        return result
    }

    const decodeObjectId = (encodedId) => {
        const base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        const buffer = Buffer.from(base64, 'base64');
        return buffer.toString('hex');
    };

    const handleReplace = (e) => {
        let temp = e.target.src
        if (!img) {
            e.target.src = product.image
            setImg(temp)
        }
        else {
            e.target.src = img
            setImg(temp)
        }
    }
    const hanldeReview = (e) => {
        const input = inputRef.current;
        setReview(e.target.value)
    }
    console.log(pathname.split('/product/')[1])
    const getProduct = async () => {
        let result = await fetch(`${api}product/getProduct/${decodeObjectId(pathname.split('/product/')[1])}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        return result
    }

    const sendReview = async () => {
        const formData = new FormData()
        formData.append('review', review)
        formData.append('productId', decodeObjectId(pathname.split('/product/')[1]))
        files.forEach(file => {
            formData.append('file', file)
        })
        let result = await fetch(`${api}product/review`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
    }

    const handleCart = (val) => {
        if (cartItems.includes(val)) {

        }
        else {
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

    useEffect(() => {
        getProduct().then((res) => {
            if (res.success) {
                setProduct(res.data)
                getCard(res.data.category).then((res) => {
                    if (res.success) {
                        setCard(res.data)
                    }
                })
            }
        })
    }, [pathname])

    const handleFiles = (e) => {
        const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
        const totalFiles = files.length + selectedFiles.length;
        if (totalFiles < 7) {
            setFiles([...files, ...selectedFiles]);
        }
        else {
            new Snackbar(`<i class="bi bi-exclamation-circle-fill"></i>&nbsp;&nbsp;&nbsp;You can only upload 6 files`, {
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
    if (localStorage.getItem('isLogin'))
        return (
            <div className='product'>
                <div className='head'>
                    <div className='product-image'>
                        <img src={img ? img : product.image}></img>
                    </div>
                    <div className='details'>
                        <p>{product.title}</p>
                        <p className='description-detailsc'>{product.description}</p>
                        <div className='price-btn'>
                            <p>{product.price} $ </p>
                            {
                                /^-?[0-9]+$/.test(product.rating) ? (
                                    <div className='rating'>
                                        <i className={product.rating >= 1 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                        <i className={product.rating >= 2 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                        <i className={product.rating >= 3 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                        <i className={product.rating >= 4 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                        <i className={product.rating >= 5 ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                                    </div>
                                ) :
                                    (
                                        <div className='rating'>
                                            <i className={Math.ceil(product.rating) >= 1 ? (Math.ceil(product.rating) == 1 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                            <i className={Math.ceil(product.rating) >= 2 ? (Math.ceil(product.rating) == 2 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                            <i className={Math.ceil(product.rating) >= 3 ? (Math.ceil(product.rating) == 3 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                            <i className={Math.ceil(product.rating) >= 4 ? (Math.ceil(product.rating) == 4 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                            <i className={Math.ceil(product.rating) >= 5 ? (Math.ceil(product.rating) == 5 ? 'bi bi-star-half' : 'bi bi-star-fill') : 'bi bi-star'}></i>
                                        </div>
                                    )
                            }
                            <button onClick={() => handleCart(product)}><i className='bi bi-cart-plus'></i>Add to Cart</button>
                        </div>
                    </div>
                    <div className='description'>
                        {
                            product && product.files &&
                            product.files.map((item, index) => {
                                return (
                                    <img src={item} key={index} onClick={handleReplace}></img>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='center'>
                    <CardWrapper card={card} title={'Frequently Brought Together'} />
                </div>
                <div className='review'>
                    <h1>Customer Reviews</h1>
                    <input type='file' name='file' id='file' hidden multiple onChange={handleFiles} accept='image/*,video/*' ref={fileRef}></input>
                    <div className='input'>
                        <input type='text' onChange={hanldeReview} ref={inputRef} value={review} placeholder='Enter your review...' required></input>
                        <div className='icon-control-1'>
                            <button onClick={() => { if (fileRef.current) { fileRef.current.click() } }}><i className='bi bi-plus-circle-fill'></i></button>
                        </div>
                        <div className='icon-control-2'>
                            <button onClick={sendReview}><i className='bi bi-send'></i></button>
                        </div>
                        <div className='file-display'>
                            {
                                files && files.length > 0 ?
                                    files.map((file, index) => {
                                        return (
                                            <div key={index}>
                                                <img src={URL.createObjectURL(file)} width={50} height={50}></img>
                                            </div>
                                        )
                                    })
                                    : null
                            }
                        </div>
                    </div>
                    <div className='display'>
                        {
                            product && product.reviews && product.reviews.map((item, index) => (
                                <Review item={item} key={index} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    else {
        return (
            <div className='isLogin'>
                <h1>Login To View Product</h1>
            </div>
        )
    }
}
