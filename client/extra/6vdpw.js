// game.js

var level = loadXML();

<SHAPE> = {circle | polygon}

<PHYS DATA> = {

    mass,
    friction,
    bouncy
    
    
    position,
    speed,
    acceleration
    
}

<GRAPH DATA> = color

level = {
    character: {<POSITION>},
    dynamicObjects: [{<SHAPE>, <PHYS DATA>, <GRAPH DATA>, <POSITION>, <SPEED/ACCELERATION>, }],
    staticObjects:  [{<SHAPE>, <PHYS DATA>, <GRAPH DATA>, <POSITION>}]
}


level = {
    character: { x: 0, y: 0 },
    dynamicObjects: [
        
    ],
    staticObjects: [
        {
            shape: {
                type: TYPE_SPHERE,
                data: {RADIUS: 15}
            },
            physData: {
                mass: 2,
                friction: 1,
                bouncy: 0.2
            },
            graphData: {
                color: red
            },
            position: {
                x: 0,
                y: 20
            }
        }
    ]
}

level.dynamicObjects.forEach(function(e) {
    var graphObj = game.graphics.createObject(e.shape, e.graphData, e.position);
    var physObj  = game.physics.createDynamicObject(e.shape, e.physData, e.position);
    world.addObject(physObj, graphObj);
 });

level.staticObjects.forEach(function(e) { 
    game.graphics.createObject(e.shape, e.graphData, e.position);
    game.physics.createStaticObject(e.shape, e.physData, e.position);
 });
 
game.player = new Player(level.character.x, level.character.y);
