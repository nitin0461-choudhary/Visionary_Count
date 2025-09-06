// // src/app.js
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:5173";


// // routers
// import userRouter from "./routes/user.routes.js";
// import videoRouter from "./routes/video.routes.js";
// //import featureHistoryRouter from "./routes/featureHistory.routes.js";
// import bboxRouter from "./routes/history.bbox.routes.js";
// import uniqueCountRouter from "./routes/history.uniqueCount.routes.js";
// import graphRouter from "./routes/history.graph.routes.js";
// const app = express();
// app.use(cors({
//   origin: FRONTEND,       // NOT "*"
//   credentials: true,      // must be true to allow cookies
// }));


// app.use(
//   express.json({
//     limit: "100mb", // 1000mb is excessive, 100mb is already huge
//   })
// );

// app.use(
//   express.urlencoded({
//     limit: "100mb",
//     extended: true,
//   })
// );

// app.use(express.static("public"));
// app.use(cookieParser());

// // register routes
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/videos", videoRouter);
// app.use("/api/v1/historyBbox",bboxRouter);
// app.use("/api/v1/historyUniqueCount",uniqueCountRouter);
// app.use("/api/v1/historyGraph",graphRouter);

// export { app };
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import bboxRouter from "./routes/history.bbox.routes.js";
import uniqueCountRouter from "./routes/history.uniqueCount.routes.js";
import graphRouter from "./routes/history.graph.routes.js";

const app = express();

app.use(cors({ origin: FRONTEND, credentials: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// register routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/historyBbox", bboxRouter);
app.use("/api/v1/historyUniqueCount", uniqueCountRouter);
app.use("/api/v1/historyGraph", graphRouter);

export { app };

