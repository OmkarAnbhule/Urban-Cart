import React, { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../hooks'

export default function Input({ props, onChange, login }) {
    const api = import.meta.env.VITE_API_URL
    const [focused, setFocused] = useState(false)
    const [type, setType] = useState(props.type)
    const value = useDebounce(props.value)
    const inputRef = useRef(null)
    const [err, setErr] = useState('')

    const handleFocus = (e) => {
        setFocused(true)
    }

    const handleIcon = () => {
        if (props.icon && props.altIcon) {
            if (type == props.type) {
                setType(props.altType)
            }
            else {
                setType(props.type)
            }
        }
    }

    useEffect(() => {
        if (!login) {
            if (props.type === 'email' && value != '') {
                handleEmailVerify()
            }
        }
    }, [value])

    const handleEmailVerify = async () => {
        let result = await fetch(`${api}user/verify/${value}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        result = await result.json()
        if (result.success) {
            props.isValid(true)
        }
        else {
            props.isValid(false)
            setErr("Email already exists")
        }
    }


    return (
        <div className='input-container'>
            <input
                style={{ borderBottom: props.valid != undefined ? props.valid == true ? '' : '2px solid red' : '' }}
                type={type}
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={onChange}
                focused={focused.toString()}
                required
                onBlur={handleFocus}
                className={props.type}
                pattern={props.pattern}
                title={props.type == "password" ? props.err : ''}
                ref={inputRef}
            />
            <label htmlFor={props.id} style={{ display: props.value == '' ? 'block' : 'none', color: props.valid != undefined ? props.valid == true ? '' : 'red' : '' }}>{props.label}</label>
            {props.icon && (
                <i className={type === props.type ? props.icon : props.altIcon} onClick={handleIcon}></i>
            )}
            {(props.err || (props.valid != undefined && props.valid === false)) && <div className='err' style={{ display: props.valid != undefined ? props.valid == true ? 'none' : 'flex' : 'none' }}>{props.err || err}</div>}
            {(props.err || (props.valid != undefined && props.valid === false)) && <div className='err'>{props.err || err}</div>}
        </div>
    )
}
