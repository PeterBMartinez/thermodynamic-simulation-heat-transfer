export default class CoolingSystem {
    convectiveHeatTransferCoefficient: number = 10; // Wats a Meter
    public fluidHeatCapacity = 4.182 // In J/Kg default is Water
    private _fluidDensity = 997 // In Kg/m^3 default is Water
    private _flowDuration = 1000 // In mico seconds

    constructor(
        public fluidTemperatureInPipesUpper = 22, // In Celcius
        public fluidTemperatureInPipesLower = 22, // In Celcius
        public depth = 0.05, // In Meters
        private _fluidFlowRate = 4, // In Liters,
        ) {
    }

    getMass = () => {
        const volumeOfWater = (this._fluidFlowRate * 0.001) * this._flowDuration;
        const massOfWater = volumeOfWater * this._fluidDensity;
        return massOfWater;
      };
}