import React, { useState, useRef, useEffect } from "react";
import ScratchCard from "simple-scratch-card";
import img1 from "../../assets/scratch-cards/1.jpg";
import img2 from "../../assets/scratch-cards/2.jpg";
import img3 from "../../assets/scratch-cards/3.jpg";
import img4 from "../../assets/scratch-cards/4.jpg";
import img5 from "../../assets/scratch-cards/5.jpg";
import img6 from "../../assets/scratch-cards/6.jpg";

export default function Rewards() {
  const api = import.meta.env.VITE_API_URL;
  const [rewards, setRewards] = useState([])
  const getImage = () => {
    const arr = [img1, img2, img3, img4, img5, img6];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const getSize = () => {
    if (window.innerWidth <= 426) {
      return 250
    }
    else {
      return 300
    }
  }

  const getRewards = async () => {
    let result = await fetch(`${api}product/reward`, {
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

  const sendComplete = async (id) => {
    let result = await fetch(`${api}product/reward/complete/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  useEffect(() => {
    getRewards().then((res) => {
      if (res.success) {
        setRewards(res.data.rewards)
      }
    })
  }, [])
  if (localStorage.getItem('isLoggedIn')) {
    return (
      <div className='isLogin'>
        <h1>Login to Access</h1>
      </div>
    )
  }

  return (
    <div className="rewards-root">
      {
        rewards && rewards.length > 0 && rewards.map((reward, index) => (
          <div className="card" key={index}>
            <div className="outer">
              {
                reward.isComplete ?
                  (
                    <div className="inner">
                      <p>{reward.title}</p>
                    </div>
                  )
                  :
                  (
                    <ScratchCard
                      cover={getImage()}
                      percent={50}
                      width={getSize()}
                      height={getSize()}
                      onComplete={() => sendComplete(reward._id)}
                    >
                      <div className="inner">
                        <p>{reward.title}</p>
                      </div>
                    </ScratchCard>
                  )
              }
            </div>
            <div className="details">
              <p>
                {reward.desc}
              </p>
            </div>
          </div>
        ))
      }
    </div >
  );
}
