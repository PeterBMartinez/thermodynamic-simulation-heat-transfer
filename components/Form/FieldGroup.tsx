import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Input, InputAdornment, InputLabel } from "@mui/material";
import { ChangeEvent } from "react";
import Field from "./Field";

export default function Form ({
    state: {
    duration,
    solarPanelTemperature,
    solarPanelHeight,
    solarPanelWidth,
    coolingLiquidTemperature,
    coolingLiquidFlowRate,
    storageTankTemperature,
    storageTankRadius,
    storageTankHeight,
    currentDuration
    },
    updateInput,
    simulateHeatTransfer
    }: any) {

    return (
<div className="input-containers flex flex-col p-12">
      <div className="mb-5">
          <h1 className="mb-4">Time Settings</h1>
          <FormGroup className="flex flex-row">
            <Field value={duration} id="duration" label="Duration of simulation (seconds)" prefix="Seconds" updateInput={updateInput}/>
            <p>Current Duration Second: {currentDuration}</p>
          </FormGroup>
        </div>
        <div className="mb-5">
          <h1 className="mb-4">Solar Panel Settings</h1>
          <FormGroup className="flex flex-row">
            <Field value={solarPanelTemperature} id="solarPanelTemperature" label={'Solar Panel Temperature'} prefix="°C" updateInput={updateInput}/>
            <Field value={solarPanelWidth} id="solarPanelWidth" label={'Solar Panel Width'} prefix="Meters" updateInput={updateInput}/>
            <Field value={solarPanelHeight} id="solarPanelHeight" label={'Solar Panel Height'} prefix="Meters" updateInput={updateInput}/>
          </FormGroup>
        </div>
        <div className="mb-5">
          <h1 className="mb-4">Cooling System Settings</h1>
          <FormGroup className="flex flex-row">
            <Field value={coolingLiquidTemperature} id="coolingLiquidTemperature" label={'Cooling fluid Starting Temperature'} prefix="°C" updateInput={updateInput}/>
            <Field value={coolingLiquidFlowRate} id="coolingLiquidFlowRate" label={'Cooling fluid flow rate'} prefix="Liters per Second" updateInput={updateInput}/>
          </FormGroup>
        </div>
        <div className="mb-5">
          <h1 className="mb-4">Storage Tank Settings</h1>
          <FormGroup className="flex flex-row">
          <Field value={storageTankTemperature} id="storageTanktemperature" label={'Storage Tank Starting Temperature'} prefix="°C" updateInput={updateInput}/>
          <Field value={storageTankHeight} id="storageTankHeight" label={'Storage Tank Height'} prefix="Meters" updateInput={updateInput}/>
          <Field value={storageTankRadius} id="storageTankRadius" label={'Storage Tank Radius'} prefix="Meters" updateInput={updateInput}/>
          </FormGroup>
          <FormGroup>
            <FormControl variant="standard">
              <FormControlLabel control={<Checkbox id="skip" onChange={(e: ChangeEvent) => updateInput(e)} />} label="Skip to Final Result" />
            </FormControl>
          </FormGroup>
            <Button className="m-auto flex mb-12" onClick={simulateHeatTransfer}>Simulate</Button>
        </div>
      </div>
    );
}