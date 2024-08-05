import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CommentComposer from "./CommentComposer";
import { Api } from "../../api";

test("render the comment composer", () => {
  render(<CommentComposer onPostComment={() => {}} />);

  const composer = screen.getByTestId("comment_composer");
  expect(composer).toBeInTheDocument();
});

test("error should appear if username or message is empty", async () => {
  render(<CommentComposer onPostComment={() => {}} />);
  const postButton = screen.getByRole("button");

  const mockOnPostCommentFn = jest.fn();
  const user = userEvent.setup();

  await act(async () => {
    await user.click(postButton);
  });

  const usernameErrorSpan = screen.getByText(
    "Please enter a non-empty username.",
  );
  const messageErrorSpan = screen.getByText(
    "Please enter a non-empty message.",
  );
  expect(usernameErrorSpan).toBeInTheDocument();
  expect(messageErrorSpan).toBeInTheDocument();
  expect(mockOnPostCommentFn).not.toBeCalled();
});
test("api post call on click with no errors", async () => {
  const user = userEvent.setup();
  render(<CommentComposer onPostComment={() => {}} />);

  const testUsername = "testuser";
  const testMessage = "Lorem ipsum!";
  const usernameInput = screen.getByTestId("comment_name");
  const messageTextarea = screen.getByTestId("comment_text");

  await act(async () => {
    await user.type(usernameInput, testUsername);
    await user.type(messageTextarea, testMessage);
  });

  expect(usernameInput).toHaveValue(testUsername);
  expect(messageTextarea).toHaveValue(testMessage);

  const spyPost = jest.spyOn(Api, "post");
  await act(async () => {
    await user.click(screen.getByRole("button"));
  });
  expect(spyPost).toHaveBeenCalledTimes(1);
});
