import React from 'react';
import { graphql } from 'gatsby';

import { renderHtml } from '../helpers/renderHtml';

import CoverImage from '../basics/CoverImage';
import { Container } from '../basics/Layout';

import SEO from './seo';
import Layout from './layout';

import '../components/syntax.css';

const Post = ({ data }) => {
  const { htmlAst, frontmatter } = data.markdownRemark;
  return (
    <Layout title={frontmatter.title}>
      {frontmatter.cover_image && (
        <CoverImage src={frontmatter.cover_image} />
      )}
      <SEO
        image={frontmatter.cover_image}
        canonicalUrl={frontmatter.canonical_url}
        title={frontmatter.title}
        keywords={(frontmatter.tags || '')
          .split(',')
          .map(s => s.trim())}
      />
      <Container>{renderHtml(htmlAst, frontmatter)}</Container>
    </Layout>
  );
};

export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      frontmatter {
        title
        published
        description
        tags
        cover_image
        canonical_url
      }
    }
  }
`;
