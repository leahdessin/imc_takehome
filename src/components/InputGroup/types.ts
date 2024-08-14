import React from "react";

export type InputProps = React.ComponentProps<"input"> & {
  error?: string;
  isTextarea: false;
};

export type TextAreaProps = React.ComponentProps<"textarea"> & {
  error?: string;
  isTextarea: true;
};

export type InputGroupProps = InputProps | TextAreaProps;
