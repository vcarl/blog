import React from 'react';
import styled from 'styled-components';

import { Block, Title, Small } from '../basics/Text';

import PostSnippet from './PostSnippet';

const PostTitleEl = styled(Title)`
  margin-bottom: 0;
`;
const PostListEl = styled(Block)`
  margin-left: 1rem;
`;

const PostSeries = ({ title, posts }) => (
  <Block key={title}>
    <PostTitleEl>
      {title} <Small>{posts.length} posts</Small>
    </PostTitleEl>

    <PostListEl>
      {posts.map(post => (
        <PostSnippet
          key={post.fields.slug}
          slug={post.fields.slug}
          {...post.frontmatter}
        />
      ))}
    </PostListEl>
  </Block>
);

export default PostSeries;
