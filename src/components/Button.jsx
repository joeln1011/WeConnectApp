import { CircularProgress, Button as MUIButton } from "@mui/material";

const Button = ({
  isLoading = false,
  onClick,
  variant = "outlined",
  icon,
  children,
  size,
}) => {
  return (
    <MUIButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress className="mr-1 animate-spin" size="16px" />
      ) : (
        icon
      )}
      {children}
    </MUIButton>
  );
};

export default Button;
