import React, { useState, useEffect, useRef } from 'react'
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'


export default function Caraousel(props) {
    const navigate = useNavigate()
    const containerRef = useRef(null);
    const [display, setDisplay] = useState('none')
    const [end, setEnd] = useState(false)
    const [loading, setLoading] = useState(true)

    const encodeObjectId = (objectId) => {
        const buffer = Buffer.from(objectId, 'hex');
        let base64 = buffer.toString('base64');
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return base64;
    };

    useEffect(() => {
        if (props && props.data.length > 0) {
            setLoading(false)
        }
    }, [props])

    const slide = () => {
        setTimeout(() => {
            if (end) {
                scrollLeft()
            }
            else {
                scrollRight()
            }
            slide()
        }, 1000 * 2);
    }
    useEffect(() => {
        slide()
    }, [end])
    const scrollRight = () => {
        const maxScrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth - 3;
        if (Math.floor(containerRef.current.scrollLeft) >= maxScrollLeft) {
            setEnd(true);
        } else {
            containerRef.current.scrollTo({
                left: containerRef.current.scrollLeft + containerRef.current.clientWidth,
                behavior: 'smooth',
            });
        }
    }

    const scrollLeft = () => {
        if (Math.floor(containerRef.current.scrollLeft) === 0) {
            setEnd(false);
        } else {
            containerRef.current.scrollTo({
                left: containerRef.current.scrollLeft - containerRef.current.clientWidth,
                behavior: 'smooth',
            });
        }
    }
    const handleFocusIn = () => {
        setDisplay('block')
    }
    const handleFocusOut = () => {
        setDisplay('none')
    }
    return (
        <div className='caraousel'>
            <button onClick={scrollRight} style={{ display: display }} onMouseLeave={handleFocusOut} onMouseEnter={handleFocusIn}><i className='bi bi-caret-right-fill'></i></button>
            <button onClick={scrollLeft} style={{ display: display }} onMouseLeave={handleFocusOut} onMouseEnter={handleFocusIn}><i className='bi bi-caret-left-fill'></i></button>
            <div ref={containerRef} onMouseLeave={handleFocusOut} onMouseEnter={handleFocusIn} className="image-gallery">
                {loading ? (
                    <>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className='skeleton-wrapper'>
                                <Skeleton height='100%' width='100%' baseColor="#ddd" highlightColor="#eee" />
                            </div>
                        ))}
                    </>
                ) : (
                    props.data.map((item, index) => (
                        <div key={index} onClick={() => navigate(`/product/${encodeObjectId(item.productId)}`)}>
                            <img src={item.image} alt={`Product ${index}`} />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
