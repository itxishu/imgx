import React from 'react';

const withHooksHoc = (Component) => {
  return (props) => {
    return <Component {...props} />;
  };
};

export default withHooksHoc;
