"use client"

import { useMemo } from "react";
import { io } from "socket.io-client"

export default function Page() {

    const socket = useMemo(() => io("http://localhost:4000"), []);

    socket.on("connect", () => {
        console.log("connected");
    })
    return (
        <div>
            test
        </div>
    )
}
