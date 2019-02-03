import React from 'react';
import styled from 'styled-components';

import { Small, Heading } from '../basics/Text';
import PostSnippet from './PostSnippet';

const El = styled.div``;

const RelatedPosts = ({ allPosts, currentTags }) => {
  const relatedPosts = allPosts
    .map(post => {
      if (!post.tags) {
        return undefined;
      }
      const matchingTag = post.tags
        .split(', ')
        .find(tag =>
          currentTags.find(currentTag => currentTag === tag),
        );
      if (!matchingTag) {
        return undefined;
      }
      return {
        post,
        matchingTag,
      };
    })
    .filter(Boolean);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <El>
      <Heading>Related Posts</Heading>
      {relatedPosts.map(({ post, matchingTag }) => (
        <PostSnippet key={post.slug} {...post}>
          {post.description} <Small>{matchingTag}</Small>
        </PostSnippet>
      ))}
    </El>
  );
};

export default RelatedPosts;
