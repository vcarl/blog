import React from 'react';
import styled from 'styled-components';

import { Container } from '../basics/Layout';
import {
  Image,
  InlineCode,
  Paragraph,
  Subheading,
  TextLink,
  Title,
} from '../basics/Text';

import Layout from '../components/layout';

import profilePhoto from '../images/vcarl.jpg';

const ImageEl = styled(Image)`
  max-width: 20rem;
  float: right;
  margin-right: -5rem;

  @media (max-width: 50rem) {
    max-width: 100%;
    width: 15rem;
    float: unset;
    margin-right: auto;
  }
`;

export default () => (
  <Layout>
    <Container>
      <ImageEl src={profilePhoto} />
      <Title>About</Title>
      <Paragraph>
        I’m Carl Vitullo. My handle is <InlineCode>vcarl</InlineCode> on
        most services.
      </Paragraph>
      <Subheading>Me</Subheading>
      <Paragraph>
        I’m a software developer mostly doing frontend Javascript with
        React. In the distant past, I did fullstack development, but
        database migrations and ops aren’t my jam. I’m one of the lead
        moderators of{' '}
        <TextLink href="https://www.reactiflux.com/">
          Reactiflux
        </TextLink>
        , the largest chat community of React developers, which mostly
        involves helping people and preventing things from getting
        weird. I also started{' '}
        <TextLink href="https://discord.gg/vUsrbjd">Nodeiflux</TextLink>
        , a “sister server” focused on node.js.
      </Paragraph>
      <Paragraph>
        I consider myself to have an uncommon patience and ability to
        approach (others’) problems objectively. It’s a skill that drew
        me to Reactiflux, and one that I’ve practiced extensively while
        moderating. I also wrote the{' '}
        <TextLink href="https://www.reactiflux.com/tips/">
          tips
        </TextLink>{' '}
        on how to use Reactiflux, as well as the{' '}
        <TextLink href="https://www.reactiflux.com/guidelines/">
          Community Guidelines
        </TextLink>
        , with feedback from other moderators.
      </Paragraph>
      <Paragraph>
        I build web apps, specializing with React. I take a minimalist
        approach to it, prefering to solve most problems myself rather
        than pull in too many libraries. I find React to be expressive
        enough on its own to let me solve problems quickly, but there
        are a few libraries that I reach for frequently. In particular,{' '}
        <InlineCode>formik</InlineCode> is a marvelous abstraction over
        forms, <InlineCode>react-flip-move</InlineCode> is an incredibly
        simple way to animate simple list transitions, and{' '}
        <InlineCode>react-motion</InlineCode> is a great way to add
        physically-based transitions for arbitrary values.
      </Paragraph>
      <Paragraph>
        I’m currently working for the Stellar Development Foundation,
        making tools so that building on Stellar is easier to approach.
        My most recent project before this was{' '}
        <TextLink href="https://www.stellarx.com/markets">
          StellarX
        </TextLink>
        , a trading platform for the exchange built into the Stellar
        protocol.
      </Paragraph>
    </Container>
  </Layout>
);
