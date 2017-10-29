import React from 'react';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';

import { HyperSpacePathCollection, Point } from '../../classes/stellarClasses.js';
import HyperspacePath from './hyperspacePath.js';
import HyperspaceFreeSpaceJump from './hyperspaceFreeSpaceJump.js';

const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
const hyperspaceLanesStyleGold = {color: 'gold', weight: 3};

export function createHyperspacePathsComponents(
    PathCollectionData,
    StartAndEndLocations,
    hyperspaceHash
  ) {
    const PathCollection = new HyperSpacePathCollection(
      PathCollectionData.start,
      PathCollectionData.end,
      PathCollectionData.paths,
      PathCollectionData.lanes,
      PathCollectionData.nodes
    );
    const Paths = PathCollection.generateHyperspacePaths();
    const displayedLanes = _.filter(Paths, function(currentPath) { 
      return currentPath.hashValue === hyperspaceHash; 
    });
    const displayedPaths = (displayedLanes.length > 0)? displayedLanes : Paths;
    const HyperspacePathsComponents = [];
    const isSinglePath = (displayedPaths.length > 1)? false : true; 

    for(let Path of displayedPaths) {
      let lanes = Path.createArrayOfHyperspaceLanes(PathCollection.lanes);
      let nodes = Path.createArrayOfHyperspaceNodes(PathCollection.nodes);
      HyperspacePathsComponents.push(<HyperspacePath key={Path.hashValue} Path={Path} lanes={lanes} nodes={nodes}  StartAndEndLocations={StartAndEndLocations} isSinglePath={isSinglePath} />);
    }
    return HyperspacePathsComponents;
}

export function createFreespaceLane(Node, Point, isStart) {
  return (<HyperspaceFreeSpaceJump  key={uuidv4()} HyperSpaceNode={Node} HyperSpacePoint={Point} styleOfJump={hyperspaceLanesStyleGold}  isStart={isStart} />);
}

export function nodeAndPointAreEqual(point1, point2) {
  const sameName = (point1.system === point2.system)? true : false;
  const sameLatitude = (point1.lat === point2.lat)? true : false;
  const sameLongitude = (point1.lng === point2.lng)? true : false;
  if(sameName && sameLatitude && sameLongitude) {
    return true;
  } else {
    return false;
  }
}

export function getGalacticYFromLatitude(latitude) {
  return  (-3.07e-19*(latitude**12)) + (-1.823e-18*(latitude**11)) + (4.871543e-15*(latitude**10)) + (4.1565807e-14*(latitude**9)) + (-2.900986202e-11 * (latitude**8)) + (-1.40444283864e-10*(latitude**7)) + (7.9614373223054e-8*(latitude**6)) + (7.32976568692443e-7*(latitude**5)) + (-0.00009825374539548058*(latitude**4)) + (0.005511093818675318*(latitude**3)) + (0.04346753629461727 * (latitude**2)) + (111.30155374684914 * latitude);
}

export function getGalacticXFromLongitude(longitude) {
  return (111.3194866138503 * longitude);
}
