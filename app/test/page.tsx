"use client";
import { useMemo } from "react";
import { io } from "socket.io-client";
export default function Page() {
  // const [socket, setSocket] = useState<any>(undefined)
  const socket = useMemo(() => io("http://localhost:4000"), []);

  socket.on("connect", () => {
    // console.log("connected");
  });

  // socket.on("message", (data: string) => {
  //   console.log(data);
  // });

  const handleServerTest = () => {
    socket.emit("test", "hello server, this is client");
  };

  return (
    <div>
      <button onClick={handleServerTest}>Test Server</button>
    </div>
  );
}
