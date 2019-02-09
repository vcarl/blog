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
import RelatedPosts from './RelatedPosts';

const Post = ({ data }) => {
  const {
    htmlAst,
    id,
    fileAbsolutePath,
    frontmatter,
    fields,
  } = data.post;
  const path = fileAbsolutePath.split('src/')[1];
  const allPosts = data.allPosts.edges.map(({ node }) => ({
    ...node.fields,
    ...node.frontmatter,
    timeToRead: node.timeToRead,
  }));
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
      <Container>
        {renderHtml(htmlAst, { ...frontmatter, ...fields })}
      </Container>
      <Container>
        <TextLink
          href={`https://github.com/vcarl/blog/edit/master/src/${path}`}
        >
          Edit on GitHub
        </TextLink>
        {data.postsInSeries && (
          <OtherPostsInSeries
            currentId={id}
            posts={data.postsInSeries.edges.map(({ node }) => node)}
          />
        )}
        {allPosts.length > 0 && (
          <RelatedPosts
            allPosts={allPosts}
            currentTags={(frontmatter.tags || '').split(', ')}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Post;

export const query = graphql`
  query($slug: String!, $series: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      htmlAst
      fileAbsolutePath
      frontmatter {
        title
        published
        description
        date(formatString: "YYYY-MM-DD")
        tags
        cover_image
        series
        canonical_url
      }
    }
    postsInSeries: allMarkdownRemark(
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
    allPosts: allMarkdownRemark(
      filter: {
        frontmatter: { series: { ne: $series } }
        fields: { slug: { ne: $slug } }
      }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 10
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            tags
            description
            date(formatString: "YYYY-MM-DD")
            ago: date(fromNow: true)
          }
          timeToRead
        }
      }
    }
  }
`;
