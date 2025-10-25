import React from "react";
import './Garage.css'
import Filter from "../../components/filter/Filter";
import Carlist from "../../components/carlist/Carlist";
import WinnerModal from "../../components/winner-modal/WinnerModal";

const Garage: React.FC = () => {

    return (
        <section className="garage">
            <h1>Garage</h1>
            <Filter />
            <Carlist />
            <WinnerModal />
        </section>
    );
}

export default Garage;