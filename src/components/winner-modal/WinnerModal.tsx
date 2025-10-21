import { useCarsStore } from '../../store/carsStore';
import './WinnerModal.css';

const WinnerModal: React.FC = () => {
    const { winners, raceInProgress } = useCarsStore();
    const name = winners[0] ? winners[0].name : '';
    const time = winners[0] ? winners[0].raceTime : '';

    if (!raceInProgress || winners.length === 0) {
        return null;
    }

    return (
        <div className='modal winner-modal'>
            <h2>Winner:</h2>
            <p>{name}</p>
            <p>Time: {time}</p>
            <span>Please Reset The Cars</span>
        </div>
    );
}

export default WinnerModal;