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
import caen from '../images/caen.jpg';

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
        I took my first programming class at 12, through a summer camp
        put on by the University of Michigan. I was one of the youngest,
        and they ended up putting me on the website for the next year. I
        attended 3 years as a camper and 2 more as a junior counselor,
        learning (and later, teaching) how to use C++ and do 3d
        animation. I spent years learning how to write code on my own,
        competing in programming competitions through my freshman year
        at Michigan Tech.
      </Paragraph>
      <Image src={caen} />
      <Subheading>Work</Subheading>
      <Paragraph>
        I’ve worked at a series of startups. In 2012, I was “founding
        employee” at a hardware startup comprised of U of Michigan
        students trying to build smart-bikes to replace kiosk-based
        bikeshare systems. We graduated, burned outselves out, and the
        company failed. I did a contract, then in 2015, I joined an
        agriculture software company. I built their webapp for just
        under a year and a half, shipping some major features and
        migrating a bunch of code from Backbone to React. I was laid off
        in 2016, and thus ends my steady employment.
      </Paragraph>
      <Paragraph>
        I joined an ad tech company, but left after almost 6 months due
        to frustrations with the stack—I wanted to build web apps, not
        data pipelines. I moved to New York and joined a health tech
        company with the task of rebooting their product. I left just
        under 5 months later after my responsibilities were shifted to
        supporting the backend.
      </Paragraph>
      <Paragraph>
        After that, I felt so burned out I didn’t line up a job and
        spent a few months “on sabbatical.” Mostly, I read about
        cryptocurrency, played video games (
        <TextLink href="https://store.steampowered.com/app/251110/INFRA/">
          INFRA
        </TextLink>{' '}
        is great), worked on side projects, took online classes, and
        argued on reddit.
      </Paragraph>
      <Paragraph>
        My sabbatical ended when I got an offer to work at a Fortune 100
        company in Wall Street via an agency. I did that for a just
        under 6 months, but my time there was cut short by when I felt
        was an opportunity of a lifetime. It’s what I’m doing now: in
        the recent past, I built{' '}
        <TextLink href="https://www.stellarx.com/markets">
          StellarX
        </TextLink>
        , and am now building tools for the Stellar Development
        Foundation.
      </Paragraph>
      <Paragraph>
        All told (including some recent org shifts without changing
        teams), I’ve worked for 8 different companies since 2012.
      </Paragraph>
    </Container>
  </Layout>
);
