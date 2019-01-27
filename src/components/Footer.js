import React from 'react';
import styled from 'styled-components';

import { Container } from '../basics/Layout';
import { TextLink, Paragraph, Block, Image } from '../basics/Text';

import GitHubIcon from '../images/github.svg';
import TwitterIcon from '../images/twitter.svg';
import LinkedInIcon from '../images/linkedin.svg';

const El = styled(Container).attrs({ as: 'footer' })``;
const ImageEl = styled(Image)`
  display: inline-block;
  margin: 0;
  margin-right: 1rem;
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
];

const Footer = () => (
  <El>
    <Block>
      {social.map(({ href, image, name }) => (
        <TextLink key={name} href={href} alt={name}>
          <ImageEl src={image} />
        </TextLink>
      ))}
    </Block>
    <Paragraph>
      Edit on{' '}
      <TextLink href="https://github.com/vcarl/blog">GitHub</TextLink>
    </Paragraph>
    <Paragraph>
      © {new Date().getFullYear()}, Built with
      {` `}
      <TextLink href="https://www.gatsbyjs.org">Gatsby</TextLink>
    </Paragraph>
  </El>
);

export default Footer;
