import React, { useEffect, useState } from 'react'

export default function Timer({ callback, status }) {
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    let interval = null

    useEffect(() => {
        if (status) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                        callback();
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }
        return () => {
            clearInterval(interval)
        }
    }, [minutes, seconds, status]);
    if (status) {
        return (
            <div>
                {minutes < 10 ? '0' + minutes : minutes}:
                {seconds < 10 ? '0' + seconds : seconds}
            </div>
        )
    } else {
        null
    }
}