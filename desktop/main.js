const { app, BrowserWindow, ipcMain, protocol, net, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn, exec } = require("child_process");

let mainWindow = null;
let backendProcess = null;

const isDev = !app.isPackaged;

/* ================================
   SINGLE INSTANCE LOCK
================================ */

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
    return;
}

app.on("second-instance", () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

/* ================================
   CUSTOM PROTOCOL (PRODUCTION)
================================ */

protocol.registerSchemesAsPrivileged([
    {
        scheme: "app",
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
        },
    },
]);

/* ================================
   APP READY
================================ */

app.whenReady().then(async () => {
    if (!isDev) {
        protocol.handle("app", async (request) => {
            const url = new URL(request.url);
            let pathname = decodeURIComponent(url.pathname);

            if (pathname === "/") {
                pathname = "/index.html";
            }

            const filePath = path.join(__dirname, "out", pathname);

            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                return net.fetch("file://" + filePath);
            }

            // Only fallback to index.html for routes (NOT static files)
            if (!pathname.startsWith("/_next/")) {
                const fallback = path.join(__dirname, "out", "index.html");
                return net.fetch("file://" + fallback);
            }

            return new Response("Not Found", { status: 404 });
        });

    }

    startBackend();

    try {
        await waitForBackend();
    } catch (err) {
        console.error("Backend failed to start:", err.message);
    }

    createWindow();
});

/* ================================
   WINDOW
================================ */

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 920,
        frame: false,
        icon: path.join(__dirname, isDev ? "public" : "out", "logo.ico"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (isDev) {
        mainWindow.loadURL("http://localhost:3000");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL("app://index.html");
    }

    // Disable DevTools and Reload shortcuts in production
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (!isDev) {
            const isInspectElement =
                (input.control && input.shift && input.key.toLowerCase() === "i") ||
                input.key === "F12" ||
                (input.meta && input.alt && input.key.toLowerCase() === "i");

            const isReload =
                (input.control && input.key.toLowerCase() === "r") ||
                (input.control && input.shift && input.key.toLowerCase() === "r") ||
                (input.meta && input.key.toLowerCase() === "r") ||
                input.key === "F5";

            if (isInspectElement || isReload) {
                event.preventDefault();
            }
        }
    });

    mainWindow.on("close", () => {
        stopBackend();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

/* ================================
   BACKEND MANAGEMENT
================================ */

function startBackend() {
    if (isDev) return;

    const backendDir = path.join(process.resourcesPath, "backend");
    const backendExecutable = process.platform === "win32" ? "backend.exe" : "backend";
    const backendPath = path.join(backendDir, backendExecutable);
    const logPath = path.join(app.getPath("userData"), "backend.log");

    if (!fs.existsSync(backendPath)) {
        console.error("Backend executable not found:", backendPath);
        return;
    }

    const logStream = fs.createWriteStream(logPath, { flags: "a" });

    try {
        backendProcess = spawn(backendPath, [], {
            cwd: backendDir,
            detached: false,
            windowsHide: true,
        });

        logStream.write(
            `[${new Date().toISOString()}] Backend started PID: ${backendProcess.pid}\n`
        );

        backendProcess.stdout?.on("data", (data) => {
            logStream.write(`[STDOUT] ${data}`);
        });

        backendProcess.stderr?.on("data", (data) => {
            logStream.write(`[STDERR] ${data}`);
        });

        backendProcess.on("exit", (code) => {
            logStream.write(
                `[${new Date().toISOString()}] Backend exited with code ${code}\n`
            );
            backendProcess = null;
        });
    } catch (err) {
        logStream.write(
            `[${new Date().toISOString()}] Backend spawn error: ${err.message}\n`
        );
    }
}

function stopBackend() {
    if (backendProcess && backendProcess.pid) {
        console.log("Force killing backend process...");

        if (process.platform === "win32") {
            // Windows safe kill
            exec(`taskkill /PID ${backendProcess.pid} /T /F`);
        } else {
            // Linux/macOS kill
            try {
                process.kill(backendProcess.pid, "SIGTERM");
            } catch (err) {
                console.error("Failed to kill backend process:", err);
            }
        }

        backendProcess = null;
    }
}

/* ================================
   WAIT FOR BACKEND READY
================================ */

function waitForBackend(retries = 30) {
    return new Promise((resolve, reject) => {
        const http = require("http");

        const attempt = () => {
            const req = http.get("http://127.0.0.1:5000", () => {
                resolve();
            });

            req.on("error", () => {
                if (retries <= 0) {
                    reject(new Error("Backend did not respond"));
                } else {
                    retries--;
                    setTimeout(attempt, 500);
                }
            });
        };

        attempt();
    });
}

/* ================================
   IPC CONTROLS
================================ */

ipcMain.on("close-app", () => {
    app.quit();
});

ipcMain.on("minimize-app", () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on("maximize-app", () => {
    if (!mainWindow) return;

    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on("open-external", (event, url) => {
    shell.openExternal(url);
});

/* ================================
   APP LIFECYCLE SAFETY
================================ */

app.on("before-quit", stopBackend);
app.on("will-quit", stopBackend);
app.on("quit", stopBackend);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
