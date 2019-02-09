import React from 'react';
import styled from 'styled-components';

import { Container } from '../basics/Layout';
import { TextLink, Paragraph, Block, Image } from '../basics/Text';

import GitHubIcon from '../images/github.svg';
import TwitterIcon from '../images/twitter.svg';
import LinkedInIcon from '../images/linkedin.svg';
import RssIcon from '../images/rss.svg';

const El = styled(Container).attrs({ as: 'footer' })``;
const ImageEl = styled(Image)`
  display: inline-block;
  margin: 0;
  margin-right: 1em;
`;

const social = [
  {
    href: 'https://github.com/vcarl',
    image: GitHubIcon,
    name: 'GitHub',
  },
  {
    href: 'https://twitter.com/vcarl_',
    image: TwitterIcon,
    name: 'Twitter',
  },
  {
    href: 'https://www.linkedin.com/in/carl-vitullo-a7488728/',
    image: LinkedInIcon,
    name: 'LinkedIn',
  },
  {
    href: '/rss.xml',
    image: RssIcon,
    name: 'RSS',
  },
];

const Footer = () => (
  <El>
    <Block>
      {social.map(({ href, image, name }) => (
        <TextLink key={name} href={href}>
          <ImageEl src={image} alt={name} />
        </TextLink>
      ))}
    </Block>
    <Paragraph>
      <TextLink href="https://github.com/vcarl/blog">
        View source
      </TextLink>
    </Paragraph>
    <Paragraph>
      © {new Date().getFullYear()}, Built with
      {` `}
      <TextLink href="https://www.gatsbyjs.org">Gatsby</TextLink>
    </Paragraph>
  </El>
);

export default Footer;
