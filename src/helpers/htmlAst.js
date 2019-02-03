import isArray from 'isarray';

export const getChildText = nodes => {
  const processNode = node => {
    if (node.type === 'text') {
      return node.value;
    }
    return getChildText(node.children);
  };
  if (isArray(nodes)) {
    return nodes.map(processNode).join('');
  }
  return processNode(nodes);
};

export const getSnippet = nodes =>
  getChildText(nodes)
    .substr(0, 40)
    .trim();
