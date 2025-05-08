import { useGetCurrentUserQuery } from "@/services/api/authApi";
import { formatUserData } from "../utils/userUtils";
import { useMemo } from "react";

export const useUser = () => {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetCurrentUserQuery();

  // Format user data
  const formattedUserData = useMemo(() => {
    if (!data?.data.user) return [];
    return formatUserData(data?.data?.user);
  }, [data]);

  return {
    user: formattedUserData || null,
    isLoading,
    isSuccess,
    isError,
    error,
    
    // Methods
    refetch,
  };
};

export default useUser;
