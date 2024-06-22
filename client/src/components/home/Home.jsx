import React, { useRef, useState, useEffect, useLocation, useNavigate } from 'react'
import logo from '../../assets/gallery_images/1.jpg'
import logo1 from '../../assets/gallery_images/2.jpg'
import logo2 from '../../assets/gallery_images/3.jpg'
import logo3 from '../../assets/gallery_images/4.jpg'
import Caraousel from './Caraousel.jsx'
import CardWrapper from './CardWrapper.jsx'
import HomeDisplayProduct from './HomeDisplayProduct.jsx'
import Footer from './Footer.jsx'

export default function Home() {
  const api = import.meta.env.VITE_API_URL
  const [ads, setAds] = useState([])
  const [products, setProducts] = useState({ 0: [], 1: [], 2: [], 3: [] })
  const display = [
    [logo, 'Games And Accessories'],
    [logo, 'New Year, New supplies'],
    [logo, 'PC Gears'],
    [logo, 'Refresh your space'],
    [logo, 'Toys under 50$'],
    [logo, 'Shop deals in Fashion']
  ]
  const categories = ["men's clothing", "jewelery", "electronics", "women's clothing"]

  const getProducts = async (id) => {
    let result = await fetch(`${api}product/getProducts/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    result = await result.json()
    return result
  }

  const getAds = async () => {
    let result = await fetch(`${api}product/ads`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    result = await result.json()
    return result
  }

  useEffect(() => {
    categories.forEach((category, index) => {
      getProducts(category)
        .then((res) => {
          setProducts(
            (prev) => ({
              ...prev,
              [index]: res.data
            })
          )
        })
        .catch((err) => {
          console.log(err)
        })
    })
    getAds().then((res) => {
      if (res.success) {
        setAds(res.data)
      }
    })
  }, [])

  // category men , women , jewllery , elect , 
  // [image , card Title , description , rating , price]
  return (
    <div className='home-root'>
      <Caraousel data={ads} />

      <CardWrapper card={products[0]} title={'Best Men Wear'} />
      <CardWrapper card={products[1]} title={'Best Women Wear'} />
      <CardWrapper card={products[2]} title={'Best Women Jwellery'} />
      <CardWrapper card={products[3]} title={'Best Electronic Devices'} />
      <Footer />
    </div>
  )
}
