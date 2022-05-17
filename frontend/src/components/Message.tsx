import { Alert } from 'react-bootstrap';

import type { ReactChild } from 'react';

interface MessagePropsTypes {
  variant: string;
  children?: ReactChild | ReactChild[];
  text?: string;
}

export const Message = (props: MessagePropsTypes) => {
  const { variant, children } = props;
  return (
    <div className="my-5">
      <Alert variant={variant}>{children}</Alert>
    </div>
  );
};
