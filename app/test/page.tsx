"use client";

import {
  FormEvent,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { Card, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { CircleCheck, CircleX, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { IEmployees } from "@/app/types";
import clsx from "clsx";

export default function Page() {
  const [employees, setEmployees] = useState<IEmployees[] | undefined>();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const socket = useMemo(() => io("http://localhost:4000"), []);

  let userExists = employees?.find(
    (employee) => employee.Employee_Username === username,
  );

  useEffect(() => {
    if (userExists) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [userExists]);

  const toggleVisibility = useCallback(() => setIsVisible((prev) => !prev), []);

  socket.on("EMPLOYEE_LIST", (data: string) => {
    const employees = JSON.parse(data);

    setEmployees(employees);
  });

  socket.on("LOADING_DONE", () => {
    setIsLoading(false);
  });

  socket.on("USER_LOGGED", () => {
    formRef.current?.reset();
    setIsSubmitDisabled(true);
    setErrorMessage("");
  });

  socket.on("ERROR", (data: string) => {
    setErrorMessage(data);
    setIsSubmitDisabled(false);
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setIsSubmitDisabled(true);
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const password = data.get("password");

    if (userExists) {
      socket.emit("USER_CHECK", userExists.id, password);
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center gap-4 p-10">
      <CardHeader className="flex flex-col gap-3 w-full max-w-sm text-center items-center justify-center p-0 relative">
        <Image
          alt="Zanda Logo"
          className="p-0"
          src="/logo-dark.png"
          width={120}
        />
        {/* <div className="text-xs font-bold text-gray-500 tabular-nums">
          {time.toDateString()} {time.toLocaleTimeString()}
        </div> */}
      </CardHeader>
      <p className="text-xs font-bold">Test Text</p>
      <form
        ref={formRef}
        className="flex flex-col items-center justify-center gap-3"
        onSubmit={handleFormSubmit}
      >
        <Input
          isRequired
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          endContent={
            userExists ? (
              userExists.Clock_Status ? (
                <CircleCheck className="text-base text-default-400 pointer-events-none flex-shrink-0" />
              ) : (
                <CircleX className="text-base text-default-400 pointer-events-none flex-shrink-0" />
              )
            ) : (
              ""
            )
          }
          id="username"
          label="Username"
          name="username"
          size="sm"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          isRequired
          aria-label="Password Input"
          autoComplete="on"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <EyeOff className="text-default-400 pointer-events-none" />
              ) : (
                <Eye className="text-default-400 pointer-events-none" />
              )}
            </button>
          }
          id="password"
          label="Password"
          name="password"
          size="sm"
          type={isVisible ? "text" : "password"}
        />
        <p className={clsx("text-xs text-red-500")}>{errorMessage}</p>
        <Link className="text-xs font-bold underline" href={"/reset"}>
          Reset Password
        </Link>
        <Button
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
            size: "md",
            fullWidth: true,
          })}
          isDisabled={isSubmitDisabled}
          type="submit"
        >
          {isLoading ? "Submiting..." : "Time In/Time Out"}
        </Button>
      </form>
    </Card>
  );
}
