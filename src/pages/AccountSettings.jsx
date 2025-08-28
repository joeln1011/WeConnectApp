import UpdateUserInfoForm from "@components/UpdateUserInfoForm";
import UserPhotoUploader from "@components/UserPhotoUploader";
import { useUserInfo } from "@hooks/index";

const AccountSettings = () => {
  const { image, coverImage } = useUserInfo();

  return (
    <div className="container flex-col">
      <p className="text-xl font-bold">Account Settings</p>
      <div className="card p-0">
        <p className="border-dark-300 border-b p-6 text-lg font-semibold">
          Profile Details
        </p>
        <div className="border-dark-300 border-b p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UserPhotoUploader
              title="Avatar"
              footNote="Allowed JPG or PNG"
              currentImgSrc={image}
            />
            <UserPhotoUploader
              title="Cover Image"
              footNote="Allowed JPG or PNG"
              currentImgSrc={coverImage}
              isCover={true}
            />
          </div>
        </div>
        <div className="p-6 sm:w-1/2">
          <UpdateUserInfoForm />
        </div>
      </div>
    </div>
  );
};
export default AccountSettings;
