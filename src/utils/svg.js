import { fromObject, applyToPoint, inverse } from 'transformation-matrix';

export const getSVGPoint = (value, viewerX, viewerY) => {
  let matrix = fromObject(value);
  let inverseMatrix = inverse(matrix);
  return applyToPoint(inverseMatrix, { x: viewerX, y: viewerY });
};

export const setSvgElementData = (
  element,
  elementMeta = {
    name: 'rect',
    attributes: {},
    styles: {},
  },
) => {
  for (let attr in elementMeta.attributes) {
    if (attr === 'textContent') {
      element.textContent = elementMeta.attributes[attr];
    } else {
      element.setAttributeNS(null, attr, elementMeta.attributes[attr]);
    }
  }
  for (let attr in elementMeta.styles) {
    element.style[attr] = elementMeta.styles[attr];
  }
};

export const createSvgElement = (
  elementMeta = {
    name: 'rect',
    attributes: {},
    styles: {},
  },
) => {
  const newElement = document.createElementNS('http://www.w3.org/2000/svg', elementMeta.name);
  setSvgElementData(newElement, elementMeta);
  return newElement;
};

export const hideSvgElement = (terminalRectId) => {
  const element = document.getElementById(terminalRectId);
  if (element) {
    element.style.display = 'none';
  }
};
