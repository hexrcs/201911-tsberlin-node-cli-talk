import React from "react";
import styled from "styled-components";

const Small = styled.span`
  font-size: 0.7em;
`;

export default ({ children }) => <Small>{children}</Small>;
