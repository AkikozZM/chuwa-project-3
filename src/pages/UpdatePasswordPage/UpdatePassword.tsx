import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { updatePasswordAPI } from '../../back-end/APITesting/User.ts';
import { Link } from 'react-router-dom';
import { PASSWORD_REGEX } from '../../utils/regex';
import './UpdatePassword.css';

export interface UpdatePasswordPageProps {
    onClose?: () => void;
}
export const UpdatePasswordPage: React.FC<UpdatePasswordPageProps> = ({onClose}) => {
    const navigate = useNavigate();
    const { token: paramToken, email: paramEmail } = useParams<{ token?: string; email?: string }>();
    const [searchParams] = useSearchParams();
    const token = paramToken ?? searchParams.get('token') ?? '';
    const emailFromUrl = paramEmail ? decodeURIComponent(paramEmail) : '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClose = () => {
        if (onClose) return onClose();
        navigate('/login');
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Debug-only: remove after Spring Boot endpoint is stable.
        // console.log('Submitting reset password form with:', { email, newPassword, confirmPassword, token });

        if (!newPassword || !confirmPassword) {
            setSubmitError('All fields are required');
            return;
        }
        if (!PASSWORD_REGEX.test(newPassword)) {
            setSubmitError('Password must be at least 8 characters long and contain at least one uppercase letter and one lowercase letter');
            return;
        }

        if (newPassword !== confirmPassword) {
            setSubmitError('Passwords do not match');
            return;
        }

        setSubmitError('');
        try {
            const response = await updatePasswordAPI(token || '', newPassword);
            if (response.success) {
                setSuccessMessage('Password updated successfully');
            } else {
                setSubmitError(response.error || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setSubmitError('An error occurred while updating the password');
        }
    };


    return (
        <Card handleClose={handleClose} className='update-password-card'>
                <h2 className="reset-title">Reset your password</h2>
                {successMessage ? (
                    <div>
                    <div className="success-message">{successMessage}</div>
                    <div className="redirect-message">Click login to redirect to <Link to="/login" className="login-link">login</Link>...</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="reset-form custom-reset-form">
                        {emailFromUrl && (
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={emailFromUrl}
                                    readOnly
                                    className="form-input readonly-input"
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-input password-input"
                            />
                            <button
                                type="button"
                                className="show-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >{showPassword ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="password-input-container"> 
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input password-input"
                            />
                            <button
                                type="button"
                                className="show-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >{showConfirmPassword ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>
                        {submitError && (
                            <div className="error-message">{submitError}</div>
                        )}
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Update Password
                        </button>
                    </form>
                )}

        </Card>
    );
}
