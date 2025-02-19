import { MuiOtpInput } from "mui-one-time-password-input";

const OTPInput = ({ value, onChange }) => {
  return <MuiOtpInput length={6} value={value} onChange={onChange} />;
};

export default OTPInput;
