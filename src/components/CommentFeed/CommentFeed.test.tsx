import React from "react";
import { cleanup, render, screen } from "@testing-library/react";

import CommentFeed from "./CommentFeed";
import { IComment } from "../Comment/types";

const mockComments: IComment[] = [
  {
    id: 1,
    name: "test",
    message: "mocked message",
    created: new Date("2024-07-09 18:00:00"),
  },
  {
    id: 2,
    name: "anothertest",
    message: "mocked message",
    created: new Date("2024-07-09 19:00:00"),
  },
  {
    id: 3,
    name: "yetanothertest",
    message: "mocked message",
    created: new Date("2024-07-09 21:00:00"),
  },
];

test("renders a comment feed", () => {
  render(<CommentFeed comments={mockComments} error={""} loading={false} />);
  const comments = screen.getAllByText(mockComments[0].message);
  expect(comments.length).toEqual(3);
});
test("renders an error when provided", () => {
  const errorText = "error text";
  render(
    <CommentFeed comments={mockComments} error={errorText} loading={false} />,
  );
  const error = screen.getByText(errorText);
  expect(error).toBeInTheDocument();
});

test("renders loading message", () => {
  render(<CommentFeed comments={[]} error={""} loading={true} />);
  const loadingMessage = screen.getByText("Fetching comments...");
  expect(loadingMessage).toBeInTheDocument();
});
