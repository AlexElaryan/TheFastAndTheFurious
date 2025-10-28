import { create } from "zustand";

interface Car {
    id: number;
    name: string;
    color: string;
    engine?: 'stopped' | 'drive' | 'started';
    animationFrameId?: number;
}

interface CarsStore {
    apiUrl: string;
    selectedCarId: number | null;
    brands: string[];
    brandModels: Record<string, string[]>;
    cars: Car[];
    page: number;
    totalCount: number;
    raceInProgress: boolean;
    roadLength: number;
    carRefs: Record<number, React.RefObject<HTMLDivElement>>,
    winners: { id: number; name: string, time: number }[];
    resetRoadLength: boolean;
    brandName: string;
    brandColor: string;
    updatingBrandName: string;
    updatingBrandColor: string;
    setBrandName: (name: string) => void;
    setBrandColor: (color: string) => void;
    setUpdatingBrandName: (name: string) => void;
    setUpdatingBrandColor: (name: string) => void;
    initializeCarRefs: (cars: Car[]) => void;
    setRoadLength: (roadLength: number) => void;
    setSelectedCarId: (id: number | null) => void;
    setTotalCount: (count: number) => void;
    setPage: (newPage: number) => void;
    fetchCars: (page: number) => Promise<void>;
    generateRandomCars: () => Promise<void>;
    createCar: (name: string, color: string, engine?: 'stopped' | 'started' | 'drive') => Promise<void>;
    updateCar: (id: number | null, name: string, color: string) => Promise<void>;
    deleteCar: (id: number) => Promise<void>;
    startEngine: (id: number, ref: React.RefObject<HTMLDivElement> | null, raceStartTime: number | null) => Promise<void>;
    stopEngine: (id: number) => Promise<void>;
    startRace: () => Promise<void>;
    resetRace: () => Promise<void>;
    getCarRef: (id: number) => React.RefObject<HTMLDivElement>;
    triggerRoadRecalculation: () => void;
}

export const useCarsStore = create<CarsStore>((set, get) => ({
    apiUrl: 'https://thefastandthefurious.onrender.com',
    cars: [],
    page: 1,
    brands: ['BMW', 'Audi', 'Mercedes', 'Toyota', 'Honda', 'Ford', 'Nissan', 'Chevrolet', 'Lexus', 'Volkswagen'],
    brandModels: {
        'BMW': ['X5', 'X3', 'M3', 'i8', 'Z4', 'X7', 'M5', '330i', 'X6', '740i'],
        'Audi': ['A4', 'A6', 'Q5', 'Q7', 'R8', 'A3', 'A8', 'Q3', 'RS5', 'TT'],
        'Mercedes': ['C-Class', 'E-Class', 'GLA', 'GLE', 'S-Class', 'A-Class', 'GLC', 'AMG GT', 'B-Class', 'GLS'],
        'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Supra', 'Prius', 'Yaris', 'Avalon', 'Tacoma', 'Land Cruiser'],
        'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Odyssey', 'Ridgeline', 'Insight', 'Passport'],
        'Ford': ['Mustang', 'F-150', 'Explorer', 'Escape', 'Fusion', 'Edge', 'Ranger', 'Bronco', 'Expedition', 'Focus'],
        'Nissan': ['Altima', 'Sentra', 'Rogue', 'Murano', '370Z', 'Pathfinder', 'Maxima', 'Frontier', 'Armada', 'Versa'],
        'Chevrolet': ['Malibu', 'Equinox', 'Traverse', 'Camaro', 'Silverado', 'Tahoe', 'Suburban', 'Colorado', 'Blazer', 'Impala'],
        'Lexus': ['RX', 'ES', 'NX', 'IS', 'LS', 'UX', 'GX', 'RC', 'LX', 'LC'],
        'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Jetta', 'Atlas', 'Arteon', 'Polo', 'ID.4', 'Taos', 'Touareg']
    },
    raceInProgress: false,
    totalCount: 0,
    selectedCarId: null,
    roadLength: 0,
    carRefs: {},
    winners: [],
    resetRoadLength: false,
    brandName: '',
    brandColor: '#000000',
    updatingBrandName: '',
    updatingBrandColor: '#000000',
    setBrandName: (name) => {
        if (name.length <= 23) {
            set({ brandName: name });
        }
    },
    setBrandColor: (color) => set({ brandColor: color }),
    setUpdatingBrandName: (name) => {
        if (name.length <= 23) {
            set({ updatingBrandName: name });
        }
    },
    setUpdatingBrandColor: (color) => set({ updatingBrandColor: color }),

    initializeCarRefs: (cars) => {
        const { carRefs } = get();
        const newRefs = { ...carRefs };

        cars.forEach(car => {
            if (!newRefs[car.id]) {
                newRefs[car.id] = { current: null };
            }
        })

        set({ carRefs: newRefs });
    },

    getCarRef: (id) => {
        const { carRefs } = get();

        if (!carRefs[id]) {
            const newRefs = { ...carRefs, [id]: { current: null } };
            set({ carRefs: newRefs });
            return newRefs[id];
        }

        return carRefs[id];
    },

    setRoadLength: (roadLength) => set({ roadLength: roadLength }),

    setSelectedCarId: (id) => {
        if (id === get().selectedCarId) {
            id = null;
        }
        set({ selectedCarId: id })
    },

    setTotalCount: (count) => set({ totalCount: count }),

    fetchCars: async (page) => {
        try {
            const res = await fetch(`${get().apiUrl}/garage`);
            const data = await res.json();
            const total = data.length;

            const limit = 7;
            const start = (page - 1) * limit;
            const limitedData = data.slice(start, start + limit);

            set({ cars: limitedData, page, totalCount: total });
            get().initializeCarRefs(limitedData);
        } catch (err) {
            console.error(err);
        }

    },

    setPage: (newPage) => {
        const { totalCount } = get();
        const totalPages = Math.ceil(totalCount / 7) || 1;

        if (newPage < 1) newPage = totalPages;
        if (newPage > totalPages) newPage = 1;

        get().fetchCars(newPage);
    },

    generateRandomCars: async () => {
        function getRandomColor() {
            return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        }

        function getRandomName() {
            const brand = get().brands[Math.floor(Math.random() * get().brands.length)];
            const model = get().brandModels[brand][Math.floor(Math.random() * get().brandModels[brand].length)];
            return `${brand} ${model}`;
        }

        const randomCars = Array.from({ length: 100 }, () => ({
            name: getRandomName(),
            color: getRandomColor(),
        }));

        try {
            await Promise.all(randomCars.map(car =>
                fetch(`${get().apiUrl}/garage`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(car)
                })
            ));
        } catch (error) {
            console.error('Generating Cars failed', error);
        }
        set({ resetRoadLength: true });

        try {
            await get().fetchCars(get().page);
        } catch (error) {
            console.error('Fetching Cars in Generate failed', error);
        }

        setTimeout(() => {
            set({ resetRoadLength: false });
        }, 100);
    },

    triggerRoadRecalculation: () => {
        set({ resetRoadLength: true });
        setTimeout(() => {
            set({ resetRoadLength: false });
        }, 100);
    },

    createCar: async (name, color) => {
        try {
            await fetch(`${get().apiUrl}/garage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, color }) });
            await get().fetchCars(get().page);
        } catch (err) {
            console.error('Creating Car Failed', err);
        }
    },

    updateCar: async (id, name, color) => {
        if (id === null) return;
        try {
            await fetch(`${get().apiUrl}/garage/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, color }) });
            await get().fetchCars(get().page);
            get().setSelectedCarId(null);

        } catch (err) {
            console.error('Car Updating failed', err);
        }
    },

    deleteCar: async (id) => {
        try {
            await fetch(`${get().apiUrl}/garage/${id}`, { method: 'DELETE' });
            if (get().winners.length > 0) {
                await fetch(`${get().apiUrl}/winners/${id}`, { method: 'DELETE' })
            }
        } catch (error) {
            console.error('Deleting car failed', error);
        }

        const carToDelete = get().cars.find(car => car.id === id);

        if (carToDelete?.animationFrameId) {
            cancelAnimationFrame(carToDelete.animationFrameId);
        }

        set({
            cars: get().cars.filter(car => car.id !== id),
            carRefs: Object.fromEntries(
                Object.entries(get().carRefs).filter(([carId]) => parseInt(carId) !== id)
            ),
            winners: get().winners.filter(winner => winner.id !== id),
            totalCount: get().totalCount - 1
        });

        if (get().cars.length === 0 && (Math.ceil(get().totalCount / 7) > 1)) {
            if (get().page === 1) {
                get().setPage((Math.ceil(get().totalCount / 7) || 1));
            }
            else {
                get().setPage(get().page - 1);
            }
        }
    },

    startEngine: async (id, ref, raceStartTime) => {
        const { cars, carRefs, roadLength } = get();

        await get().stopEngine(id);

        try {
            const startRes = await fetch(`${get().apiUrl}/engine?id=${id}&status=started`, {
                method: 'PATCH'
            });

            if (!startRes.ok) throw new Error('Failed to start engine');
            const data = await startRes.json();


            const carRef = ref?.current ? ref : carRefs[id];
            if (!carRef?.current) {
                console.warn(`No DOM element found for car ${id}`);
                return;
            }

            const carItem = carRef.current;
            carItem.style.transform = 'translateX(0)';

            if (roadLength > 0 && data.velocity > 0) {
                const duration = data.distance / data.velocity;
                const startTime = Date.now();
                const animateCar = () => {
                    const currentTime = Date.now();
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const currentPosition = progress * roadLength;

                    carItem.style.transform = `translateX(${currentPosition}px)`;

                    if (progress < 1) {
                        const animationFrame = requestAnimationFrame(animateCar);
                        set(state => ({
                            cars: state.cars.map(c =>
                                c.id === id ? { ...c, engine: 'drive', animationFrameId: animationFrame } : c
                            )
                        }));
                    } else if (progress >= 1) {
                        const car = get().cars.find(c => c.id === id);

                        if (car?.animationFrameId) {
                            cancelAnimationFrame(car.animationFrameId);
                        }
                        set(state => ({
                            cars: state.cars.map(c =>
                                c.id === id ? { ...c, engine: 'stopped', animationFrameId: undefined } : c
                            )
                        }));

                        if (get().raceInProgress === true) {
                            const finishedTime = (Date.now() - raceStartTime!) / 1000;
                            const currentWinners = get().winners;
                            if (!currentWinners.find(w => w.id === id)) {
                                const car = cars.find(c => c.id === id);
                                if (car) {
                                    const newWinner = {
                                        id,
                                        name: car.name,
                                        time: parseFloat(finishedTime.toFixed(2))
                                    };
                                    const winRes = async () => await fetch(`${get().apiUrl}/winner`, {
                                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newWinner)
                                    })
                                    set({ winners: [...currentWinners, newWinner] });
                                }
                            }
                        }
                    }
                };

                const animationFrameId = requestAnimationFrame(animateCar);

                try {
                    const driveRes = await fetch(`${get().apiUrl}/engine?id=${id}&status=drive`, {
                        method: 'PATCH',
                    });

                    if (!driveRes.ok) {
                        const car = get().cars.find(c => c.id === id);

                        if (car?.animationFrameId) {
                            cancelAnimationFrame(car.animationFrameId);
                        }
                        set(state => ({
                            cars: state.cars.map(c =>
                                c.id === id ? { ...c, engine: 'stopped', animationFrameId: undefined } : c
                            )
                        }));
                        if (carRef?.current) {

                            carRef.current.style.opacity = '0.5';
                        }

                        try {
                            const stopRes = await fetch(`${get().apiUrl}/engine?id=${id}&status=stopped`, {
                                method: 'PATCH',
                            });
                        } catch (err) {
                            console.error('Stop mode failed after trying to set mode drive in start engine', err);
                        }
                    }
                } catch (error) {
                    console.error('Drive mode failed:', error);
                    await get().stopEngine(id);
                }
            }
        } catch (error) {
            console.error('Start engine failed:', error);
            await get().stopEngine(id);
        }
    },

    stopEngine: async (id) => {
        const car = get().cars.find(car => car.id === id);

        if (car?.animationFrameId) {
            cancelAnimationFrame(car.animationFrameId);
        }

        const carRef = get().carRefs[id];
        if (carRef?.current) {
            carRef.current.style.transform = 'translateX(0)';
            carRef.current.style.opacity = '1';
        }

        set(state => ({
            cars: state.cars.map(c =>
                c.id === id ? { ...c, engine: 'stopped', animationFrameId: undefined } : c
            )
        }));

        try {
            await fetch(`${get().apiUrl}/engine?id=${id}&status=stopped`, {
                method: 'PATCH',
            });
        } catch (error) {
            console.error('Stop engine failed:', error);
        }
    },

    startRace: async () => {
        if (get().cars.length > 0) {
            set({ winners: [], raceInProgress: true });

            const raceStartTime: number = Date.now();

            try {
                await Promise.all(
                    get().cars.map(car => {
                        return get().startEngine(car.id, get().getCarRef(car.id), raceStartTime);
                    })
                );
            } catch (error) {
                console.error('Start Race failed:', error);
            }
        }
    },

    resetRace: async () => {
        set({ raceInProgress: false, winners: [] });
        try {
            await Promise.all(
                get().cars.map(car => get().stopEngine(car.id))
            );
        } catch (error) {
            console.error('Reset Race failed', error);
        }

    },
}));