game.physics.tasks = [];
game.physics.queue = [];


// == physics cycle ==
    
    // this == game.physics

    queue.pop().call(this);
    
    ...
    
    tasks.forEach(function(e) { e.call(this); });

// ===================



var nav = game.input.createGroup("Navigation");

nav.addListener(
    "hold_toggle", //???
    function(state) {
        if (state == 1) {
            game.physics.tasks.add(game.player.moveRight);
        } else {
            game.physics.tasks.remove(game.player.moveRight);
        }
    },
    game.input.keycodeOf("D")
);

nav.getDNDinfo = function() {
    return {xs, ys, x, y, dx, dy}
}

nav.addListener(

    "dragndrop",
    
    function(e) {
        
        if (e.state == "drag_start") {
            // detect selected object
            game.physics.queue.add(function(e) {
                /*game.physics.*/selectDragndropObject(e.x, e.y);
            });
            game.physics.tasks.add(function() {
                var data = e.updateDNDInfo();
                 /*game.physics.*/updateDragndropObject(data.dx, data.dy);
            });
        } else
        if (e.state != "drag_move") {
            // release selected object
            game.physics.tasks.remove(function() {
                var data = e.updateDNDInfo();
                 /*game.physics.*/updateDragndropObject(data.dx, data.dy);
            });
            game.physics.queue.add(function() {
                /*game.physics.*/releaseDragndropObject(e.x, e.y);
            });
        }
        
    },
    
    [ game.input.MBTN_L, game.input.MBTN_R ]
    
);


    
   
game.physics.tasks   = [];
game.physics.queue   = [];
game.physics.taskMap = [];

// == physics cycle ==
    
    // this == game.physics
    
    taskMap[queue.pop()].call(this);
    
    ...
    
    tasks.forEach(function(e) { e.call(this); });

// ====


nav.addListener = function(name, fun1, fun2, fun3, filter){
    //...
    Listeners.add(
        function(e) {
    
        if (!e.savedData) {
            e.savedData = function() {
                var data = e.updateDNDInfo();
                fun2(data);
            }
        }
        
        if (e.state == "drag_start") {
            // detect selected object
            game.physics.queue.add(function(e) {                  
                fun1(e);
            });
            game.physics.tasks.add(e.savedData);
        } else
        if (e.state != "drag_move") {
            // release selected object
            game.physics.tasks.remove(e.savedData);
            delete e.savedData;
            game.physics.queue.add(function() {
                fun3(e);
            });
        }
        
        }
    );
    //...
}
nav.addListener(
    "dragndrop",
    function(e){
         /*game.physics.*/selectDragndropObject(e.x, e.y); 
    },
    function(e){
        /*game.physics.*/updateDragndropObject(e.dx, e.dy);
    }, 
    function(e){
         /*game.physics.*/releaseDragndropObject(e.x, e.y);
    },
    [ game.input.MBTN_L, game.input.MBTN_R ]
);








/*=========================================*/