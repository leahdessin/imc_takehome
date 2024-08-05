import React from "react";
import { render, screen } from "@testing-library/react";
import Comment from "./Comment";
import { IComment } from "./types";

const mockComment: IComment = {
  id: 100,
  name: "testuser",
  message: "test message",
  created: new Date(),
};

const mockComment2: IComment = {
  id: 200,
  name: "anothertestuser",
  message: "another test message",
  created: new Date("2024-08-01 18:00:00"),
};

test("renders a comment", () => {
  render(<Comment {...mockComment} />);
  const commentComponent: HTMLElement = screen.getByTestId(
    `comment_${mockComment.id}`,
  );
  expect(commentComponent).toBeInTheDocument();

  const commentUsername: HTMLElement = screen.getByText(mockComment.name);
  expect(commentUsername).toBeInTheDocument();

  const commentMessage: HTMLElement = screen.getByText(mockComment.message);
  expect(commentMessage).toBeInTheDocument();
});

test("formats comment date correctly", () => {
  render(<Comment {...mockComment2} />);
  const dateParagraph = screen.getByText("6 PM", { exact: false });
  expect(dateParagraph).toBeInTheDocument();
});
