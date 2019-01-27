import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageNav from '../components/PageNav';
import PostSnippet from '../components/PostSnippet';
import PostSeries from '../components/PostSeries';

import { Container } from '../basics/Layout';
import { Paragraph } from '../basics/Text';

const dateComparator = (a, b) => new Date(b.date) - new Date(a.date);

const IndexPage = ({ data }) => {
  const { title, description } = data.site.siteMetadata;

  const allPosts = data.allMarkdownRemark.edges.map(({ node }) => ({
    ...node,
    date: node.frontmatter.date,
    type: 'post',
  }));

  // There are 2 categories here: Posts and Series.
  // Posts are standalone blog entries, while series are related stories that
  // should be presented together.
  const posts = allPosts.filter(p => !p.frontmatter.series);

  // Group stories. This gets kinda icky, but it transforms a list of posts
  // through a couple steps. Group posts by series name, then map it to an array
  // of series (pulling the date off the most recent post). It would probably be
  // a little cleaner with lodash, `.pick` and `.groupBy` would help.
  const series = Object.entries(
    allPosts
      .filter(p => p.frontmatter.series)
      .reduce((accum, post) => {
        let series = accum[post.frontmatter.series];
        if (series) {
          series.push(post);
        } else {
          series = [post];
        }
        accum[post.frontmatter.series] = series;
        return accum;
      }, {}),
  ).map(([title, posts]) => {
    posts = posts.sort(dateComparator);
    const date = posts[0].frontmatter.date;
    return {
      title,
      date,
      // Reverse posts to show from first published to last published
      posts: posts.reverse(),
      type: 'series',
    };
  });

  const allEntries = [...posts, ...series].sort(dateComparator);
  window.allEntries = allEntries;

  return (
    <Layout title={title}>
      <Container>
        <SEO
          title="Home"
          keywords={[`gatsby`, `application`, `react`]}
        />

        <Paragraph>{description}</Paragraph>
        <PageNav />
        {allEntries.sort(dateComparator).map(entry => {
          switch (entry.type) {
            case 'post':
              return (
                <PostSnippet
                  key={entry.fields.slug}
                  slug={entry.fields.slug}
                  {...entry.frontmatter}
                />
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
            series
            date(formatString: "YYYY-MM-DD")
            ago: date(fromNow: true)
          }
        }
      }
    }
  }
`;
