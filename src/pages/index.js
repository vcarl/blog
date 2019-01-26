import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { Container } from '../basics/Layout';
import { Link } from '../basics/Link';
import { Paragraph, Block, Heading } from '../basics/Text';

const IndexPage = ({ data }) => {
  const { title, description } = data.site.siteMetadata;
  return (
    <Layout title={title}>
      <Container>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        <Paragraph>{description}</Paragraph>
        <Paragraph>Posts:</Paragraph>
        {data.allMarkdownRemark.edges
          .map(({ node }) => node)
          .filter(({ frontmatter }) => frontmatter.published)
          .map(({ fields, frontmatter }) => (
            <Block>
              <Heading>
                <Link to={fields.slug}>{frontmatter.title}</Link>
              </Heading>
              <Paragraph>{frontmatter.description}</Paragraph>
            </Block>
          ))}
      </Container>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            published
            title
            description
          }
        }
      }
    }
  }
`;
