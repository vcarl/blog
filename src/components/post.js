import React from 'react';
import { graphql } from 'gatsby';

import { renderHtml } from '../helpers/renderHtml';

import CoverImage from '../basics/CoverImage';
import { Container } from '../basics/Layout';
import { TextLink } from '../basics/Text';

import SEO from './seo';
import Layout from './layout';

import '../components/syntax.css';
import OtherPostsInSeries from './OtherPostsInSeries';

const Post = ({ data }) => {
  const {
    htmlAst,
    id,
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
        {data.allMarkdownRemark && (
          <OtherPostsInSeries
            currentId={id}
            posts={data.allMarkdownRemark.edges.map(({ node }) => node)}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Post;

export const query = graphql`
  query($slug: String!, $series: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      htmlAst
      fileAbsolutePath
      frontmatter {
        title
        published
        description
        tags
        cover_image
        series
        canonical_url
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { series: { eq: $series } } }
      sort: { fields: frontmatter___date, order: ASC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            series
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
