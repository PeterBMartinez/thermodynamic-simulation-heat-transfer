import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";
import { ChangeEvent } from "react";


export default function Form ({
    value,
    id,
    label,
    prefix,
    updateInput,
}: any) {
    return (
        <FormControl variant="standard">
        <InputLabel>{label}</InputLabel>
        <Input 
          className="m-3"
          id={id}
          defaultValue={value}
          type='number'
          onChange={(e: ChangeEvent) => updateInput(e)}
          startAdornment={
            <InputAdornment position="start">
              {prefix}
            </InputAdornment>
          }
        />
      </FormControl>
    );
}