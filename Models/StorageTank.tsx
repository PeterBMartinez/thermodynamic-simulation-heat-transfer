export default class StorageTank {

    constructor(
        public temperature = 22, // In Celcius
        public radius = 3, // In Meters
        public height = 9, // In Meters
        ) {
    }

    getSurfaceArea(): number {
        const lateralArea = 2 * Math.PI * this.radius * this.height;
        const topArea = Math.PI * Math.pow(this.radius, 2);
        return lateralArea + (topArea * 2);
    }

    getMass(): number {
        const density = 997; // kg/m^3
        const volume = Math.PI * Math.pow(this.radius, 2) * this.height;
        return density * volume;
    }
}