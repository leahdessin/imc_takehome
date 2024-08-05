import React, { useCallback, useEffect, useState } from "react";
import "typeface-roboto";
import "./App.css";
import styled from "styled-components";

import CommentComposer from "./components/CommentComposer/CommentComposer";
import CommentFeed from "./components/CommentFeed/CommentFeed";
import { Api } from "./api";
import { IComment } from "./components/Comment/types";

const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  color: #eee;
  font-family: Roboto, sans-serif;
`;

function App() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = useCallback(() => {
    setIsLoading(true);
    Api.get("/getComments")
      .then((response) => {
        // reverse comments before saving
        const newComments = [...response].reverse();
        setComments(newComments);
        setError("");
      })
      .catch((error) => {
        setError("Error fetching data from source. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  function handleClearComments() {
    Api.delete("/deleteComments")
      .then(() => {
        setError("");
        setComments([]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <AppWrapper data-testid="app_wrapper">
      <header>
        <h1>Join the conversation</h1>
        <CommentComposer onPostComment={fetchComments} />
      </header>
      <main tabIndex={-1}>
        <CommentFeed comments={comments} error={error} loading={isLoading} />
      </main>
      <footer>
        <button onClick={handleClearComments}>Clear All Comments</button>
      </footer>
    </AppWrapper>
  );
}

export default App;
