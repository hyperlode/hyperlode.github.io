// Default path demonstrations — easily add, remove, or replace
//
// Each entry is a geometry object with:
//   vertices — corner points of the closed polygon (clockwise)
//   segments — groups of edges that slide together [startVertex, endVertex, affectY]
//   nodeLimits — per-vertex crossing constraints [[xLimits], [yLimits]], ...
//   overlapIllusionData — optional masks to fake over/under weave

const DEFAULT_PATH_EXAMPLES = {
  lode: {
    name: 'OG Lode Path',
    vertices: [
      [3,0],[3,3],[5,3],[5,1],[2,1],[2,4],[4,4],[4,0],[6,0],[6,2],[1,2],[1,0]
    ],
    segments: [
      [7,9,0],[7,9,1],
      [1,3,0],[1,3,1],
      [4,6,0],[4,6,1],
      [10,0,0],[10,0,1],
      [8,11,1],
      [2,5,1],
      [5,8,0],
      [11,2,0]
    ],
    nodeLimits: [
      [[],[]],              //0
      [[2,4,7],[6,10]],     //1
      [[6],[9]],            //2
      [[7,9],[9,7]],        //3
      [[],[]],              //4
      [[1],[]],             //5
      [[5],[]],             //6
      [[],[]],              //7
      [[3],[3]],            //8
      [[],[3,2]],           //9
      [[1],[]],             //10
      [[4],[4]]             //11
    ],
    overlapIllusionData: [],
    fillRule: 'evenodd'
  },

  loop: {
    name: 'Loop (Spiral with Over/Under)',
    vertices: [
      [2,0],[3,0],[3,4],[0,4],[0,1],[4,1],[4,2],[1,2],[1,3],[2,3]
    ],
    segments: [
      [9,2,1],[9,2,0],[4,7,0],[4,7,1],[3,8,0],[3,8,1],[2,9,1],[2,9,0]
    ],
    nodeLimits: [
      [[8],[9]],[[], []],[[], []],[[], []],[[], []],[[], []],
      [[7],[8]],[[], []],[[], []],[[], []]
    ],
    overlapIllusionData: [{ upperLeftNode: 0, lowerRightNode: 2 }]
  },

  cross: {
    name: 'Cross (Plus Shape)',
    vertices: [
      [1,0],[2,0],[2,1],[3,1],[3,2],[2,2],[2,3],[1,3],[1,2],[0,2],[0,1],[1,1]
    ],
    segments: [[2,11,1],[8,11,0],[5,2,0],[8,5,1]],
    nodeLimits: [
      [[],[11]],[[], []],[[], []],[[2],[]],[[], []],[[], []],
      [[],[5]], [[], []],[[], []],[[], []],[[0],[]],[[], []]
    ],
    overlapIllusionData: []
  },

  square: {
    name: 'Square (Minimal 4-Vertex)',
    vertices: [[0,1],[4,1],[4,2],[0,2]],
    segments: [[0,2,0]],
    nodeLimits: [[[], []],[[], []],[[], []],[[], []]],
    overlapIllusionData: []
  },

  squareOneSideMoving: {
    name: 'Square One Side Moving',
    vertices: [[0,1],[4,1],[4,2],[0,2]],
    segments: [[1,2,0]],
    nodeLimits: [[[1],[2]],[[], []],[[], []],[[], []]],
    overlapIllusionData: [],
    fillRule: 'evenodd'
  },

  fullyMovingSquare: {
    name: 'Fully Moving Square',
    vertices: [[0,1],[4,1],[4,2],[0,2]],
    segments: [[1,2,0],[3,0,0],[0,1,1],[2,3,1]],
    nodeLimits: [[[1],[2]],[[], []],[[], []],[[], []]],
    overlapIllusionData: [],
    fillRule: 'evenodd'
  },

  spiral: {
    name: 'Spiral (12-Vertex with Four Crossings)',
    vertices: [
      [0,2], [6,2], [6,5], [1,5],
      [1,1], [5,1], [5,4], [2,4],
      [2,3], [4,3], [4,0], [0,0]
    ],
    segments: [
      [11,  2, 1],
      [ 0,  3, 0],
      [ 1,  4, 1],
      [ 2,  5, 0],
      [ 3,  6, 1],
      [ 4,  7, 0],
      [ 5,  8, 1],
      [ 6,  9, 0],
      [ 7, 10, 1],
      [ 8, 11, 0],
      [ 9,  0, 1],
      [10,  1, 0]
    ],
    nodeLimits: [
      [[3,5,9],    [4,9]   ],
      [[3,5,9],    [4,9]   ],
      [[],         []      ],
      [[0,1],      [0]     ],
      [[0,9],      [0,9,10]],
      [[1,9],      [0,9,10]],
      [[0,1],      [0]     ],
      [[],         []      ],
      [[],         []      ],
      [[0,1,4,5],  [0,4]   ],
      [[0,1,4,5],  [0,4]   ],
      [[],         []      ]
    ],
    overlapIllusionData: []
  }
};

/**
 * Get a geometry by name.
 * Returns the geometry object (vertices, segments, nodeLimits, overlapIllusionData).
 */
function getGeometryByName(name) {
  const example = DEFAULT_PATH_EXAMPLES[name];
  if (!example) return DEFAULT_PATH_EXAMPLES.lode;

  // Return only the geometry data, not the metadata (name)
  const { name: _, ...geometry } = example;
  return geometry;
}

/**
 * Get all available shape names (keys of DEFAULT_PATH_EXAMPLES).
 */
function getAvailableShapeNames() {
  return Object.keys(DEFAULT_PATH_EXAMPLES);
}
