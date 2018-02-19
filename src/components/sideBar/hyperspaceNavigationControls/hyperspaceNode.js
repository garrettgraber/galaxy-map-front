import React from 'react';
import { If, Then, Else } from 'react-if';
import '../../../css/main.css';

class HyperspaceNode extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    const Node = this.props.Node;
    return LocationGalacticDisplay(Node);
  }
}

function LocationGalacticDisplay(Node) {
  const xGalacticLongIsNotSet = isNaN(Node.xGalacticLong);
  const yGalacticLongIsNotSet = isNaN(Node.yGalacticLong);

  return (
    <div className="pane-row-text">
      <If condition={xGalacticLongIsNotSet && yGalacticLongIsNotSet}>
        <Then>
          <span className="display-text">:&nbsp;&nbsp;None</span>
        </Then>
        <Else>
          <span className="display-text">Node:&nbsp;&nbsp;{Node.system.slice(0, 10)}</span>
        </Else>
      </If>

      <If condition={xGalacticLongIsNotSet}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;X:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;X:&nbsp;&nbsp;{parseFloat(Node.xGalacticLong).toFixed(6)}</span>
        </Else>
      </If>

      <If condition={yGalacticLongIsNotSet}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;Y:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;Y:&nbsp;&nbsp;{parseFloat(Node.yGalacticLong).toFixed(6)}</span>
        </Else>
      </If>
    </div>
  );
}

export default HyperspaceNode;