import React from 'react';
import styled from 'styled-components';

import { Link } from '../basics/Link';
import {
  List,
  ListItem,
  Subheading,
  Heading,
  Small,
} from '../basics/Text';

const El = styled.div`
  margin-top: 1rem;
`;
const NavEl = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OtherPostsInSeries = ({ currentId, posts }) => {
  const currentIndex = posts.findIndex(({ id }) => currentId === id);
  const currentPost = posts[currentIndex];
  const nextPost = posts[currentIndex + 1];
  const previousPost = posts[currentIndex - 1];
  return (
    <El>
      <Heading>{currentPost.frontmatter.series}</Heading>
      <NavEl>
        {previousPost ? (
          <Link to={previousPost.fields.slug}>◀ Previous</Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link to={nextPost.fields.slug}>Next ▶</Link>
        ) : (
          <div />
        )}
      </NavEl>
      <Subheading>
        <Small>Other posts in this series</Small>
      </Subheading>
      <List>
        {posts.map(post => (
          <ListItem key={post.id}>
            {post.id === currentId ? (
              `${post.frontmatter.title} (this one)`
            ) : (
              <Link to={post.fields.slug}>
                {post.frontmatter.title}
              </Link>
            )}
          </ListItem>
        ))}
      </List>
    </El>
  );
};

export default OtherPostsInSeries;
