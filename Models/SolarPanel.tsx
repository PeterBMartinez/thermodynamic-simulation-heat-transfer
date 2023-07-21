import SolarPanelLayer from "./SolarPanelLayer";

export default class SolarPanel {
    private _solarPanelLayers = [
        new SolarPanelLayer(0.9, 0.0032, 2500, 700), // Glass
        new SolarPanelLayer(0.17, 0.0003, 970, 2000), // EVA
        new SolarPanelLayer(148, 0.0003, 2330, 700), // Silicon
        new SolarPanelLayer(0.15, 0.0003, 1390, 1400), // Tedlar
    ];

    public surfaceArea = this._height * this._width;

    constructor(
        public tempature = 55, // In Celcius
        private _height = 0, // In Meters
        private _width = 0, // In Meters
        ) { }


    public totalThermalConductivity = this._solarPanelLayers.reduce((a: any, b: any) => a + (b.conductivity * b.thickness), 0);
    public totalThickness = this._solarPanelLayers.reduce((a: any, b: any) => a + b.thickness, 0);
    public totalHeatCapacity = this._solarPanelLayers.reduce((a: any, b: any) => a + (b.heatCapacity * b.density * b.thickness), 0);
    
    public totalVolume = this._height * this._width * this.totalThickness;
    public totalDensity = this._solarPanelLayers.reduce((a: any, b: any) => a + b.density, 0);
    public totalMass = this.totalVolume * this.totalDensity;

}