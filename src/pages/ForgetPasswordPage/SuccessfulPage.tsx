import React from 'react';
import './SuccessfulPage.css';
import { useNavigate } from 'react-router-dom';
import { icons } from '../../constants/icons';
import { CloseButton } from '../../components/closeButton';

export interface SuccessfulPageProps {
    onClose?: ()=>void;
}

export const SuccessfulPage : React.FC<SuccessfulPageProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const handleClose = () => {
    if(onClose) return onClose();
    navigate('/login');
    };
    
    return (
        <div className="successful-page">
            <div className='success-card'>
                <CloseButton onClick={handleClose} />
                <div className='success-icon'>
                    {icons.EMAIL_SUCCESS}
                </div>
                <p className='success-message-success-page'>
                    We have sent the update password link to your email, please check that!
                </p>
            </div>
        </div>
    );
};