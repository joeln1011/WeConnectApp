import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { closeDialog } from "@redux/slices/dialogSlice";
import { useDispatch } from "react-redux";

const ConfirmDialog = ({ message, onConfirm }) => {
  const dispatch = useDispatch();

  const handleConfirm = () => {
    onConfirm();
    dispatch(closeDialog());
  };
  return (
    <>
      <DialogContent className="!py-6">
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="error">
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export default ConfirmDialog;
