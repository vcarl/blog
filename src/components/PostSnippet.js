import React from 'react';
import styled from 'styled-components';

import { Link } from '../basics/Link';
import { Paragraph, Block, Heading, Small } from '../basics/Text';

const PostTitleEl = styled(Heading)`
  margin-bottom: 0;
`;
const PostDescription = styled(Paragraph)`
  margin-top: 0;
`;

const PostSnippet = ({ slug, title, date, ago, description }) => (
  <Block key={slug}>
    <PostTitleEl>
      <Link to={slug}>{title}</Link>
    </PostTitleEl>

    <PostDescription>
      <Small>
        {date}, {ago}
      </Small>
      <br />
      {description}
    </PostDescription>
  </Block>
);

export default PostSnippet;
