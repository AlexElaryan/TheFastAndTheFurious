import React from "react";
import './Winners.css'
import { useCarsStore } from "../../store/carsStore";
import { BiSortAlt2 } from "react-icons/bi";

const Winners: React.FC = () => {
    const {
        winners
    } = useCarsStore();
    return (
        <div className="winners">
            <h1>Winners
                {winners.length > 0 && (<BiSortAlt2 onClick={() => {
                    const sortedWinners = [...winners].reverse();
                    useCarsStore.setState({ winners: sortedWinners });
                }} className="winners-sort" />)}
            </h1>
            {
                winners.length === 0 ? (
                    <p>No winners yet.</p>
                ) : (
                    <ul>
                        {winners.map((winner) => (
                            <li key={winner.id}>
                                <div>
                                    <p>Name: {winner.name}</p>
                                </div>
                                <div>
                                    <p>Race-Time: {winner.raceTime}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    );
}

export default Winners;