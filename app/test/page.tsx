"use client";
import { FormEvent, useMemo, useState, useRef } from "react";
import { io } from "socket.io-client";

import { IEmployees } from "@/app/types";

export default function Page() {
  const [employees, setEmployees] = useState<IEmployees[] | undefined>();
  const [username, setUsername] = useState("");
  const [userAvailable, setUserAvailable] = useState<IEmployees | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const socket = useMemo(() => io("http://localhost:4000"), []);

  socket.on("connect", () => {
    // console.log("connected");
  });

  socket.on("EMPLOYEE_LIST", (data: string) => {
    const employees = JSON.parse(data);

    setEmployees(employees);
  });

  socket.on("USER_AVAILABLE", (data: string) => {
    setUserAvailable(JSON.parse(data));
  });

  socket.on("LOADING_DONE", (data) => {
    setIsLoading(data);
  });

  socket.on("USER_LOGGED", () => {
    formRef.current?.reset();
  });

  const userExists = employees?.find(
    (employee) => employee.Employee_Username === username,
  );

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    setIsLoading(true);

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password");

    if (userExists) {
      socket.emit("USER_CHECK", userExists.id, password);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleFormSubmit}>
      <input
        required
        name="username"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input required name="password" type="password" />
      {userExists && `${userExists.Clock_Status}`}
      <button disabled={isLoading} type="submit">
        {isLoading ? "Loading ..." : "Submit"}
      </button>
    </form>
  );
}
