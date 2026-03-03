import React from "react";
import { useNavigate } from "react-router-dom";
import './ErrorPage.css';
import { icons } from '../../constants/icons';



export const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className="error-page">
            <div className="error-card">
                <div className="error-icon">
                    {icons.ERROR}
                </div>
                <h2>Oops, something went wrong!</h2>
                <button className='home-button' onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>
        </main>
    );
};