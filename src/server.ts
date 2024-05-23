import initApp from "./app";
import http from 'http';
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import path from 'path';

initApp().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "TicketMate",
        version: "1.0.0",
        description: "REST server including authentication using JWT and refresh token",
      },
      servers: [{ url: `http://localhost:${process.env.PORT}` }],
    },
    apis: [
      path.join(__dirname, './routes/*.ts'),
      path.join(__dirname, './swagger/*.ts')
    ], // Adjust paths to your routes and swagger files
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  http.createServer(app).listen(process.env.PORT, () => {
    console.log(`Server running in development mode on http://localhost:${process.env.PORT}`);
  });
});
