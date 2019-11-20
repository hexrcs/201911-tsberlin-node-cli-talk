import React from "react";
import styled from "styled-components";

const Mono = styled.div`
  padding: 2rem;
  ${props => (props.big ? "" : `font-size: 0.7em;`)};
`;

const Code = styled.code`
  color: white;
`;

export default ({ big = false, children }) => (
  <Mono big={big}>
    <Code>{children}</Code>
  </Mono>
);
