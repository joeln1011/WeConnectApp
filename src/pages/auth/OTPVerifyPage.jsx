import FormField from "@components/FormField";
import { useForm } from "react-hook-form";
import { Button, CircularProgress } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OTPInput from "@components/FormInputs/OTPInput";
import { useVerifyOTPMutation } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { login } from "@redux/slices/authSlice";

const OTPVerifyPage = () => {
  const { control, handleSubmit } = useForm({ defaultValues: { otp: "" } });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verifyOTP, { data, error, isLoading, isError, isSuccess }] =
    useVerifyOTPMutation();
  console.log(location);
  const onSubmit = (formData) => {
    console.log(formData);
    verifyOTP({ otp: formData.otp, email: location?.state?.email });
  };

  console.log({ data });
  useEffect(() => {
    if (isError) {
      dispatch(openSnackbar({ type: "error", message: error.data.message }));
    }
    if (isSuccess) {
      dispatch(login(data));
      navigate("/");
    }
  }, [isSuccess, isError, error, dispatch, data, navigate]);
  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">
        Two-Step Verification
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="otp"
          label="Type your 6 digit security code"
          control={control}
          Component={OTPInput}
        />
        <Button variant="contained" type="submit">
          {isLoading && <CircularProgress size="15px" className="mr-1" />}
          Verify my account
        </Button>
      </form>
      <p className="mt-4 text-center">
        Didn&apos;t get the code? <Link to="/register">Resend</Link>
      </p>
    </div>
  );
};
export default OTPVerifyPage;
