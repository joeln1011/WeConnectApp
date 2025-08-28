import { useUserInfo } from "@hooks";
import { Chip, Stack, TextField } from "@mui/material";
import { openDialog } from "@redux/slices/dialogSlice";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import UserAvatar from "./UserAvatar";

export const ImageUploader = ({ image, setImage }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log({ acceptedFiles });

    setImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: ".jpg,.jpeg,.png",
  });

  return (
    <div>
      <div
        {...getRootProps({
          className:
            "border rounded py-4 px-6 text-center bg-slate-100 cursor-pointer h-20 flex items-center justify-center",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
      </div>
      {image?.name && (
        <Stack className="mt-2">
          <Chip
            label={image.name}
            onDelete={() => setImage(null)}
            className="font-bold"
          />
        </Stack>
      )}
    </div>
  );
};

const PostCreation = () => {
  const userInfo = useUserInfo();
  const dispatch = useDispatch();

  return (
    <div className="card flex gap-2">
      <UserAvatar isMyAvatar={true} />
      <TextField
        className="flex-1"
        size="small"
        placeholder="What's on your mind?"
        onClick={() =>
          dispatch(
            openDialog({
              title: "Create Post",
              contentType: "NEW_POST_DIALOG",
              additionalData: userInfo,
            }),
          )
        }
      />
    </div>
  );
};
export default PostCreation;
