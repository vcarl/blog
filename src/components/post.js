import React from 'react';
import { graphql } from 'gatsby';

import { renderHtml } from '../helpers/renderHtml';
import Layout from './layout';

const Post = ({ data }) => {
  const { htmlAst, frontmatter } = data.markdownRemark;
  return <Layout>{renderHtml(htmlAst, frontmatter)}</Layout>;
};

export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      frontmatter {
        title
        published
        series
        description
        tags
        cover_image
        canonical_url
      }
    }
  }
`;
