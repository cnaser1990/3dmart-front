'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { getProduct } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import Loading from '@/components/Loading'
import ErrorMessage from '@/components/ErrorMessage'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore(state => state.addItem)
  
  useEffect(() => {
    loadProduct()
  }, [params.slug])
  
  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProduct(params.slug)
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.final_price,
      image: product.primary_image,
    })
    
    alert('✅ به سبد خرید اضافه شد')
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} retry={loadProduct} />
  if (!product) return <ErrorMessage message="محصول یافت نشد" />
  
  const images = product.images?.length > 0 ? product.images : [{ image: product.primary_image }]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* تصاویر */}
        <div>
          {/* تصویر اصلی */}
          <div className="relative h-96 bg-gray-200 rounded-lg mb-4 overflow-hidden">
            {images[selectedImage]?.image ? (
              <Image
                src={images[selectedImage].image}
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                بدون تصویر
              </div>
            )}
          </div>
          
          {/* تصاویر کوچک */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden ${
                    selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  {img.image && (
                    <Image
                      src={img.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* اطلاعات */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          {/* قیمت */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(product.final_price)}
            </span>
            <span className="text-gray-600">تومان</span>
            
            {product.discount_percent > 0 && (
              <>
                <span className="text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                  {product.discount_percent}% تخفیف
                </span>
              </>
            )}
          </div>
          
          {/* توضیحات کوتاه */}
          {product.short_description && (
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.short_description}
            </p>
          )}
          
          {/* مشخصات */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">نوع:</span>
              <span className="font-medium">{product.product_type_display || product.product_type}</span>
            </div>
            {product.material && (
              <div className="flex justify-between">
                <span className="text-gray-600">جنس:</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            {product.weight_grams && (
              <div className="flex justify-between">
                <span className="text-gray-600">وزن:</span>
                <span className="font-medium">{product.weight_grams} گرم</span>
              </div>
            )}
            {product.print_time_hours && (
              <div className="flex justify-between">
                <span className="text-gray-600">زمان پرینت:</span>
                <span className="font-medium">{product.print_time_hours} ساعت</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">موجودی:</span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
              </span>
            </div>
          </div>
          
          {/* تگ‌ها */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag.id} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
          
          {/* تعداد و خرید */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.is_available}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.is_available ? '🛒 افزودن به سبد خرید' : 'ناموجود'}
            </button>
          </div>
          
          {/* توضیحات کامل */}
          {product.description && (
            <div className="border-t pt-6">
              <h3 className="font-bold text-xl mb-4">توضیحات</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}