import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useCreateGroupMutation } from "@services/groupApi";
import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";

const NewGroupDialog = () => {
  const [createGroup, { isLoading }] = useCreateGroupMutation();
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

  const onSubmit = (formData) => {
    createGroup(formData);
  };

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
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
            Component={TextInput}
            error={errors["description"]}
          />
        </DialogContent>
        <DialogActions className="!px-6 !pt-0 !pb-5">
          <Button fullWidth variant="contained">
            {isLoading && <CircularProgress size="16px" className="mr-1" />}
            Create Group
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};
export default NewGroupDialog;
