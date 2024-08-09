import styled from "styled-components";

import Comment from "../Comment/Comment";
import { ICommentFeed } from "./types";

const CommentFeedWrapper = styled.section`
  display: flex;
  flex-flow: column;
  align-items: center;
  flex: 1;
  overflow: scroll;
  overscroll-behavior: contain;
`;

export default function CommentFeed(props: ICommentFeed) {
  return (
    <CommentFeedWrapper tabIndex={-1}>
      {!props.error ? (
        props.comments.map((comment) => {
          return <Comment key={comment.id} {...comment} />;
        })
      ) : (
        <p>{props.error}</p>
      )}
    </CommentFeedWrapper>
  );
}
