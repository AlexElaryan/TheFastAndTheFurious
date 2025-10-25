import React, { useEffect, useRef } from 'react';
import { useCarsStore } from '../../store/carsStore';
import './Carlist.css';
import { FaArrowLeftLong, FaCarSide } from "react-icons/fa6";

const Carlist: React.FC = () => {
    const {
        cars,
        page,
        totalCount,
        selectedCarId,
        roadLength,
        resetRoadLength,
        setPage,
        fetchCars,
        setSelectedCarId,
        deleteCar,
        startEngine,
        stopEngine,
        setRoadLength,
        getCarRef,
    } = useCarsStore();

    const [middleLength, setMiddleLength] = React.useState(0);
    const carMiddleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCars(page);
    }, [page, fetchCars]);

    useEffect(() => {
        const updateLength = () => {
            if (carMiddleRef.current) {
                const newLength = carMiddleRef.current.offsetWidth;
                setMiddleLength(newLength);
            }
        };

        const timer = setTimeout(updateLength, 100);

        window.addEventListener('resize', updateLength);

        return () => {
            window.removeEventListener('resize', updateLength);
            clearTimeout(timer);
        };
    }, [roadLength, resetRoadLength, setRoadLength]);

    useEffect(() => {
        if (!resetRoadLength) {
            const newLength = middleLength + 40;
            setRoadLength(newLength);
        }
    }, [middleLength, resetRoadLength, setRoadLength]);

    return (
        <div className='carlist'>
            {cars.length === 0 ? <p className='warning'>No cars available, please change the page or (create) generate new cars</p> : (
                <ul className='carlist-ul'>
                    {cars.map((car) => (
                        <li key={car.id} className='car-item'>
                            <div className="car-item_left">
                                <div>
                                    <button className={`button-type-1 blue-btn ${selectedCarId === car.id ? 'active' : ''} ${car.engine === 'started' ? 'disabled' : ''}`} onClick={() => setSelectedCarId(car.id)}>Select</button>
                                    <button className={`button-type-1 purple-btn ${car.engine === 'started' ? 'disabled' : ''}`} onClick={() => deleteCar(car.id)}>Remove</button>
                                </div>
                                <div>
                                    <button className={`button-type-1 yellow-btn ${car.engine === 'started' ? 'disabled' : ''}`} onClick={() => startEngine(car.id, getCarRef(car.id))} >A</button>
                                    <button className={`button-type-1 gray-btn ${car.engine === 'stopped' ? 'disabled' : ''} ${car.engine === 'started' ? 'active' : ''}`} onClick={() => stopEngine(car.id)}>B</button>
                                </div>
                                <div
                                    className='car-item_track'
                                    ref={getCarRef(car.id)} >
                                    <FaCarSide className='car' style={{ color: car.color }} />
                                </div>
                            </div>
                            <div className="car-item_middle" ref={carMiddleRef}>
                                <p style={{color: car.color}}>{car.name}</p>
                            </div>
                            <div className="car-item_right"></div>
                        </li>
                    ))}
                </ul>
            )}
            <div className='carlist-bottom'>
                <div className='carlist-totalcount'>
                    <p>GARAGE ({totalCount})</p>
                </div>
                <div className='carlist-pagination'>
                    <button className='button-type-1' onClick={() => setPage(page - 1)}>
                        <FaArrowLeftLong />
                    </button>
                    <span>{page}</span>
                    <button className='button-type-1' onClick={() => setPage(page + 1)}>
                        <FaArrowLeftLong style={{ transform: 'rotate(180deg)' }} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Carlist;