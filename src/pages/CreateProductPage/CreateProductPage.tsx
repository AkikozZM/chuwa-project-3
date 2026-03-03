import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProductAPI } from '../../back-end/APITesting/Product.ts';
import { UPC_REGEX } from '../../utils/regex';
import './CreateProductPage.css';
import { Card } from '../../components/Card/Card';
import { icons } from '../../constants/icons';

export const CreateProductPage: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productUpc, setProductUpc] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productStock, setProductStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [UploadImage, setUploadImage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setShowSuccess(false);

        if (!productName || !productDescription || !productUpc || !productPrice || !productStock || !productCategory) {
            setErrorMsg('All fields are required.');
            return;
        }
        if (!UPC_REGEX.test(productUpc.trim())) {
            setErrorMsg('UPC must be exactly 12 digits.');
            return;
        }

        // BACKEND (Spring Boot): POST `/api/products`
        const res = await createProductAPI(
            productName,
            productDescription,
            productCategory as any, //?
            parseFloat(productPrice),
            parseInt(productStock),
            productUpc.trim(),
            imageUrl
        )

        if (res.success) {
            setShowSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } else {
            setErrorMsg(res.error || 'Failed to create product.');
        }
    };

    const handleClose = () => {
        navigate(-1);
    };


    return (
        <div className='create-product-page'>
            <div>
            <h2 className='title-create-page'>Create Product</h2>
            <Card handleClose={handleClose} className='product-form-container'>
            <form onSubmit={handleSubmit} className='product-form'>
                <label>Product Name</label>
                <input
                    type='text'
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />

                <label>UPC (12-digit number)</label>
                <input
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    maxLength={12}
                    placeholder='000000000000'
                    value={productUpc}
                    onChange={(e) => setProductUpc(e.target.value.replace(/\D/g, ''))}
                />
                
                <label>Product Description</label>
                <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                />

                <div className='product-form-row'>
                    <div className='product-form-group'>
                        <label>Category</label>
                        <select
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                        >
                            <option value="" disabled>Select category</option>
                            <option value='Electronics'>Electronics</option>
                            <option value='Clothing'>Clothing</option>
                            <option value='Books'>Books</option>
                            <option value='Home'>Home</option>
                            <option value='Others'>Others</option>
                        </select>
                    </div>
                    <div className='product-form-group'>
                        <label>Price</label>
                        <input
                            type='number'
                            step='0.01'
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            min='0'
                        />
                    </div>
                </div>

                <div className='product-form-row'>
                    <div className='product-form-group'>
                        <label>In Stock Quantity</label>
                        <input
                            type='number'
                            value={productStock}
                            onChange={(e) => setProductStock(e.target.value)}
                            min='0'
                        />
                    </div>
                    <div className='product-form-group'>
                        <label>Add Image Link</label>
                        <div className='image-upload-with-button'>
                        <input
                            type='text'
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <button 
                        type='button'
                        onClick={() => setUploadImage(imageUrl)}
                        className="upload-btn"
                        >Upload</button>
                        </div>
                    </div>
                </div>
                
                <div className="image-preview-container">
                {UploadImage ? (
                    <div>
                        <img src={UploadImage} alt='Preview' /> 
                        <p>Image preview!</p>
                    </div>
                ): (
                    <>
                    {icons.IMAGE}
                    <p>Image preview will be shown here!</p>
                </>
                )}
                </div>
                {errorMsg && <p className='error-message-product'>{errorMsg}</p>}
                {showSuccess && <p className='success-message-product'>Product created successfully!</p>}
                <button type='submit' className='add-product-button'>Add Product</button>
            </form>
            </Card>
            </div>
        </div>
    );
}