
import '../../css/main.css';

export const ClockStyle = {
  position: 'fixed',
  top: 0,
  height: 40,
  width: 70,
  zIndex: 40,
  color: '#ff0101',
  backgroundColor: 'rgba(255,255,255,.5)',
  opacity: 1.0,
  left: 0,
  fontSize: '1.2em',
  display: 'table'
};

export const DataStreamMessageContainerStyle = {
  position: 'fixed',
  top: 0,
  height: 40,
  // width: 560,
  width: 700,
  zIndex: 40,
  color: '#ff0101',
  backgroundColor: 'rgba(255,255,255,.5)',
  opacity: 1.0,
  left: 70,
  fontSize: '1.2em',
  display: 'table',
  clip: 'rect(0, auto, auto, 0)',
  overflow: 'hidden'
};

export const MessageStyle = {
  display: "table-cell",
  verticalAlign: "middle",
  opacity: 1.0,
  overflow: 'hidden'
};

export const MessageDataStyle = {
  display: "table-cell",
  verticalAlign: "middle",
  opacity: 1.0,
  // width: 550,
  width: 690,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  wordBreak:' break-all'
};

export const EnCodedeMessageStyle = {
  fontSize: '1.0em',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  height: 40,
	fontFamily: 'Aurebesh'
};

export const ZoomStyle = {
  position: 'fixed',
  bottom: 0,
  right: 0,
  height: 40,
  width: 200,
  zIndex: 40,
  color: '#ff0101',
  backgroundColor: 'rgba(255,255,255,.5)',
  opacity: 1.0,
  // left: 630,
  fontSize: '1.2em',
  display: 'table'
};