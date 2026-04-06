

    // murmurations: 
    // a lode path:    draw a straight line segments(aka work only orthogonally). 90 deg corners can only made if the line after the corner will cross another line. If no other lines can be crossed, a corner can be made at any time in the same direction as the previous 90deg angle. 
    // CROSSINGS are the relevant features of a lodepath. If a crossing exists, and the crossing lines move, they can only move in ways that the crossing keeps on existing. 




function init_path(evt) {
    console.log("init path");
    let svg_element = document.getElementById('testsvg');

    // let pathGeometry = getPathGeometryNiceLoop();
    // let pathGeometry = getPathGeometrySimpleSquare();
    // let pathGeometry = getPathGeometryCross();
    // displaySingleMovingPath(svg_element, pathGeometry);

    // let pathGeometries = [
    //     [getPathGeometryNiceLoop(), getPathPropertiesBlackWhite()],
    //     [getPathGeometrySimpleSquare(), getPathPropertiesBlackWhite()],
    //     [getPathGeometryCross(), getPathPropertiesRedWhite()]
    // ];
    let pathGeometries = [
    [getPathGeometryLodeSpecial(), getPathPropertiesBlackWhite()]
    ];
    // let pathGeometries = [
    //     [getPathGeometrySimpleSquare(), getPathPropertiesBlackWhite()]
    // ];
    // let pathGeometries = [
    //     [getPathGeometryNiceLoop(), getPathPropertiesBlackWhite()]
    //  ];
    displayMultipleMovingPaths(svg_element, pathGeometries);
}

function getPathGeometryCross() {
    //specific path coords (go always clockwise)
    let coords = [[1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [2, 2], [2, 3], [1, 3], [1, 2], [0, 2], [0, 1], [1, 1]]; // nodes with their x-y coord (node0, node1,....)
    // let segments = [[0, 1, 1]]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all inbetween nodes 
    let segments = [[2, 11, 1], [8, 11, 0], [5, 2, 0], [8, 5, 1]]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all inbetween nodes 
    let nodeLimits = [
        [[], [11]],
        [[], []],
        [[], []],
        [[2], []],
        [[], []],
        [[], []],
        [[], [5]],
        [[], []],
        [[], []],
        [[], []],
        [[0], []],
        [[], []]
    ]; //each node has for every orientation limit nodes (coordinate cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]
    let overlapIllusionData = [];
    let pathGeometry = { coords: coords, segments: segments, nodeLimits: nodeLimits, overlapIllusionData: overlapIllusionData };
    return pathGeometry;
}

function getPathGeometryLodeSpecial() {
    //specific path coords (go always clockwise)
    let coords = [[3, 0], [3, 3], [5, 3], [5, 1], [2, 1], [2, 4], [4, 4], [4, 0], [6, 0], [6, 2], [1, 2], [1, 0]]; // nodes with their x-y coord (node0, node1,....)
    // let segments = [[0, 1, 1]]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all inbetween nodes 
    let segments = [
        [7, 9, 0], [7, 9, 1],
        [1, 3, 0], [1, 3, 1],
        [4, 6, 0], [4, 6, 1],
        [10, 0, 0], [10, 0, 1],
        [8,11,1],
        [2,5,1],
        [5,8,0],
        [11,2,0]
        // ,[8, 11, 1], // make whole path move vert
        // [11, 10, 0] // make whole path move hori

    ]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all inbetween nodes 
    

    // lode path: keeps original shape fairly consistent:
    let nodeLimits = [
        [[], []], //0
        [[2], []], //1
        [[6], [9]], //2
        [[], []], //3
        [[], []], //4
        [[1], [10]], //5
        [[5], []], //6
        [[], []], //7
        [[3], [3]], //8
        [[], [3, 2]], //9
        [[1], []], //10
        [[4], [4]]  //11  
    ]; //each node has for every orientation limit nodes (node cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]
    
    
    
    // // Lode path: does not keep shape, but is always valid: 
    // let nodeLimits = [
    //     [[9], []], //0
    //     [[4], []], //1
    //     [[1], [3]], //2
    //     [[], [0]], //3
    //     [[], [7]], //4
    //     [[6], [4]], //5
    //     [[3], []], //6
    //     [[10], []], //7
    //     [[7], [9]], //8
    //     [[], [6]], //9
    //     [[], [1]], //10
    //     [[0], [10]]  //11  
    // ]; //each node has for every orientation limit nodes (node cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]
    let overlapIllusionData = [];
    let pathGeometry = { coords: coords, segments: segments, nodeLimits: nodeLimits, overlapIllusionData: overlapIllusionData };
    return pathGeometry;
}
function getPathGeometrySimpleSquare() {
    //specific path coords (go always clockwise)
    let coords = [[0, 1], [4, 1], [4, 2], [0, 2]]; // nodes with their x-y coord (node0, node1,....)
    let segments = [[0, 2, 0]]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all inbetween nodes 
    // let segments = [[1, 2, 0], [0, 1, 1]]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all inbetween nodes 
    let nodeLimits = [
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []]
    ]; //each node has for every orientation limit nodes (coordinate cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]
    let overlapIllusionData = [];
    let pathGeometry = { coords: coords, segments: segments, nodeLimits: nodeLimits, overlapIllusionData: overlapIllusionData };
    return pathGeometry;
}

function getPathGeometryNiceLoop() {
    let coords = [[2, 0], [3, 0], [3, 4], [0, 4], [0, 1], [4, 1], [4, 2], [1, 2], [1, 3], [2, 3]]; // nodes with their x-y coord (node0, ....)
    let segments = [[9, 2, 1], [9, 2, 0], [4, 7, 0], [4, 7, 1], [3, 8, 0], [3, 8, 1], [2, 9, 1], [2, 9, 0]]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all in between nodes 
    let nodeLimits = [
        [[8], [9]],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[7], [8]],
        [[], []],
        [[], []],
        [[], []]
    ]; //each node has for every orientation limit nodes (coordinate cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]

    // will put a rectangle over the shape to hide crossings 
    let overlapIllusionData = [{ upperLeftNode: 0, lowerRightNode: 2 }]; //horizontal crossing on top 
    // let overlapIllusionData = [{upperLeftNode:4,lowerRightNode:6}]; // vertical crossing on top
    // let overlapIllusionData = [{upperLeftNode:0,lowerRightNode:2}, {upperLeftNode:4,lowerRightNode:6}]; // blend instead of crossing 

    let pathGeometry = { coords: coords, segments: segments, nodeLimits: nodeLimits, overlapIllusionData: overlapIllusionData };
    return pathGeometry;
}

function getPathPropertiesBlackWhite() {
    //define paths always clockwise.
    let pathProperties = {
        PATH_OFFSET_X: 200, // 200
        PATH_OFFSET_Y: 200, // 200
        MAX_X: 1000,
        MIN_X: 0,
        MAX_Y: 1000,
        MIN_Y: 0,
        PATH_SCALE: 100,
        STROKE_COLOUR: "black", // "black"
        FILL_COLOUR: "white",// "white"
        STROKE_WIDTH: 0.05
    };
    return pathProperties;
}

function getPathPropertiesRedWhite() {
    //define paths always clockwise.
    let pathProperties = {
        PATH_OFFSET_X: 100, // 200
        PATH_OFFSET_Y: 100, // 200
        MAX_X: 1000,
        MIN_X: 0,
        MAX_Y: 1000,
        MIN_Y: 0,
        PATH_SCALE: 100,
        STROKE_COLOUR: "red", // "black"
        FILL_COLOUR: "white",// "white"
        STROKE_WIDTH: 0.05
    };
    return pathProperties;
}

function displayMultipleMovingPaths(svg_element, pathGeometries) {

    //animation properties
    let animationProperties = {
        ACCELERATION_MULTIPLIER: 0.1,
        HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA: 2
    };

    let fieldProperties = {

        // MASK_IS_VERTICAL: true
        LOOP_PERIOD_MS: 10,
        ACCELERATION_UPDATE_HIGHER_IS_LESS_PROBABLE:1000
    };

    let field = new Field(
        fieldProperties,
        svg_element
    );

    for (var i = 0; i < pathGeometries.length; i++) {

        // console.log(pathGeometries[i]);

        let pathGeometry = pathGeometries[i][0];
        pathGeometry["pathProperties"] = pathGeometries[i][1];
        // console.log(pathGeometry);
        field.addMovingPath(animationProperties, pathGeometry);
    }
    // give each path an acceleration at the start.
    field.assignAccelerations();
    
    field.animate();
}

function displaySingleMovingPath(svg_element, pathGeometry) {
    //define paths always clockwise.
    let pathProperties = {
        PATH_OFFSET_X: 200, // 200
        PATH_OFFSET_Y: 200, // 200
        MAX_X: 1000,
        MIN_X: 0,
        MAX_Y: 1000,
        MIN_Y: 0,
        PATH_SCALE: 100,
        STROKE_COLOUR: "black", // "black"
        FILL_COLOUR: "white",// "white"
        STROKE_WIDTH: 0.05
    };


    //animation properties
    let animationProperties = {
        ACCELERATION_MULTIPLIER: 0.01,
        HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA: 2
    };

    let fieldProperties = {

        // MASK_IS_VERTICAL: true
        LOOP_PERIOD_MS: 10,
        ACCELERATION_UPDATE_HIGHER_IS_LESS_PROBABLE: 100
    };

    let field = new Field(
        fieldProperties,
        svg_element
    );

    field.addMovingPath(animationProperties, pathProperties, pathGeometry);
    // give each path an acceleration at the start.
    // field.assignAccelerations();
    field.animate();
}
function circle_click(evt) {
    var circle = evt.target;
    var currentRadius = circle.getAttribute("r");

    if (currentRadius == 100) {
        circle.setAttribute("r", currentRadius * 2);
    } else {
        circle.setAttribute("r", currentRadius * 0.5);
    }
}

function make_shape(evt) {
    var svg = document.rootElement;//var svg = document.querySelector('svg');
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");			//var shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    shape.setAttribute("cx", 25);
    shape.setAttribute("cy", 25);
    shape.setAttribute("r", 20);
    shape.setAttribute("style", "fill: green");

    svg.appendChild(shape);

}