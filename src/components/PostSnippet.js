import React from 'react';
import styled from 'styled-components';

import { Link } from '../basics/Link';
import { Paragraph, Block, Subheading, Small } from '../basics/Text';

const PostTitleEl = styled(Subheading)`
  margin-bottom: 0;
`;
const PostDescription = styled(Paragraph)`
  margin-top: 0;
`;

const PostSnippet = ({ slug, title, date, ago, children }) => (
  <Block key={slug}>
    <PostTitleEl>
      <Link to={slug}>{title}</Link>
    </PostTitleEl>

    <PostDescription>
      <Small>
        {date}, {ago}
      </Small>
      <br />
      {children}
    </PostDescription>
  </Block>
);

export default PostSnippet;
