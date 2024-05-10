import initApp from "./app";
import http from 'http';
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

initApp().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Wise Buyer - REST API",
        version: "1.0.1",
        description: "REST server including authentication using JWT and refresh token",
      },
      servers: [{ url: `http://localhost:${process.env.HTTPS_PORT}`, },],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  http.createServer(app).listen(process.env.PORT, () => {
    console.log(`Server running in development mode on http://localhost:${process.env.PORT}`);
  });
});
