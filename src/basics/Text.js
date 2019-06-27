import React from 'react';
import styled from 'styled-components';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import { BlankLink } from './Link';

const linkableStyles = ({ hasLink }) =>
  hasLink &&
  `position: relative;
  padding-left: 1em;
  margin-left: -1em;
`;

const makeLinkable = Comp => {
  const LinkableId = styled(BlankLink)`
    visibility: hidden;
    position: absolute;
    left: 0px;
    font-size: 0.8em;
    height: 100%;
    opacity: 0.5;
    padding: 0 0.25em;
    user-select: none;

    ${Comp}:hover & {
      visibility: visible;
    }
  `;
  return ({ id, children, hasLink, ...props }) => (
    <Comp id={id} hasLink={hasLink} {...props}>
      {hasLink && <LinkableId href={`#${id}`}>¶</LinkableId>}
      {children}
    </Comp>
  );
};

export const Article = styled.article``;
export const Text = styled.span``;
export const Small = styled.small`
  color: ${({ theme }) => theme.textMuted};
`;
export const Italic = styled.em``;
export const Bold = styled.strong``;
export const Block = styled.div``;
export const Paragraph = makeLinkable(styled.p`
  line-height: 1.5;
  ${linkableStyles}
`);
export const Code = styled.pre`
  margin: 0;
  background: ${({ theme }) => theme.mutedBackground};
  padding: 0.5em;
  border: 1px solid ${({ theme }) => theme.mutedBorder};
  border-radius: 2px;
  line-height: 1.3;
`;
export const InlineCode = styled.span`
  margin: 0;
  background: ${({ theme }) => theme.mutedBackground};
  padding: 0 3px;
  border: 1px solid ${({ theme }) => theme.mutedBorder};
  border-radius: 2px;
  line-height: 1.2;
  font-family: monospace;
`;
export const TextLink = styled(OutboundLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  &:hover {
    text-decoration: underline;
  }
`;
export const Image = styled.img`
  display: block;
  max-width: 100%;
  margin: auto;
`;
export const List = styled.ul`
  line-height: 1.3;
  padding-left: 2em;
`;
export const OrderedList = styled(List).attrs({ as: 'ol' })``;
export const ListItem = styled.li``;
export const Break = styled.hr`
  max-width: 6em;
  margin: 3em auto;
`;
export const Quote = styled.blockquote`
  padding-left: 1.5rem;
  border-left: 2px solid ${({ theme }) => theme.mutedBorder};
  margin: 0 0 0 1em;
  font-style: italic;
  display: inline-block;

  & p {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.25;
    font-size: 0.9em;
  }
`;

const titleStyles = `
  font-family: 'lato', 'arial', sans-serif;
`;

export const Title = styled.h1`
  ${titleStyles};
`;
export const Subtitle = styled.div`
  ${titleStyles};
`;

const makeLinkableHeading = base =>
  makeLinkable(styled[base]`
    ${titleStyles};
    ${linkableStyles}
  `);
export const Heading = makeLinkableHeading('h2');
export const Subheading = makeLinkableHeading('h3');
export const H3 = makeLinkableHeading('h3');
export const H4 = makeLinkableHeading('h4');
export const H5 = makeLinkableHeading('h5');
export const H6 = makeLinkableHeading('h6');

export const Inserted = styled.ins`
  text-decoration: none;
  color: #478400;
  font-weight: bold;
`;
export const Deleted = styled.del`
  position: relative;
  color: #f00;
`;
export const Iframe = styled.iframe``;
