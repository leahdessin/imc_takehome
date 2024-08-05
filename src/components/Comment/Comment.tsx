import React from "react";
import styled from "styled-components";
import { IComment } from "./types";

const CommentContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  width: 60vw;
  background-color: #e1e7eb;
  border: 2px solid #e1e7eb;
  border-radius: 10px;
  padding: 0 20px;
  margin-bottom: 8px;
  text-align: left;
  color: #000;

  &:hover {
    background-color: #c1c6ca;
    border-color: #c1c6ca;
  }
  &:focus {
    background-color: #c1c6ca;
    border-color: #c1c6ca;
    border: 2px solid lime;
    outline: 1px solid lime;
  }
`;

function formatDate(dateParam: Date): string {
  const postDate = new Date(dateParam); // have to do this because of how primitives work with interfaces
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - postDate.getTime();
  const daysApart = Math.round(timeDifference / (1000 * 3600 * 24));

  let dayString = "";
  if (daysApart === 0) {
    dayString = "today";
  } else if (daysApart === 1) {
    dayString = "yesterday";
  } else if (daysApart < 7) {
    dayString = "on " + postDate.toLocaleString("en", { weekday: "long" });
  } else {
    dayString =
      "on " +
      postDate.toLocaleDateString("en", {
        month: "long",
        day: "numeric",
      });
  }
  const postDateHours = postDate.getHours();

  let timeString = postDateHours === 0 ? `12 AM` : `${postDateHours} AM`;
  if (postDate.getHours() > 12) {
    timeString = `${postDate.getHours() - 12} PM`;
  }
  return dayString + " at " + timeString;
}
export default function Comment(props: IComment) {
  return (
    <CommentContainer data-testid={`comment_${props.id}`} tabIndex={0}>
      <p>{props.message}</p>
      <p>
        Posted by <b>{props.name || "unknown user"}</b>{" "}
        {formatDate(props.created)}
      </p>
    </CommentContainer>
  );
}
