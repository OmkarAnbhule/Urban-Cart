import React from 'react'

export default function HomeDisplayProduct(props) {
    return (
        <div className='container'>
            {
                props.data.map((item,index) => (
                    <div className='card' key={index}>
                        <div className='caption'>{item[1]}</div>
                        <div className='image'>
                            <img src={item[0]} width={100} height={100}></img>
                            <img src={item[0]} width={100} height={100}></img>
                            <img src={item[0]} width={100} height={100}></img>
                            <img src={item[0]} width={100} height={100}></img>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
