import { forwardRef } from 'react';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

interface Props extends TransitionProps {
  children?: React.ReactElement<any, any>;
}

const Transitions = {
  SlideUp: forwardRef(function SlideUp(props: Props, ref) {
    return <Slide ref={ref} direction="up" {...props} />;
  }),
  SlideLeft: forwardRef(function ZoomIn(props: Props, ref) {
    return <Slide ref={ref} direction="left" {...props} />;
  }),
};

export default Transitions;
