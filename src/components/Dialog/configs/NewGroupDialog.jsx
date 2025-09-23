import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  TextareaAutosize,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useCreateGroupMutation } from "@services/groupApi";
import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { closeDialog } from "@redux/slices/dialogSlice";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useNavigate } from "react-router-dom";

const Textarea = (props) => {
  return (
    <TextareaAutosize
      minRows={3}
      className="mt-4 w-full rounded border border-gray-400 p-2"
      {...props}
    />
  );
};
const NewGroupDialog = () => {
  const dispatch = useDispatch();
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    name: yup
      .string()
      .max(100, "Name must be at most 100 characters")
      .required(),
    description: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = async (formData) => {
    const response = await createGroup(formData);

    createGroup(formData);
    dispatch(closeDialog());
    dispatch(openSnackbar({ message: "Group created successfully!" }));
    navigate(`/groups/${response?.data?._id}`);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <FormField
            name="name"
            label="Group Name"
            control={control}
            Component={TextInput}
            error={errors["name"]}
          />
          <FormField
            name="description"
            label="Group Description"
            control={control}
            Component={Textarea}
            error={errors["description"]}
          />
        </DialogContent>
        <DialogActions className="!px-6 !pt-0 !pb-5">
          <Button fullWidth variant="contained" type="submit">
            {isLoading && <CircularProgress size="16px" className="mr-1" />}
            Create Group
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};
export default NewGroupDialog;
