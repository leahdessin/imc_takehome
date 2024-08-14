import React, { act } from "react";
import { render, screen } from "@testing-library/react";

import InputGroup from "./InputGroup";

test("renders a username input", () => {
  render(<InputGroup isTextarea={false} name={"username"} />);
  const comment = screen.getByTestId("comment_username");
  expect(comment).toBeInTheDocument();
});
test("renders a message input", () => {
  render(<InputGroup isTextarea={true} name={"message"} />);
  const comment = screen.getByTestId("comment_message");
  expect(comment).toBeInTheDocument();
});
test("renders an error when provided", () => {
  const errorText = "error text";
  render(<InputGroup isTextarea={false} name={"message"} error={errorText} />);
  const error = screen.getByText(errorText);
  expect(error).toBeInTheDocument();
});
