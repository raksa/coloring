var PaintBucketApp = function (divId, bgSrc) {
	this.canvasWidth = 300;
	this.canvasHeight = 300;
	this.curColor = new Color(203, 53, 148);
	this.outlineImage = new Image();
	this.backgroundImage = new Image();
	this.drawingAreaX = 10;
	this.drawingAreaY = 10;
	this.drawingAreaWidth = 280;
	this.drawingAreaHeight = 280;
	this.colorLayerData;
	this.outlineLayerData;
	this.totalLoadResources = 2;
	this.curLoadResNum = 0;
	this.src = "";

	this._resourceLoaded = function () {
		this.curLoadResNum += 1;
		if (this.curLoadResNum === this.totalLoadResources) {
			this._createMouseEvents();
			this._redraw();
		}
	};

	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', this.canvasWidth);
	canvas.setAttribute('height', this.canvasHeight);
	canvas.setAttribute('id', 'canvas');
	var d = document.getElementById(divId);
	while (d.hasChildNodes()) {
	    d.removeChild(d.lastChild);
	}
	d.appendChild(canvas);
	if (typeof G_vmlCanvasManager !== "undefined") {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	this.context = canvas.getContext("2d");
	this.backgroundImage.onload = this._resourceLoaded.bind(this);
	this.backgroundImage.src = bgSrc;

	this._clearCanvas = function () {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	};
	this._redraw = function () {
		var locX, locY;
		if (this.curLoadResNum < this.totalLoadResources) {
			return;
		}
		this._clearCanvas();
		this.context.putImageData(this.colorLayerData, 0, 0);
		this.context.drawImage(this.backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);
		this.context.drawImage(this.outlineImage, this.drawingAreaX, this.drawingAreaY, this.drawingAreaWidth, this.drawingAreaHeight);
	};
	this._getColorAtPos = function(imageData, pos){
		var pixelPos = pos.getPixelPos(this.canvasWidth);
		return new Color(imageData.data[pixelPos],
		imageData.data[pixelPos + 1],
		imageData.data[pixelPos + 2],
		imageData.data[pixelPos + 3]);
	};
	this._makePos = function(x, y) {
		return new Pos(x, y, this.drawingAreaX, this.drawingAreaY,
			this.drawingAreaX + this.drawingAreaWidth,
			this.drawingAreaY + this.drawingAreaHeight);
	};
	this._isCanFillPos = function (pos, startColor) {
		var color1 = this._getColorAtPos(this.outlineLayerData, pos);
		var color2 = this._getColorAtPos(this.colorLayerData, pos);
		return !isMatchOutlineColor(color1) && color1.isMatchColorA(startColor) && 
		!color2.isMatchColorA(this.curColor);
	};
	this._setColorAtPos = function (pos, color) {
		var pixelPos = pos.getPixelPos(this.canvasWidth);
		this.colorLayerData.data[pixelPos] = color.r;
		this.colorLayerData.data[pixelPos + 1] = color.g;
		this.colorLayerData.data[pixelPos + 2] = color.b;
		this.colorLayerData.data[pixelPos + 3] = color.a;
	};
	this._floodFill = function (startPos, startColor) {
		var newPos, reachLeft, reachRight;
		var pixelStack = [startPos];
		var checkCanPush = function(pos, isReach){
			if (this._isCanFillPos(pos, startColor)) {
				if(!isReach){
					pixelStack.push(pos);
					return true;
				}
			} else {
				return false;
			}
			return isReach;
		};
		while (pixelStack.length) {
			newPos = pixelStack.pop();
			while (newPos.isCanTop() && this._isCanFillPos(newPos.getTop(), startColor)) 
				newPos.moveTop();
			reachLeft = reachRight = false;
			do {
				this._setColorAtPos(newPos, this.curColor);
				if (newPos.isCanLeft()) reachLeft = checkCanPush.bind(this)(newPos.getLeft(), reachLeft);
				if (newPos.isCanRight()) reachRight = checkCanPush.bind(this)(newPos.getRight(), reachRight);
				if (newPos.isCanBottom()) newPos.moveBottom();
			} while(this._isCanFillPos(newPos, startColor));
		}
	};
	this._createMouseEvents = function () {
		var self = this;
		$('#canvas').mousedown(function (e) {
			var rect = self.context.canvas.getBoundingClientRect();
			var pos = self._makePos(e.clientX - rect.left, e.clientY - rect.top);
			if (!pos.isValidPos()) return;
			var color = self._getColorAtPos(self.outlineLayerData, pos);
			if (!self._isCanFillPos(pos, color)) return;
			console.time('self._floodFill');
			self._floodFill(pos, color);
			console.timeEnd('self._floodFill');
			self._redraw();
		});
	};
	
	this.reset = function(){
		if(this.src != "") this.setImage(this.src);
	};
	this.download = function(){
	    download(this.context, this.src.replace(/^.*[\\\/]/, ''));
	};
	this.print = function(ctx){
		print(this.context);
	};
	this.setCurColor = function(color){
    	var long = parseInt(color, 16);
    	this.curColor = new Color((long >>> 16) & 0xff, (long >>> 8) & 0xff, long & 0xff);
    	if(this.curColor.isMatchColor(new Color(255, 255, 255))) this.curColor.a = 0;
	}
	this.setImage = function (src) {
		this._clearCanvas();
		this.colorLayerData = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
		this.src = src;
		if(this.curLoadResNum > 1) this.curLoadResNum = 1;
		this.outlineImage.onload = function () {
			this.context.drawImage(this.outlineImage, this.drawingAreaX, this.drawingAreaY, this.drawingAreaWidth, this.drawingAreaHeight);
			try {
				this.outlineLayerData = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
			} catch (ex) {
				window.alert("Application cannot be run locally. Please run on a server.");
				return;
			}
			this._resourceLoaded();
		}.bind(this);
		this.outlineImage.src = src;
	};

};