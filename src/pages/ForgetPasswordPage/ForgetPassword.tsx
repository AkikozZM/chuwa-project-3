import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgetPassword.css';
import { CloseButton } from '../../components/closeButton';
import { EMAIL_REGEX } from '../../utils/regex';
import { forgotPasswordAPI } from '../../back-end/APITesting/User.ts';

export interface ForgetPasswordProps {
    onClose?: () => void;
}

export const ForgetPassword: React.FC<ForgetPasswordProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [inputError, setInputError] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setInputError(false);

        if (!EMAIL_REGEX.test(email)) {
            setErrorMsg('Please enter a valid email address');
            setInputError(true);
            return;
        }

        try {
            // BACKEND (Spring Boot):
            // - POST `/api/auth/forgot-password?resetBaseUrl=<frontend-url>`
            const forgotResponse = await forgotPasswordAPI(email);
            if (!forgotResponse.success) {
                setErrorMsg('Failed to send reset email.');
                setInputError(true);
                return;
            }

            navigate('/forgot-password-success');
        } catch(error) {
            console.error(error);
            setErrorMsg('An error occurred while processing your request.');
            setInputError(true);
        }
    };

    const handleClose = () => {
        if(onClose) return onClose();
        navigate('/login');
    }
    

    return (
        <div className='update-card-overlay'>
            <div className='update-card'>
                <CloseButton onClick={handleClose} />
                <h2 className='update-title'>Update your password</h2>
                <p className='update-subtext'>Enter your email link, we will send you the recovery link</p>

                <form className='update-form' onSubmit={handleSubmit}>
                    <label htmlFor='update-email' className='update-label'>
                        Email
                    </label>
                    {errorMsg && <div className='update-error-message'>{errorMsg}</div>}
                    <input 
                        id="update-email"
                        type="email"
                        className={`update-input ${inputError ? ' update-input-error' : ''}`}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMsg('');
                            setInputError(false);
                        }}
                        required
                    />
                    <button type="submit" className='update-button'>Update Password</button>
                </form>
            </div>
        </div>
    );

};