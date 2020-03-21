export function getWindowPoint(value, svgX, svgY) {
  const svg = document.querySelector('.overview-svg svg');
  var p = svg.createSVGPoint();
  p.x = svgX;
  p.y = svgY;
  return p.matrixTransform(svg.getScreenCTM());
}

export const getMousePosition = (event, ViewerDOM) => {
  let { left, top } = ViewerDOM.getBoundingClientRect();
  let x = event.clientX - Math.round(left);
  let y = event.clientY - Math.round(top);
  return { x, y };
};

export const getPercentage = (value, percentage) => (value * percentage) / 100;
