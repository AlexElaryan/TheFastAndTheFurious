import './Filter.css'
import { CiPlay1 } from "react-icons/ci";
import { RiResetLeftFill } from "react-icons/ri";
import { useCarsStore } from '../../store/carsStore';
import React, { useEffect, useState } from 'react';

const Filter: React.FC = () => {
    const {
        cars,
        selectedCarId,
        brandName,
        brandColor,
        updatingBrandName,
        updatingBrandColor,
        setBrandName,
        setBrandColor,
        setUpdatingBrandName,
        setUpdatingBrandColor,
        generateRandomCars,
        createCar,
        updateCar,
        startRace,
        resetRace,
    } = useCarsStore();

    return (
        <div className="filter">
            <div className="filter-item">
                <button className={`button-type-1 green-btn ${cars[0]?.engine === 'started' ? 'disabled' : ''}`} onClick={() => startRace()}>
                    Race <CiPlay1 />
                </button>
                <button className="button-type-1 purple-btn" onClick={() => resetRace()}>Reset <RiResetLeftFill /></button>
            </div>
            <form className={`filter-item ${cars[0]?.engine === 'started' ? 'disabled' : ''}`}
                onSubmit={(e) => {
                    e.preventDefault();
                    createCar(brandName, brandColor, 'stopped', parseFloat((Math.random() * 5 + 1).toFixed(2)));
                    setBrandName('');
                    setBrandColor('#000000');
                }}
            >
                <input type="text" placeholder='Enter Brand Name' className='input-type-1' required value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                <input type="color" className='color' required value={brandColor} onChange={(e) => setBrandColor(e.target.value)} />
                <button className='button-type-1 purple-btn' type='submit'>Create</button>
            </form>
            <form className={`filter-item ${cars[0]?.engine === 'started' ? 'disabled' : ''}`}
                onSubmit={(e) => {
                    e.preventDefault();
                    updateCar(selectedCarId, updatingBrandName, updatingBrandColor);
                    setUpdatingBrandName('');
                    setUpdatingBrandColor('#000000');
                }}>
                <input type="text" placeholder='Enter Brand Name' className='input-type-1' required value={updatingBrandName} onChange={(e) => setUpdatingBrandName(e.target.value)} />
                <input type="color" className='color' required value={updatingBrandColor} onChange={(e) => setUpdatingBrandColor(e.target.value)} />
                <button className='button-type-1 purple-btn'>Update</button>
            </form>

            <button className={`button-type-1 green-btn ${cars[0]?.engine === 'started' ? 'disabled' : ''}`} onClick={() => generateRandomCars()}>Generate Cars</button>
        </div>
    );
}

export default Filter;