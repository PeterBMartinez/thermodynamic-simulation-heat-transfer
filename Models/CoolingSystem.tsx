export default class CoolingSystem {
    convectiveHeatTransferCoefficient: number = 10; // Wats a Meter

    constructor(
        public fluidTemperatureInPipes = 22, // In Celcius
        public fluidFlowRate = 4, // In Liters,
        public fluidHeatCapacity = 4182, // In J/Kg default is Water
        public depth = 0.05, // In Meters
        ) {
    }
}