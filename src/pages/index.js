import React from 'react';
import styled from 'styled-components';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageNav from '../components/PageNav';
import PostSnippet from '../components/PostSnippet';
import PostSeries from '../components/PostSeries';

import { Container } from '../basics/Layout';
import { Paragraph, Title, Heading, Small } from '../basics/Text';

const SiteTitle = styled(Title)`
  font-size: 1.8em;
`;

const dateComparator = (a, b) => new Date(b.date) - new Date(a.date);

const IndexPage = ({ data }) => {
  const { title, description } = data.site.siteMetadata;

  const allPosts = data.allMarkdownRemark.edges.map(({ node }) => {
    const { frontmatter, fields, ...rest } = node;
    return {
      ...rest,
      ...fields,
      ...frontmatter,
      type: 'post',
    };
  });

  // There are 2 categories here: Posts and Series.
  // Posts are standalone blog entries, while series are related stories that
  // should be presented together.
  const posts = allPosts.filter(p => !p.series);

  const postsBySeries = allPosts
    .filter(p => p.series)
    .reduce((accum, post) => {
      let series = accum[post.series] || [];
      accum[post.series] = [...series, post];
      return accum;
    }, {});

  const series = Object.entries(postsBySeries).map(([title, posts]) => {
    posts = posts.sort(dateComparator);
    const date = posts[0].date;
    return {
      title,
      date,
      // Reverse posts to show from first published to last published
      posts: posts.reverse(),
      type: 'series',
    };
  });

  const allEntries = [...posts, ...series].sort(dateComparator);

  return (
    <Layout title={title}>
      <Container>
        <SEO
          title="Home"
          keywords={[`gatsby`, `application`, `react`]}
        />

        <SiteTitle>{title}</SiteTitle>
        <Small>
          <Heading>Carl Vitullo</Heading>
        </Small>
        <Paragraph>{description}</Paragraph>
        <PageNav />
        {allEntries.sort(dateComparator).map(entry => {
          switch (entry.type) {
            case 'post':
              return (
                <PostSnippet key={entry.slug} {...entry}>
                  {entry.description}
                </PostSnippet>
              );
            case 'series':
              return <PostSeries key={entry.title} {...entry} />;
            default:
              throw new Error(
                `Got a weird entry type! '${
                  entry.type
                }', ${JSON.stringify(entry)}`,
              );
          }
        })}
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
    allMarkdownRemark(
      filter: { frontmatter: { published: { ne: false } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            series
            date(formatString: "YYYY-MM-DD")
            ago: date(fromNow: true)
          }
          timeToRead
        }
      }
    }
  }
`;
