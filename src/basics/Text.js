import styled from 'styled-components';

export const Article = styled.article``;
export const Text = styled.span``;
export const Small = styled.small`
  color: ${({ theme }) => theme.textMuted};
`;
export const Block = styled.div``;
export const Paragraph = styled.p`
  line-height: 1.5;
`;
export const Code = styled.pre`
  margin: 0;
  background: ${({ theme }) => theme.mutedBackground};
  padding: 0.5rem;
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
export const TextLink = styled.a`
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
export const List = styled.ul``;
export const OrderedList = styled.ol``;
export const ListItem = styled.li``;
export const Break = styled.hr``;

const titleFont = "font-family: 'lato'";

export const Title = styled.h1`
  ${titleFont};
`;
export const Subtitle = styled.div`
  ${titleFont};
`;
export const Heading = styled.h2`
  ${titleFont};
`;
export const Subheading = styled.h3`
  ${titleFont};
`;
export const H4 = styled.h4`
  ${titleFont};
`;
export const H5 = styled.h5`
  ${titleFont};
`;
export const H6 = styled.h6`
  ${titleFont};
`;
