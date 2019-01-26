import styled from 'styled-components';

export const Article = styled.article``;
export const Text = styled.span``;
export const Small = styled.small`
  color: #666;
`;
export const Block = styled.div``;
export const Paragraph = styled.p`
  line-height: 1.5;
`;
export const Code = styled.pre`
  margin: 0;
  background: #e6e6e6;
  padding: 0.5rem;
  border: 1px solid #bbb;
  border-radius: 2px;
  line-height: 1.3;
`;
export const InlineCode = styled.span`
  margin: 0;
  background: #e6e6e6;
  padding: 0 3px;
  border: 1px solid #bbb;
  border-radius: 2px;
  line-height: 1.2;
  font-family: monospace;
`;
export const TextLink = styled.a`
  text-decoration: none;
  color: #93261f;
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

export const Title = styled.h1``;
export const Subtitle = styled.div``;
export const Heading = styled.h2``;
export const Subheading = styled.h3``;
export const H4 = styled.h4``;
export const H5 = styled.h5``;
export const H6 = styled.h6``;
