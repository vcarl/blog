import React from 'react';
import { graphql } from 'gatsby';

import { renderHtml } from '../helpers/renderHtml';

import CoverImage from '../basics/CoverImage';
import { Container } from '../basics/Layout';

import SEO from './seo';
import Layout from './layout';

import '../components/syntax.css';
import { TextLink } from '../basics/Text';

const Post = ({ data }) => {
  const {
    htmlAst,
    fileAbsolutePath,
    frontmatter,
  } = data.markdownRemark;
  const path = fileAbsolutePath.split('src/')[1];
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
      <Container>
        <TextLink
          href={`https://github.com/vcarl/blog/edit/master/src/${path}`}
        >
          Edit on GitHub
        </TextLink>
      </Container>
    </Layout>
  );
};

export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      fileAbsolutePath
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
