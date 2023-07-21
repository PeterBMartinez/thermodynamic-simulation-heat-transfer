export default class StorageTank {

    constructor(
        public tempature = 22, // In Celcius
        public gallons = 60,
        public radius = 3, // In Meters
        public height = 9, // In Meters
        ) {
    }

    getSurfaceArea(): number {
        const lateralArea = 2 * Math.PI * this.radius * this.height;
        const topArea = Math.PI * Math.pow(this.radius, 2);
        return lateralArea + (topArea * 2);
    }
}