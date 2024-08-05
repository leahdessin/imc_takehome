import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { Api } from "./api";

test("renders learn react link", () => {
  render(<App />);
  const appWrapper = screen.getByTestId("app_wrapper");
  expect(appWrapper).toBeInTheDocument();
});

test("should fetch comments on render", () => {
  const spyFetch = jest.spyOn(Api, "get");
  render(<App />);
  expect(spyFetch).toHaveBeenCalledTimes(1);
});
