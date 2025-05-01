import { useAppContext } from "context";
import { UserType } from "interfaces";

function UseAuthorization() {
  const { userDetails } = useAppContext();
  const currentRole = userDetails?.userType;
  const currentUserId = userDetails?._id;
  const currentVendorId = userDetails?.vendor?._id;
  const isUser = currentRole === UserType.USER;
  const isAdmin = currentRole === UserType.HYRE;
  const isVendor = currentRole === UserType.INTERNATIONAL_CARGO_VENDOR;
  const kycStatus = userDetails?.kycStatus;

  const isDevelopmentMode = import.meta.env.DEV;

  const canAccess = (role: UserType[] | UserType) => {
    if (role?.length < 1) return true;

    if (typeof role == "string") {
      return role === userDetails?.userType;
    } else {
      return role.some((e) => e === userDetails?.userType);
    }
  };

  return {
    currentVendorId,
    currentRole,
    currentUserId,
    userDetails,
    kycStatus,
    isDevelopmentMode,
    isAdmin,
    isUser,
    isVendor,
    canAccess,
  };
}

export default UseAuthorization;
