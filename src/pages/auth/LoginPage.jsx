import FormField from "@components/FormField";
import { useForm } from "react-hook-form";
import TextInput from "@components/FormInputs/TextInput";
import { Alert, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginMutation } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@redux/slices/snackbarSlice";

const LoginPage = () => {
  const [login, { data = {}, isLoading, error, isSuccess, isError }] =
    useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const formSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid",
      )
      .required(),
    password: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(formData) {
    console.log(formData);
    login(formData);
  }
  console.log({ email: getValues("email") });

  useEffect(() => {
    if (isError) {
      dispatch(openSnackbar({ type: "error", message: error.data?.message }));
    }
    if (isSuccess) {
      dispatch(openSnackbar({ message: data?.message }));
      navigate("/verify-otp", {
        state: {
          email: getValues("email"),
        },
      });
    }
  }, [isError, error, dispatch, isSuccess, data?.message, navigate, getValues]);

  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">Log In</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="email"
          label="Email"
          control={control}
          Component={TextInput}
          error={errors["email"]}
        />
        <FormField
          name="password"
          label="Password"
          control={control}
          type="password"
          Component={TextInput}
          error={errors["password"]}
        />
        <Button variant="contained" type="submit">
          {isLoading && <CircularProgress size="15px" className="mr-1" />}
          Log In
        </Button>
      </form>
      {isError && <Alert severity="error">{error?.data?.message}</Alert>}
      <p className="mt-4 text-center">
        New on our platform? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
