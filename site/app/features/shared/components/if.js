export default ({value, children, elseDisplay = null}) =>
  value ? children : elseDisplay;
