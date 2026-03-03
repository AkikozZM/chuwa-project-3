import React, { type MouseEventHandler } from 'react';
import './Card.css';
import { icons } from '../../constants/icons';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    handleClose?: MouseEventHandler<HTMLDivElement>;

}

export function Card({ children, className = '', handleClose }: CardProps) {
    return (
        <div className={`card ${className}`}>
            {handleClose &&
                <div
                    className="login-close"
                    onClick={handleClose}
                    aria-label="Close"
                >{icons.CLOSE}
                </div>}
            {children}
        </div>);
}

