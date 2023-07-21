import FieldGroup from '../components/Form/FieldGroup'
import Chart from '@/components/Chart'
import { ChangeEvent, Component } from 'react';
import SolarPanel from '..//Models/SolarPanel';
import CoolingSystem from '../Models/CoolingSystem';
import StorageTank from '../Models/StorageTank';

export default class HomeSmartComponent extends Component {
  state = {
    duration: 5,
    solarPanelTemperature: 55,
    solarPanelTemperatureChart: 55,
    solarPanelHeight: 5,
    solarPanelWidth: 10,
    coolingLiquidTemperature: 22,
    coolingLiquidFlowRate: 4,
    storageTankTemperature: 22,
    storageTankTemperatureChart: 22,
    storageTankRadius: 1.5,
    storageTankHeight: 6,
    topCoolingLiquidTemperatureChart: 22,
    bottomCoolingLiquidTemperatureChart: 22,
    skip: false,
    currentDuration: 0
  }

  constructor(props: any) {
    super(props);
  }


  calculateConductionHeatTransferRate = (conductivity: number, area: number, temperatureDifference: number, depth: number):number => {
    return (conductivity * area * temperatureDifference) / depth;
  };

  calculateConvectionHeatTransferRate = (convection: number, area: number, temperatureDifference: number): number => {
    return convection * area * temperatureDifference;
  };

  calculateTemperatureChange = (conductionHeatTransfer: number, duration: number, massOfWater: number, heatCapacity: number ): number => {
    return (conductionHeatTransfer) * duration / (massOfWater * heatCapacity);
  };
  
  updateInput = (event: ChangeEvent): void => {
    const { id, value, checked, type } = event.target as HTMLInputElement;
    
    let newValue: number | null = null;
    newValue =  (value as string).includes('.') ? parseFloat(value) : parseInt(value);

    this.setState({
        ...this.state,
        [id]: type === 'checkbox' ? checked : newValue ?? value
    });
  }

  roundToNearedDecimal = (number: number): number => {
    return Math.round(number * 100) / 100
  }

  promisedSetState = (coolingSystem: CoolingSystem, solarPanel:SolarPanel, storageTank: StorageTank, currentCount: number) => 
  new Promise(resolve => this.setState({
    ...this.state,
    solarPanelTemperatureChart: solarPanel.temperature,
    storageTankTemperatureChart: storageTank.temperature,
    topCoolingLiquidTemperatureChart: coolingSystem.fluidTemperatureInPipesUpper,
    bottomCoolingLiquidTemperatureChart: coolingSystem.fluidTemperatureInPipesLower,
    currentDuration: currentCount
    }, () => {
      if (this.state.skip) {
        resolve(true);
      }
      setTimeout(() => {
        resolve(true);
      }, 1000);
    })
  );


  simulateHeatTransfer = async () => {
    const { solarPanelHeight, solarPanelWidth, solarPanelTemperature, coolingLiquidTemperature, coolingLiquidFlowRate, storageTankTemperature, storageTankRadius, storageTankHeight} = this.state;
    const solarPanel = new SolarPanel(solarPanelTemperature, solarPanelHeight, solarPanelWidth)
    const coolingSystem = new CoolingSystem(coolingLiquidTemperature, coolingLiquidTemperature, coolingLiquidFlowRate, 0.05)
    const storageTank = new StorageTank(storageTankTemperature, storageTankRadius, storageTankHeight)

    for(let i = 0; i < this.state.duration; i++) {
      const conductionHeatTransferSolarPanel = this.calculateConductionHeatTransferRate(
        0.6,
        solarPanel.surfaceArea,
        solarPanel.temperature - coolingSystem.fluidTemperatureInPipesLower,
        coolingSystem.depth
      );

      const waterConductionHeatTransferRateStorageTank = this.calculateConductionHeatTransferRate(
        0.6,
        storageTank.getSurfaceArea(),
        coolingSystem.fluidTemperatureInPipesUpper - storageTank.temperature, 
        coolingSystem.depth
      );

      const conventionHeatTransferRateSolarPanel = this.calculateConvectionHeatTransferRate(
        10,
        solarPanel.surfaceArea,
        solarPanel.temperature - coolingSystem.fluidTemperatureInPipesUpper, 
      );

      
      const conventionHeatTransferRateStorageTank = this.calculateConvectionHeatTransferRate(
        5000, 
        storageTank.getSurfaceArea(),
        storageTank.temperature - coolingSystem.fluidTemperatureInPipesLower, 
      );


      const solarTemperatureChange = this.calculateTemperatureChange(
        conductionHeatTransferSolarPanel,
        1,
        coolingSystem.getMass() / 2, // calculate the mass of the storageTank
        solarPanel.totalHeatCapacity // calculate the heat capacity of the solar pane
      );

      const waterTemperatureChangeFromSolarPanel = this.calculateTemperatureChange(
        conventionHeatTransferRateSolarPanel,
        1,
        solarPanel.totalMass, // calculate the mass of the storageTank
        coolingSystem.fluidHeatCapacity // calculate the heat capacity of the solar panel
      );



      const storageTankTemperatureChange = this.calculateTemperatureChange(
        waterConductionHeatTransferRateStorageTank,
        1,
        coolingSystem.getMass() / 2, // calculate the mass of the storageTank
        coolingSystem.fluidHeatCapacity // calculate the heat capacity of the solar panel
      );

      const waterTemperatureChangeFromStorageTank = this.calculateTemperatureChange(
        conventionHeatTransferRateStorageTank,
        1,
        storageTank.getMass(), // calculate the mass of the storageTank
        coolingSystem.fluidHeatCapacity // calculate the heat capacity of the storage tank
      );


        solarPanel.temperature -= this.roundToNearedDecimal(solarTemperatureChange);
        coolingSystem.fluidTemperatureInPipesUpper += this.roundToNearedDecimal(waterTemperatureChangeFromSolarPanel);
        storageTank.temperature += this.roundToNearedDecimal(storageTankTemperatureChange);
        coolingSystem.fluidTemperatureInPipesLower += this.roundToNearedDecimal(waterTemperatureChangeFromStorageTank);

        await this.promisedSetState(coolingSystem, solarPanel, storageTank, i + 1);
    }
  }


  render() {
    return (
    <section className="flex">
      <FieldGroup state={this.state} updateInput={this.updateInput.bind(this)} simulateHeatTransfer={this.simulateHeatTransfer.bind(this)}/>
      <hr/>
      <Chart 
        solarPanelTemperature={this.state.solarPanelTemperatureChart}
        storageTankTemperature={this.state.storageTankTemperatureChart}
        topPipeTemperature={this.state.topCoolingLiquidTemperatureChart}
        bottomPipeTemperature={this.state.bottomCoolingLiquidTemperatureChart}/>
    </section>
    );
  }
}
