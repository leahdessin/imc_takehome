import React, { useCallback, useEffect, useRef, useState } from "react";
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

const LoadingNotice = styled.div`
  color: #ed89ff;
  font-size: 14px;
  height: 20px;
  vertical-align: middle;
`;

function App() {
  console.log("rendering App");
  const [comments, setComments] = useState<IComment[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pollingEnabled, setPollingEnabled] = useState<boolean>(true);

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

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
        setPollingEnabled(false);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  }, []);

  const handleClearComments = useCallback(() => {
    Api.delete("/deleteComments")
      .then(() => {
        setError("");
        setComments([]);
        setIsLoading(false);
        setPollingEnabled(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (pollingEnabled) {
      intervalRef.current = setInterval(fetchComments, 5000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  return (
    <AppWrapper data-testid="app_wrapper">
      <header>
        <h1>Join the conversation</h1>
        <CommentComposer onPostComment={fetchComments} />
      </header>
      <main tabIndex={-1}>
        <LoadingNotice>{isLoading && "Fetching..."}</LoadingNotice>
        <CommentFeed comments={comments} error={error} />
      </main>
      <footer>
        <button onClick={handleClearComments}>Clear All Comments</button>
      </footer>
    </AppWrapper>
  );
}

export default App;
