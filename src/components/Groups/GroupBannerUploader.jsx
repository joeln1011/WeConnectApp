import Button from "@components/Button";
import { useUploadGroupBannerMutation } from "@services/groupApi";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const GroupBannerUploader = ({ className, groupId }) => {
  const [uploadPhoto, { isLoading }] = useUploadGroupBannerMutation();

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      console.log({ acceptedFiles });

      const formData = new FormData();
      formData.append("isCover", true);
      formData.append("image", acceptedFiles[0]);

      uploadPhoto({ groupId, formData });
    },
    [groupId, uploadPhoto],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: ".jpg,.jpeg,.png",
  });

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <div>
          <div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button variant="contained" size="small" isLoading={isLoading}>
                Upload new banner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupBannerUploader;
