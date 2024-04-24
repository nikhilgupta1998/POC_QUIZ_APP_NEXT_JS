"use client";
import { useEffect, ReactNode, FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const AuthRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const isAdmin = user?.isAdmin || false;
    const isLoginPage = pathname.includes("/auth/signin");

    if (isLoginPage) {
      if (user) {
        if (isAdmin) {
          router.push("/");
        } else {
          router.push("/quiz");
        }
      }
      return;
    }

    if (!user) {
      router.push("/auth/signin");
    }
  }, [router, pathname, user]);

  return <>{children}</>;
};

export default AuthRoute;
