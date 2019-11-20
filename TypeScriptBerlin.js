import React from "react";
import styled from "styled-components";

const Span = styled.span`
  background-color: #096cc2;
  font-family: "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono",
    monospace;
  font-weight: bold;
  color: white;
`;

const Red = styled.span`
  background-color: white;
  color: red;
`;

export default () => (
  <Span>
    TypeScript<Red>Berlin</Red>
  </Span>
);
