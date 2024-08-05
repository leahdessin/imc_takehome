import React from "react";

export interface IComment {
  id: number;
  name: string;
  created: Date;
  message: string;
  children?: React.ReactNode | React.ReactNode[];
}
