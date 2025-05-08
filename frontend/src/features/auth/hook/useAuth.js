import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectToken,
} from "@/features/auth/slices/authSlice";
import { useGetCurrentUserQuery } from "@/services/api/userApi";
import { useLoginMutation, useRegisterMutation } from "@/services/api/authApi";
import { formatUserData } from "@/features/user/utils/userUtils";
import { logout } from "../slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  // Get auth state from Redux
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Get auth operations from RTK Query
  const [loginMutation, loginStatus] = useLoginMutation();
  const [registerMutation, registerStatus] = useRegisterMutation();

  // Current user query with skip if not authenticated

  const {
    data: currentUser,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Format user data
  const formattedUserData = useMemo(() => {
    if (!currentUser?.data?.user) return null;
    return formatUserData(currentUser?.data?.user);
  }, [currentUser]);

  // Enhanced login function
  const login = useCallback(
    async (credentials) => {
      try {
        const result = await loginMutation({ ...credentials }).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.data?.message : "Login failed",
        };
      }
    },
    [loginMutation]
  );

  // Enhanced register function
  const register = useCallback(
    async (credentials) => {
      try {
        const result = await registerMutation({
          ...credentials,
        }).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Registration failed",
        };
      }
    },
    [registerMutation]
  );

  // Enhanced logout function
  const logoutUser = useCallback(() => dispatch(logout()), [dispatch]);

  return {
    // Auth state
    user: formattedUserData,
    token,
    isAuthenticated,
    isLoadingUser,

    // Auth operations
    login,
    register,
    logoutUser,
    refetchUser,

    // Operation status
    isLoggingIn: loginStatus.isLoading,
    isRegistering: registerStatus.isLoading,
  };
};
