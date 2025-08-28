import { CircularProgress, Button as MUIButton } from "@mui/material";

const Button = ({
  isLoading = false,
  onClick,
  variant = "outline",
  icon,
  size,
  children,
  className,
  inputProps = {},
}) => {
  return (
    <MUIButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={isLoading}
      className={className}
      {...inputProps}
    >
      {isLoading ? (
        <CircularProgress className="mr-1 animate-spin" size="16px" />
      ) : (
        icon
      )}{" "}
      {children}
    </MUIButton>
  );
};
export default Button;
