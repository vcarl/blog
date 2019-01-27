import React from 'react';

import { Container } from '../basics/Layout';
import { InlineCode, Paragraph, TextLink, Title } from '../basics/Text';

import Layout from '../components/layout';
import SEO from '../components/seo';

export default () => (
  <Layout>
    <Container>
      <SEO title="About" />
      <Title>Motivations</Title>
      <Paragraph>
        I’ve been publishing posts on{' '}
        <TextLink href="https://medium.com/@vcarl">Medium</TextLink> and{' '}
        <TextLink href="https://dev.to/vcarl">dev.to</TextLink> for a
        while now. They’re both great platforms, and I intend to
        continue using them. They both have a particular audience baked
        in, though, and I have some posts on my mind that I’m not sure I
        want to promote through those channels.
      </Paragraph>
      <Paragraph>
        I’m also a web developer! I should have a website! Here it is, I
        made this. It's very minimal. You can{' '}
        <TextLink href="https://github.com/vcarl/blog">
          look at the source
        </TextLink>
        , too. It uses Gatsby with{' '}
        <InlineCode>styled-components</InlineCode>, and I went{' '}
        <TextLink href="https://github.com/vcarl/blog/blob/master/src/helpers/renderHtml.js">
          way overboard on rendering the markdown
        </TextLink>
        .
      </Paragraph>
    </Container>
  </Layout>
);
