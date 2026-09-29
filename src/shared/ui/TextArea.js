import React from "react";

import Input from "./Input";

export default function TextArea({
  numberOfLines = 5,
  ...props
}) {
  return (
    <Input
      {...props}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      inputStyle={{
        minHeight: 120,
        paddingTop: 14,
      }}
    />
  );
}