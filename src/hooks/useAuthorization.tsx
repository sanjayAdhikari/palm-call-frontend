import { useAppContext } from "context";
import { UserType } from "interfaces";

function UseAuthorization() {
  const { userDetails } = useAppContext();
  const currentRole = userDetails?.userType;
  const currentUserId = userDetails?._id;
  const isUser = currentRole === UserType.USER;
  const isAdmin = currentRole === UserType.AGENT;

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
    currentRole,
    currentUserId,
    userDetails,
    isDevelopmentMode,
    isAdmin,
    isUser,
    canAccess,
  };
}

export default UseAuthorization;
