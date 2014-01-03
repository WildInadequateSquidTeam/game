function TileSheet(image, tileWidth, tileHeight) {

	this.sheet = [];
	this.tileWidth  = tileWidth;
	this.tileHeight = tileHeight;

	//image: String | HTMLImageElement | HTMLCanvasElement | ImageData
	if (typeof image === "string") {
		console.log("src");
	} else
	if (image instanceof HTMLImageElement) {
		console.log("image");
	} else
	if (image instanceof HTMLCanvasElement) {
		console.log("canvas");
	} else
	if (image instanceof ImageData) {
		console.log("imageData");
	} else {
		console.error("Incorrect image source for TileSheet");
		return;
	}
	
}

var testCanvas = document.createElement("canvas").getContext("2d");
testCanvas.width  = testCanvas.canvas.width  = 640;
testCanvas.height = testCanvas.canvas.height = 480;

var testImage = document.createElement("img");
testImage.src = "background.jpg";
testImage.id = "testImage";
document.body.appendChild(testImage);
testImage = document.getElementById("testImage");

new TileSheet("asdf", 10, 10);
new TileSheet(testImage, 10, 10);
new TileSheet(testCanvas, 10, 10);
new TileSheet(testCanvas.getImageData(0, 0, 50, 50), 10, 10);
new TileSheet(15, 10, 10);

/*function TiledLayer(tileSheet, rows, columns, data) {
	
	this.tileSheet = tileSheet;
	this.rows = rows;
	this.columns = columns;
	this.data = new Array(this.rows);
	
	if (data instanceof Array) {
	
		if (data[0] instanceof Array) {
		
			var r = data.length;
			var c = data[0].length;
			for (var i = 0; i < r; i++) {
				
			}
			
		} else {
		
			var c = columns;
			var r = (data.length / c) | 0;
			
			
			
		}
		
	}
	
}




var data = [
	1,  1,  1,  1,  1,  1,  1, -3, -3, -3,
	1,  0,  0,  0,  0,  0,  0,  0, -3, -3,
	1,  0,  0,  0,  0,  0,  0,  0,  0, -3,
	1,  0,  0,  0,  0,  0,  0,  0,  0,  1,
	1,  0,  0,  0,  0,  0,  0,  0,  0,  1,
	1,  0,  0,  0,  0,  0,  0,  0,  0,  1,
	1,  0,  0,  0,  0,  0,  0,  0,  0,  1,
	1,  0,  0,  0, -2, -2, -2,  0,  0,  1,
	1, -1, -1, -1, -1, -1, -1, -1, -1,  1,
	1,  1,  1,  1,  1,  1,  1,  1,  1,  1
]


var level = new TiledLayer(
	new TileSheet("dirt.png", 16, 16),
	10, 10, data
);

level.draw();
...
level.tileSheet.animate(-1, 2);
....
level.tileSheet.animate(-1, 3);
....
level.tileSheet.animate(-1, 4);
....
level.tileSheet.animate(-1, 2);

level.tileSheet.animate(-3, 0);*/