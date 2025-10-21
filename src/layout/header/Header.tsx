import React from "react";
import { Link } from "react-router-dom";
import './Header.css';
import Logo from "../../assets/images/logo.png";

export default function Header() {
    return (
        <header>
            <div className="lk">
                <img src={Logo} alt="" />
            </div>
            <nav>
                <Link to={'/'} className="button-type-1">
                    Garage
                </Link>
                <Link to={'/winners'} className="button-type-1">
                    Winners
                </Link>
            </nav>
        </header>
    );
}