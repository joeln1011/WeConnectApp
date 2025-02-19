import FormField from "@components/FormField";
import { useForm } from "react-hook-form";
import TextInput from "@components/FormInputs/TextInput";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "@redux/slices/authSlice";

const LoginPage = () => {
  const { control } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      login({ accessToken: "accessToken", refreshToken: "refreshToken" }),
    );
  }, []);

  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">Log In</p>
      <form className="flex flex-col gap-4">
        <FormField
          name="email"
          label="Full Name"
          control={control}
          Component={TextInput}
        />
        <div className="flex">
          <FormField
            name="password"
            label="Password"
            control={control}
            Component={TextInput}
          />
          <Link to="/verify-otp">Forgot Password?</Link>
        </div>
        <Button variant="contained">Log In</Button>
      </form>
      <p className="mt-4 text-center">
        New on our platform? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
