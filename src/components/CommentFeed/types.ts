import { IComment } from "../Comment/types";

export interface ICommentFeed {
  comments: IComment[];
  error: string;
  loading: Boolean;
}
