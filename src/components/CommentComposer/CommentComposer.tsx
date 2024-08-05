import React, { useRef, useState } from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";

import { IComposedComment } from "./types";
import { Api } from "../../api";

const CommentComposerContainer = styled.form`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-around;
`;

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

const PostButton = styled.button`
  padding: 10px 30px;
  background-color: #ed89ff;
  color: #000;
  font-size: 16px;
  font-weight: bold;
  font-family: Roboto, sans-serif;
  border: 2px solid #ed89ff;
  border-radius: 9999px;
  margin: 0 0 30px 0;

  &:hover {
    cursor: pointer;
    background-color: #e762ff;
    border-color: #e762ff;
  }
  &:focus {
    border: 2px solid lime;
    outline: 1px solid lime;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const fadeOutAnimation = keyframes`
  0% {opacity: 1}
  50% {opacity: 1}
  100% {opacity: 0}
`;
const PostToast = styled.span`
  color: #ed89ff;
  font-weight: bold;
  width: 300px;
  font-size: 14px;
  position: absolute;
  margin-left: 500px;
  margin-top: 14px;
  animation-name: ${fadeOutAnimation};
  animation-duration: 5s;
  animation-iteration-count: 1;
  opacity: 0;
`;

const CollapseButton = styled.span`
  color: #ed89ff;
  font-weight: bold;
  font-size: 12px;
  display: none;
  padding-bottom: 10px;

  &:hover {
    cursor: pointer;
    color: #e762ff;
  }
  &:focus {
    border: 2px solid lime;
    outline: 1px solid lime;
  }

  @media (max-width: 600px) {
    display: inline-block;
  }
`;

const CollapsibleSection = styled.div<{ $collapsed?: boolean }>`
  display: ${(props) => (props.$collapsed ? "none" : "flex")};
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
`;

function validateComment(state: IComposedComment) {
  return (
    state.username &&
    state.message &&
    !state.usernameError &&
    !state.messageError
  );
}

export default function CommentComposer(props: { onPostComment: () => void }) {
  const [currentComment, setCurrentComment] = useState<IComposedComment>({
    username: "",
    message: "",
    usernameError: "",
    messageError: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  function blinkToast() {
    if (!showToast) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }

  function postComment() {
    setShowToast(false);
    if (validateComment(currentComment)) {
      Api.post("/createComment", {
        name: currentComment.username,
        message: currentComment.message,
      })
        .then((response) => {
          setToastText("Comment added!");
          blinkToast();
          setCurrentComment({
            username: "",
            message: "",
            usernameError: "",
            messageError: "",
          });
          props.onPostComment();
          inputRef.current.focus();
        })
        .catch((error) => {
          setToastText("Could not post comment. Try again.");
          blinkToast();
          console.log("error:", error);
        });
    } else {
      setCurrentComment((prevState) => {
        return {
          ...prevState,
          usernameError: "Please enter a non-empty username.",
          messageError: "Please enter a non-empty message.",
        };
      });
    }
  }

  function handleUsernameUpdate(event: any) {
    setCurrentComment((prevState) => {
      return {
        ...prevState,
        username: event.target.value,
        usernameError: event.target.value
          ? ""
          : "Please enter a non-empty username.",
      };
    });
  }
  function handleMessageUpdate(event: any) {
    setCurrentComment((prevState) => {
      return {
        ...prevState,
        message: event.target.value,
        messageError: event.target.value
          ? ""
          : "Please enter a non-empty message.",
      };
    });
  }

  function handleCollapseExpand() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <CommentComposerContainer
      data-testid="comment_composer"
      onSubmit={(e) => {
        e.preventDefault();
        validateComment(currentComment);
      }}
    >
      <CollapsibleSection $collapsed={isCollapsed}>
        <label htmlFor="username_input">Enter your username</label>
        <UsernameInput
          ref={inputRef}
          data-testid="comment_name"
          id="username_input"
          type="text"
          aria-required="true"
          aria-describedby="username_error"
          onBlur={() => validateComment(currentComment)}
          onChange={handleUsernameUpdate}
          value={currentComment.username}
          $hasError={Boolean(currentComment.usernameError)}
        />
        <ErrorNote id="username_error">
          {currentComment.usernameError}
        </ErrorNote>
        <label htmlFor="message_input">Enter a message</label>
        <CommentTextarea
          data-testid="comment_text"
          id="message_input"
          aria-required="true"
          aria-describedby="message_error"
          onBlur={() => validateComment(currentComment)}
          onChange={handleMessageUpdate}
          value={currentComment.message}
          $hasError={Boolean(currentComment.messageError)}
        />
        <ErrorNote id="message_error">{currentComment.messageError}</ErrorNote>
        <ButtonContainer>
          <PostButton data-testid="post_comment_button" onClick={postComment}>
            Post Comment
          </PostButton>
          {showToast && <PostToast id="post_toast">{toastText}</PostToast>}
        </ButtonContainer>
      </CollapsibleSection>
      <CollapseButton onClick={handleCollapseExpand}>
        {isCollapsed ? "Expand" : "Collapse"}
      </CollapseButton>
    </CommentComposerContainer>
  );
}
