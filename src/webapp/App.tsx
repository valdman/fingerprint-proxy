import React from 'react';

export type Props = { text: string };

export function App(props: Props){
  const { text } = props;
  return (<div style={{ color: "red" }}>Hello {text}</div>);
}
