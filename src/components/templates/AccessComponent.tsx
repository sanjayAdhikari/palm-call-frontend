import React from "react";
import { UserType } from "interfaces";
import { useAuthorization } from "hooks";

function AccessComponent({
  accessBy,
  children,
}: {
  children: any;
  accessBy: UserType[];
}) {
  const { canAccess } = useAuthorization();

  if (!canAccess(accessBy)) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-7xl font-extrabold text-red-500">403</h1>
            <p className="text-2xl font-semibold text-gray-800 mt-4">
              Access Denied
            </p>
            <p className="text-gray-500 mt-2">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
        );
      </div>
    );
  }

  return <>{children}</>;
}

export default AccessComponent;
