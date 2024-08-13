"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express = require("express");
const server = (0, http_1.createServer)();
const io = new socket_io_1.Server();
server.listen(4000, () => {
    console.log("Server started on port", 4000);
});
