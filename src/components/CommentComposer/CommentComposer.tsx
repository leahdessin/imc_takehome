import React, { ChangeEvent, memo, useRef, useState } from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";

import { IComposedComment } from "./types";
import InputGroup from "../InputGroup/InputGroup";
import { Api } from "../../api";

const CommentComposerContainer = styled.form`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-around;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
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

const CollapseButton = styled.span<{ $collapsed?: boolean }>`
  color: #ed89ff;
  font-weight: bold;
  font-size: 12px;
  display: none;
  position: relative;
  bottom: 8px;
  padding: 0px 10px;
  background-color: ${(props) => (props.$collapsed ? "#330367" : "#24113f")};

  &:hover {
    cursor: pointer;
    color: #e762ff;
  }
  &:focus {
    border: 2px solid lime;
    outline: 1px solid lime;
  }

  @media (max-height: 700px) {
    display: inline-block;
  }
`;

const CollapsibleSection = styled.div<{ $collapsed?: boolean }>`
  display: ${(props) => (props.$collapsed ? "none" : "flex")};
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 10px 30px;

  @media (max-height: 700px) {
    border: 2px solid #ed89ff;
  }
`;

function validateComment(state: IComposedComment) {
  return (
    state.username &&
    state.message &&
    !state.usernameError &&
    !state.messageError
  );
}

const CommentComposer = memo(function CommentComposer(props: {
  onCommentCreated: () => void;
}) {
  const [currentComment, setCurrentComment] = useState<IComposedComment>({
    username: "",
    message: "",
    usernameError: "",
    messageError: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          props.onCommentCreated();
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

  function handleUsernameUpdate(event: ChangeEvent) {
    const element = event.currentTarget as HTMLInputElement;
    setCurrentComment((prevState) => {
      return {
        ...prevState,
        username: element.value,
        usernameError: element.value
          ? ""
          : "Please enter a non-empty username.",
      };
    });
  }
  function handleMessageUpdate(event: ChangeEvent) {
    const element = event.currentTarget as HTMLInputElement;
    setCurrentComment((prevState) => {
      return {
        ...prevState,
        message: element.value,
        messageError: element.value ? "" : "Please enter a non-empty message.",
      };
    });
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
        <InputGroup
          name={"username"}
          value={currentComment.username}
          error={currentComment.usernameError}
          onBlur={() => validateComment(currentComment)}
          onChange={handleUsernameUpdate}
        />
        <InputGroup
          name={"message"}
          value={currentComment.message}
          error={currentComment.messageError}
          onBlur={() => validateComment(currentComment)}
          onChange={handleMessageUpdate}
        />
        <ButtonContainer>
          <PostButton data-testid="post_comment_button" onClick={postComment}>
            Post Comment
          </PostButton>
          {showToast && <PostToast id="post_toast">{toastText}</PostToast>}
        </ButtonContainer>
      </CollapsibleSection>
      <CollapseButton
        onClick={() => setIsCollapsed(!isCollapsed)}
        $collapsed={isCollapsed}
      >
        {isCollapsed ? "Expand" : "Collapse"}
      </CollapseButton>
    </CommentComposerContainer>
  );
});

export default CommentComposer;
