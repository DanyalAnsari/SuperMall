import React from "react";
import { useRoutes } from "react-router";
import routes from "./config/routes";

export default function App() {
  const routing = useRoutes(routes);
  return <div>{routing}</div>;
}
