import { TextField } from "@mui/material";

const TextareaInput = ({ onChange, value, name, type = "text", error }) => {
  return (
    <TextField
      fullWidth
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      error={error}
      rows={3}
      multiline
    />
  );
};
export default TextareaInput;
