import Logo from "assets/logo.jpg";
import { MyButton, MyInput } from "components";
import { PageLinks } from "constant";
import { Form, Formik } from "formik";
import { AppIconType, QueryNames, UserType } from "interfaces";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getIconsHandler } from "utils";
import * as yup from "yup";
import { AuthContext } from "../context";

const validationSchema = yup.object().shape({
  userType: yup
    .mixed<UserType>()
    .oneOf([UserType.USER, UserType.AGENT])
    .required("Select a role"),
  email: yup
    .string()
    .trim()
    .email(" ")
    .required(" "),
  password: yup
    .string()
    .min(6, " ")
    .required(" "),
});

function LoginPage() {
  const { loginHandler } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const queryEmail = query.get(QueryNames.EMAIL) || "";

  const initialType = (() => {
    const t = query.get(QueryNames.USER_TYPE);
    return (t as UserType) ?? UserType.USER;
  })();

  const [userType, setUserType] = useState<UserType>(initialType);
  const [showPassword, setShowPassword] = useState(false);

  const TermsUrl = (import.meta.env.VITE_TERMS_CONDITION_URL as string) || "";
  const UserIcon = getIconsHandler(AppIconType.USER);

  const onSubmitHandler = async (values: any) => {
    await loginHandler(values, {
      onSuccess: async (res: any) => {
        navigate(PageLinks.dashboard.list, {
          replace: true,
        });
      },
    });
  };

  // iOS safe height fix
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center bg-bgPrimary"
      style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Palmmind Logo" className="h-12 rounded-md" />
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <div className="relative flex bg-gray-100 rounded-full p-1">
            <div
              className="absolute top-0 left-0 h-full w-1/2 bg-white rounded-full shadow transition-transform duration-300 ease-in-out"
              style={{
                transform:
                  userType === UserType.USER ? "translateX(0)" : "translateX(100%)",
              }}
            />
            {[
              { type: UserType.USER, label: "User", icon: "👤" },
              { type: UserType.AGENT, label: "Agent", icon: "👥" },
            ].map((role) => {
              const isActive = userType === role.type;
              return (
                <button
                  key={role.type}
                  type="button"
                  onClick={() => setUserType(role.type)}
                  className={`flex-1 py-2 text-sm font-medium rounded-full z-10 ${
                    isActive ? "text-black" : "text-gray-600"
                  }`}
                >
                  <span className="mr-1">{role.icon}</span>
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ userType, email: queryEmail, password: "" }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          {() => (
            <Form className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Welcome to Palmmind
              </h1>
              <input type="hidden" name="userType" value={userType} />

              <MyInput
                label={"Email"}
                placeholder="Email address"
                name="email"
                type="email"
              />

              {/* Password with properly centered eye icon */}
              <MyInput
                label={"Password"}
                inputType={"password"}
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="pr-10"
              />

              <MyButton htmlType="submit" name="Get Started" />

              <div className="text-center text-xs text-gray-500">
                By signing up you agree to the{" "}
                <a
                  href={TermsUrl}
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginPage;
