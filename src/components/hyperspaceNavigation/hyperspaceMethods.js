


import React from 'react';
import _ from 'lodash';

import { HyperSpacePathCollection, Point } from '../../classes/stellarClasses.js';
import HyperspacePath from './hyperspacePath.js';





export function createHyperspacePathsComponents(PathCollectionData, StartAndEndLocations, hyperspaceHash) {
  const PathCollection = new HyperSpacePathCollection(
    PathCollectionData.start,
    PathCollectionData.end,
    PathCollectionData.paths,
    PathCollectionData.lanes,
    PathCollectionData.nodes
  );
  // console.log("PathCollection: ", PathCollection.paths.length);

  console.log("hyperspaceHash found little bitch: ", hyperspaceHash);

  const Paths = PathCollection.generateHyperspacePaths();
  const displayedLanes = _.filter(Paths, function(currentPath) { 
    return currentPath.hashValue === hyperspaceHash; 
  });
  console.log("displayedLanes: ", displayedLanes);

  const displayedPaths = (displayedLanes.length > 0)? displayedLanes : Paths;
  console.log("displayedPaths: ", displayedPaths);

  const HyperspacePathsComponents = [];

  for(let Path of displayedPaths) {
    // const index = _.findIndex(Paths, function(el) { return el.hashValue == Path.hashValue });
    // console.log("Path index number: ", index);
    let lanes = Path.createArrayOfHyperspaceLanes(PathCollection.lanes);
    let nodes = Path.createArrayOfHyperspaceNodes(PathCollection.nodes);
    HyperspacePathsComponents.push(<HyperspacePath key={Path.hashValue} Path={Path} lanes={lanes} nodes={nodes}  StartAndEndLocations={StartAndEndLocations}  />);
    // console.log("lanes: ", lanes.length);
    // console.log("nodes: ", nodes.length);
  }
  return HyperspacePathsComponents;

}

