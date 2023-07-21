import { Button, FormControl, FormGroup, Input, InputAdornment, InputLabel } from '@mui/material'
import Chart from '@/components/Chart/Chart'
import { ChangeEvent, Component } from 'react';
import SolarPanel from '..//Models/SolarPanel';
import CoolingSystem from '../Models/CoolingSystem';
import StorageTank from '../Models/StorageTank';

export default class HomeSmartComponent extends Component {
  state = {
    duration: 5,
    solarPanelTempature: 55,
    solarPanelTempatureChart: 55,
    solarPanelHeight: 5,
    solarPanelWidth: 10,
    coolingLiquidTempature: 22,
    coolingLiquidFlowRate: 4,
    storageTankTempature: 22,
    storageTankTempatureChart: 22,
    storageTankRadius: 1.5,
    storageTankHeight: 6,
    topCoolingLiquidTempatureChart: 22,
    bottomCoolingLiquidTempatureChart: 22,
  
  }

  constructor(props: any) {
    super(props);
  }


  calculateTempatureDifference = (primaryTemp: number, seconddaryTemp: number): number => {
    return primaryTemp - seconddaryTemp;
  };

  calculateMassOfWater = (coolingSystem: CoolingSystem) => {
    const waterFlow = coolingSystem.fluidFlowRate; // in liters
    const flowDuration = 1;
    const volumeOfWater = waterFlow * flowDuration;
    const densityOfWater = 1000; // kg/m^3
    const massOfWater = volumeOfWater * densityOfWater;

    return massOfWater;
  };

  calculateConductionHeatTransferRate = (conductivity: number, area: number, tempatureDifference: number, depth: number):number => {
    return (conductivity * area * tempatureDifference) / depth;
  };

  calculateConvectionHeatTransferRate = (convection: number, area: number, tempatureDifference: number): number => {
    return convection * area * tempatureDifference;
  };

  calculateTempatureChange = (conductionHeatTransfer: number, duration: number, massOfWater: number, heatCapacity: number ): number => {
    return (conductionHeatTransfer) * duration / (massOfWater * heatCapacity);
  };
  
  updateInput = (event: ChangeEvent): void => {
    const { id, value } = event.target as HTMLInputElement;
    this.setState({
        ...this.state,
        [id]: parseInt(value)
    });
  }

  roundToNearedDecimal = (number: number): number => {
    return Math.round(number * 100) / 100
  }

  simulateHeatTransfer = (): void => {
    // setup instances of the models
    const { solarPanelHeight, solarPanelWidth, solarPanelTempature, coolingLiquidTempature, coolingLiquidFlowRate, storageTankTempature, storageTankRadius, storageTankHeight} = this.state;
    const solarPanel = new SolarPanel(solarPanelTempature, solarPanelHeight, solarPanelWidth)
    const coolingSystem = new CoolingSystem(coolingLiquidTempature, coolingLiquidFlowRate, 4182, solarPanelHeight, solarPanelWidth, 0.05)
    const storageTank = new StorageTank(storageTankTempature, 60, storageTankRadius, storageTankHeight)

    for(let i = 0; i <= this.state.duration; i++) {
  
      // Obtain the tempature difference between the solar panel and the cooling fluid

      // need to break this function out into steps for readability

      const tempatureDifferenceSolarPanelToCoolingFluid = this.calculateTempatureDifference(
        solarPanel.tempature,
        coolingSystem.fluidTemperatureInPipes
      );

      const tempatureDifferenceStorageTankToCoolingFluid = this.calculateTempatureDifference(
        storageTank.tempature,
        coolingSystem.fluidTemperatureInPipes
      );
  
      // Solar
      const solarPanelConductionHeatTransfer = this.calculateConductionHeatTransferRate(
          solarPanel.totalThermalConductivity, 
          solarPanel.surfaceArea,
          coolingSystem.fluidTemperatureInPipes - solarPanel.tempature, 
          solarPanel.totalThickness
      );

      const waterConductionHeatTransferSolarPanel = this.calculateConductionHeatTransferRate(
          0.6, 
          solarPanel.surfaceArea,
          tempatureDifferenceSolarPanelToCoolingFluid, 
          coolingSystem.depth
      );

      const waterConventionHeatTransferRateSolarPanel = this.calculateConvectionHeatTransferRate(
        10, 
        solarPanel.surfaceArea,
        tempatureDifferenceSolarPanelToCoolingFluid, 
      );
      // end solar


      // storage tank
      const storageTankPanelConductionHeatTransfer = this.calculateConductionHeatTransferRate(
        0.6, 
        storageTank.getSurfaceArea(),
        coolingSystem.fluidTemperatureInPipes - storageTank.tempature, 
        solarPanel.totalThickness
      );
      
      const waterConductionHeatTransferRateStorageTank = this.calculateConductionHeatTransferRate(
        0.6, 
        storageTank.getSurfaceArea(),
        tempatureDifferenceStorageTankToCoolingFluid,
        coolingSystem.depth
      );

      const waterConventionHeatTransferRateStorageTank = this.calculateConvectionHeatTransferRate(
        0.6, 
        storageTank.getSurfaceArea(),
        tempatureDifferenceStorageTankToCoolingFluid, 
      );
      // end storage tank
    

      const waterHeatTransferTotalSolarPanel = waterConductionHeatTransferSolarPanel + waterConventionHeatTransferRateSolarPanel;
      const waterHeatTransferStorageTank = waterConductionHeatTransferRateStorageTank + waterConventionHeatTransferRateStorageTank;
      // Calculate the heat transfer rate through conduction
  
      const solarTempatureChange = this.calculateTempatureChange(
        solarPanelConductionHeatTransfer,
        1000,
        this.calculateMassOfWater(coolingSystem),
        coolingSystem.fluidHeatCapacity
      );
      
      const waterTempatureChangeFromSolarPanel = this.calculateTempatureChange(
        waterHeatTransferTotalSolarPanel,
        1000,
        solarPanel.totalMass, // calculate the mass of the solar panel
        solarPanel.totalHeatCapacity // calculate the heat capacity of the solar panel
      );

      const waterTempatureChangeFromStorageTank = this.calculateTempatureChange(
        waterHeatTransferStorageTank,
        1000,
        storageTank.gallons * 3.78, // calculate the mass of the storage tank
        coolingSystem.fluidHeatCapacity // calculate the heat capacity of the storage tank
      );

      const storageTankTempatureChange = this.calculateTempatureChange(
        storageTankPanelConductionHeatTransfer,
        1000,
        this.calculateMassOfWater(coolingSystem), // calculate the mass of the storageTank
        coolingSystem.fluidHeatCapacity // calculate the heat capacity of the solar panel
      );



      solarPanel.tempature += this.roundToNearedDecimal(solarTempatureChange);
      coolingSystem.fluidTemperatureInPipes += this.roundToNearedDecimal(waterTempatureChangeFromSolarPanel);
      storageTank.tempature += this.roundToNearedDecimal(storageTankTempatureChange);

      this.setState({
        ...this.state,
        solarPanelTempatureChart: solarPanel.tempature,
        storageTankTempatureChart: storageTank.tempature,
        topCoolingLiquidTempatureChart: coolingSystem.fluidTemperatureInPipes,
      }, () => {
        coolingSystem.fluidTemperatureInPipes += this.roundToNearedDecimal(waterTempatureChangeFromStorageTank);
  
        this.setState({
          ...this.state,
          bottomCoolingLiquidTempatureChart: coolingSystem.fluidTemperatureInPipes,
        })
      })
    }
  }


  render() {
    return (
    <section className="flex">
      <div className="input-containers flex flex-col p-12">
      <div className="mb-5">
          <h1 className="mb-4">Time Settings</h1>
          <FormGroup className="flex flex-row">
          <FormControl variant="standard">
              <InputLabel>Duration of simulation (seconds)</InputLabel>
              <Input 
                className="m-3"
                id="duration"
                defaultValue={this.state.duration}
                type='number'
                onChange={(e: ChangeEvent) => this.updateInput(e)}
                startAdornment={
                  <InputAdornment position="start">
                    Seconds
                  </InputAdornment>
                }
              />
            </FormControl>
          </FormGroup>
        </div>
        <div className="mb-5">
          <h1 className="mb-4">Solar Panel Settings</h1>
          <FormGroup className="flex flex-row">
            <FormControl variant="standard">
              <InputLabel>Solar Panel Tempature</InputLabel>
              <Input 
                className="m-3"
                id="solarPanelTempature"
                defaultValue={this.state.solarPanelTempature}
                type='number'
                onChange={(e: ChangeEvent) => this.updateInput(e)}
                startAdornment={
                  <InputAdornment position="start">
                    °C
                  </InputAdornment>
                }
                />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel>Solar Panel Width</InputLabel>
              <Input 
                className="m-3"
                id="solarPanelWidth"
                defaultValue={this.state.solarPanelWidth}
                type='number'
                onChange={(e: ChangeEvent) => this.updateInput(e)}
                startAdornment={
                  <InputAdornment position="start">
                    Meters
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel>Solar Panel Height</InputLabel>
              <Input 
                className="m-3"
                id="solarPanelHeight"
                defaultValue={this.state.solarPanelHeight}
                type='number'
                onChange={(e: ChangeEvent) => this.updateInput(e)}
                startAdornment={
                  <InputAdornment position="start">
                    Meters
                  </InputAdornment>
                }
                />
            </FormControl>
          </FormGroup>
        </div>
        <div className="mb-5">
          <h1 className="mb-4">Cooling System Settings</h1>
          <FormGroup className="flex flex-row">
          <FormControl variant="standard">
              <InputLabel>Cooling fluid Starting Tempature</InputLabel>
              <Input 
                className="m-3"
                id="coolingLiquidTempature"
                defaultValue={this.state.coolingLiquidTempature}
                type='number'
                onChange={(e: ChangeEvent) => this.updateInput(e)}
                startAdornment={
                  <InputAdornment position="start">
                    °C
                  </InputAdornment>
                }
                />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel>Cooling fluid flow rate</InputLabel>
              <Input 
                className="m-3"
                id="coolingLiquidFlowRate"
                defaultValue={this.state.coolingLiquidFlowRate}
                type='number'
                onChange={(e: ChangeEvent) => this.updateInput(e)}
                startAdornment={
                  <InputAdornment position="start">
                    Liters per Second
                  </InputAdornment>
                }
                />
            </FormControl>
          </FormGroup>
        </div>
        <div className="mb-5">
          <h1 className="mb-4">Storage Tank Settings</h1>
          <FormGroup className="flex flex-row">
            <FormControl variant="standard">
                <InputLabel>Storage Tank Starting Tempature</InputLabel>
                <Input 
                  className="m-3"
                  id="storageTankTempature"
                  defaultValue={this.state.storageTankTempature}
                  type='number'
                  onChange={(e: ChangeEvent) => this.updateInput(e)}
                  startAdornment={
                    <InputAdornment position="start">
                      °C
                    </InputAdornment>
                  }
                  />
              </FormControl>
            <FormControl variant="standard">
                <InputLabel>Storage Tank Height</InputLabel>
                <Input 
                  className="m-3"
                  id="coolingLiquidTempature"
                  defaultValue={this.state.storageTankHeight}
                  type='number'
                  onChange={(e: ChangeEvent) => this.updateInput(e)}
                  startAdornment={
                    <InputAdornment position="start">
                      Height
                    </InputAdornment>
                  }
                  />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel>Storage Tank Radius</InputLabel>
              <Input 
                className="m-3"
                id="coolingLiquidFlowRate"
                defaultValue={this.state.storageTankRadius}
                type='number'
                onChange={(e: ChangeEvent) => this.updateInput(e)}
                startAdornment={
                  <InputAdornment position="start">
                    Radius
                  </InputAdornment>
                }
                />
            </FormControl>
          </FormGroup>
        <Button className="m-auto flex mb-12" onClick={this.simulateHeatTransfer}>Simulate</Button>
        </div>
      </div>
      <hr/>
      <Chart 
        solarPanelTempature={this.state.solarPanelTempatureChart}
        storageTankTempature={this.state.storageTankTempatureChart}
        topPipeTempature={this.state.topCoolingLiquidTempatureChart}
        bottomPipeTempature={this.state.bottomCoolingLiquidTempatureChart}/>
    </section>
    );
  }
}
