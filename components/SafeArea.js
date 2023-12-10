// get paddings of the safe area
export const getContainerStyles = (insets) => {
  return {
    paddingTop: insets.top,
    // paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };
};
