import { useState } from "react";
import {
  forgotPassword,
  login,
  logout,
  passwordReset,
  setupWorkspace,
  verifyUserToken,
} from "@/features/auth/services/auth-service";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/features/user/atoms/current-user-atom";
import {
  IForgotPassword,
  ILogin,
  IPasswordReset,
  ISetupWorkspace,
  IVerifyUserToken,
} from "@/features/auth/types/auth.types";
import { notifications } from "@mantine/notifications";
import { IAcceptInvite } from "@/features/workspace/types/workspace.types.ts";
import { acceptInvitation } from "@/features/workspace/services/workspace-service.ts";
import APP_ROUTE, { getPostLoginRedirect } from "@/lib/app-route.ts";
import { RESET } from "jotai/utils";
import { useTranslation } from "react-i18next";

export default function useAuth() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  const handleSignIn = async (data: ILogin) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate(getPostLoginRedirect());
    } catch (err) {
      notifications.show({ message: err.response?.data?.message, color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitationSignUp = async (data: IAcceptInvite) => {
    setIsLoading(true);
    try {
      const response = await acceptInvitation(data);
      if (response?.requiresLogin) {
        notifications.show({ message: t("Account created successfully. Please log in.") });
        navigate(APP_ROUTE.AUTH.LOGIN);
      } else {
        navigate(APP_ROUTE.HOME);
      }
    } catch (err) {
      notifications.show({ message: err.response?.data.message, color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupWorkspace = async (data: ISetupWorkspace) => {
    setIsLoading(true);
    try {
      await setupWorkspace(data);
      navigate(APP_ROUTE.HOME);
    } catch (err) {
      notifications.show({ message: err.response?.data.message, color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (data: IPasswordReset) => {
    setIsLoading(true);
    try {
      const response = await passwordReset(data);
      if (response?.requiresLogin) {
        notifications.show({
          message: t("Password reset was successful. Please log in with your new password."),
        });
        navigate(APP_ROUTE.AUTH.LOGIN);
      } else {
        navigate(APP_ROUTE.HOME);
        notifications.show({ message: t("Password reset was successful") });
      }
    } catch (err) {
      notifications.show({ message: err.response?.data.message, color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setCurrentUser(RESET);
    await logout();
    window.location.replace(`${APP_ROUTE.AUTH.LOGIN}?logout=1`);
  };

  const handleForgotPassword = async (data: IForgotPassword) => {
    setIsLoading(true);
    try {
      await forgotPassword(data);
      return true;
    } catch (err) {
      notifications.show({ message: err.response?.data.message, color: "red" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUserToken = async (data: IVerifyUserToken) => {
    setIsLoading(true);
    try {
      await verifyUserToken(data);
    } catch (err) {
      notifications.show({ message: err.response?.data.message, color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn: handleSignIn,
    invitationSignup: handleInvitationSignUp,
    setupWorkspace: handleSetupWorkspace,
    forgotPassword: handleForgotPassword,
    passwordReset: handlePasswordReset,
    verifyUserToken: handleVerifyUserToken,
    logout: handleLogout,
    isLoading,
  };
}
