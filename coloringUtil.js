var isMatchOutlineColor = function (color) {
	return (color.r + color.g + color.b < 100 && color.a > 255/2);
};
var Color = function(r, g, b, a){
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = typeof a != "undefined"? a : 255;
	this.isMatchColor = function(color){
		return this.r == color.r && this.g == color.g && this.b == color.b;
	};
	this.isMatchColorA = function(color){
		return this.isMatchColor(color) && this.a == color.a;
	};
};
var Pos = function(x, y, minX, minY, maxX, maxY){
	this.x = x;
	this.y = y;
	this._minX = minX;
	this._minY = minY;
	this._maxX = maxX;
	this._maxY = maxY;
	this.isCanTop = function(){
		return this.y > this._minY;
	};
	this.isCanBottom = function(){
		return this.y < this._maxY;
	};
	this.isCanLeft = function(){
		return this.x > this._minX;
	};
	this.isCanRight = function(){
		return this.x < this._maxX;
	};
	this.clone = function(){
		return new Pos(this.x, this.y, this._minX, this._minY, this._maxX, this._maxY);
	};
	this.getTop = function(){
		var p = this.clone();
		p.y--;
		return p;
	};
	this.getBottom = function(){
		var p = this.clone();
		p.y++;
		return p;
	};
	this.getLeft = function(){
		var p = this.clone();
		p.x--;
		return p;
	};
	this.getRight = function(){
		var p = this.clone();
		p.x++;
		return p;
	};
	this.getPixelPos = function(width){
		return (this.y * width + this.x) * 4;
	};
	this.moveLeft = function(){
		this.x--;
	};
	this.moveRight = function(){
		this.x++;
	};
	this.moveTop = function(){
		this.y--;
	};
	this.moveBottom = function(){
		this.y++;
	};
	this.isValidPos = function(){
		return !(this.x < this._minX  || this.x > this._maxX || this.y < this._minY || this.y > this._maxY);
	};
};
var print = function(ctx){
	var img = '<img id="imageViewer" src="' + ctx.canvas.toDataURL("image/png") + '"/>';
	var d = $(document);
	var popup =  window.open('','popup','toolbar=no,menubar=no,width=' + d.width() + ',height=' + d.height());
	popup.document.open();
	popup.document.write("<html><head></head><body onload='print()'>");
	popup.document.write(img);
	popup.document.write("</body></html>");
	popup.document.close(); 
};
var download = function(ctx, imageName){
	var image = ctx.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	var link = document.createElement("a");
    link.setAttribute("href", image);
    link.setAttribute("download", imageName);
    link.click();
};