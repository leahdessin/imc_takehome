import React from "react";
import styled from "styled-components";

const UsernameInput = styled.input<{ $hasError?: boolean }>`
  width: 30vw;
  min-width: 180px;
  padding: 5px 8px;
  border-radius: 9999px;
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => (props.$hasError ? "#fe804d" : "black")};
  outline: ${(props) => (props.$hasError ? "1px solid #fe804d" : "none")};

  &:focus {
    outline: 1px solid lime;
    border-color: lime;
  }
`;

const CommentTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 30vw;
  min-width: 280px;
  height: 10vh;
  padding: 5px;
  border-radius: 10px;
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => (props.$hasError ? "#fe804d" : "black")};
  outline: ${(props) => (props.$hasError ? "1px solid #fe804d" : "none")};

  &:focus {
    outline: 1px solid lime;
    border-color: lime;
  }
`;

const ErrorNote = styled.span`
  font-weight: bold;
  color: #fe804d;
  font-size: 12px;
  height: 12px;
  margin: 3px 0 10px;
`;

export default function InputGroup(props: any) {
  return (
    <>
      <label htmlFor={props.name + "_input"}>Enter your {props.name}</label>
      {props.name === "message" ? (
        <CommentTextarea
          data-testid={"comment_" + props.name}
          aria-required="true"
          aria-describedby={props.name + "_error"}
          $hasError={Boolean(props.error)}
          {...props}
        />
      ) : (
        <UsernameInput
          data-testid={"comment_" + props.name}
          aria-required="true"
          aria-describedby={props.name + "_error"}
          $hasError={Boolean(props.error)}
          {...props}
        />
      )}
      <ErrorNote id={props.name + "_error"}>{props.error}</ErrorNote>
    </>
  );
}
