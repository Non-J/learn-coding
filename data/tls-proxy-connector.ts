/**
 * Process environment:
 * - PROXY_LOCAL_HOST
 * - PROXY_LOCAL_PORT
 * - PROXY_REMOTE_HOST
 * - PROXY_REMOTE_PORT
 * - PROXY_IDLE_TIMEOUT
 * - PROXY_FORCE_SECURE
 */

import net from "node:net";
import tls from "node:tls";

const localHost = process.env["PROXY_LOCAL_HOST"]!;
const localPort = Number(process.env["PROXY_LOCAL_PORT"]);
const remoteHost = process.env["PROXY_REMOTE_HOST"]!;
const remotePort = Number(process.env["PROXY_REMOTE_PORT"]);
const idleTimeout = Number(process.env["PROXY_IDLE_TIMEOUT"] ?? 15 * 60 * 1000);
const insecure = !process.env["PROXY_FORCE_SECURE"];

console.log(
  `Listening on ${localHost}:${localPort} -> TLS ${remoteHost}:${remotePort} (insecure=${insecure})`
);

const server = net.createServer({ allowHalfOpen: false }, (localSocket) => {
  const remote = `${remoteHost}:${remotePort}`;
  const local = `${localSocket.remoteAddress}:${localSocket.remotePort}`;

  console.log(`> connection from ${local}`);

  // Prepare TLS options
  const tlsOptions: tls.ConnectionOptions = {
    host: remoteHost,
    port: remotePort,
    servername: remoteHost, // SNI
    rejectUnauthorized: !insecure,
  };

  const remoteSocket = tls.connect(tlsOptions, () => {
    console.log(`> TLS proxy connect ${local} <-> ${remote}`);

    localSocket.pipe(remoteSocket);
    remoteSocket.pipe(localSocket);
  });

  localSocket.setKeepAlive(true);
  localSocket.setNoDelay(true);
  remoteSocket.setKeepAlive(true);
  remoteSocket.setNoDelay(true);

  const onError = (prefix: string) => (err: Error) => {
    console.error(`${prefix} ${local} <-> ${remote} error:`, err.message);
  };

  localSocket.on("error", onError("local: "));
  remoteSocket.on("error", onError("remote: "));

  const closeBoth = (who: string) => () => {
    console.log(`- ${who} closed ${local} <-> ${remote}`);
    if (!localSocket.destroyed) localSocket.destroy();
    if (!remoteSocket.destroyed) remoteSocket.destroy();
  };

  localSocket.on("close", closeBoth("local"));
  remoteSocket.on("close", closeBoth("remote"));

  localSocket.setTimeout(idleTimeout, () => {
    console.log(`- timeout ${local} <-> ${remote}`);
    localSocket.destroy();
    remoteSocket.destroy();
  });
});

server.on("error", (err) => {
  console.error("Local proxy error:", err);
});

server.on("listening", () => {
  const addr = server.address();
  if (addr && typeof addr === "object") {
    console.log(`Local proxy listening on ${addr.address}:${addr.port}`);
  } else {
    console.log("Local proxy listening");
  }
});

server.listen({
  host: localHost,
  port: localPort,
  exclusive: false,
  backlog: 500,
});

const stop = () => {
  console.log("Shutting down...");
  setTimeout(() => process.exit(0), 5000).unref();
  server.close(() => {
    console.log("Local proxy closed");
    process.exit(0);
  });
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
