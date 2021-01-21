import React from 'react';

const withHooksHoc = (Component) => {
  return (props) => {
    const screenWidth = useScreenWidth();

    return <Component width={screenWidth} {...props} />;
  };
};

export default withHooksHoc;
