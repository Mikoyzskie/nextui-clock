import { createServer } from "http";

import { Server } from "socket.io";

const express = require("express");

const server = createServer();
const io = new Server();

server.listen(4000, () => {
  console.log("Server started on port", 4000);
});
