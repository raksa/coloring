var paintBucketApp = null;
var choiceClick = function(e){
	var src = $(e).children()[0].src
	imageName = src.replace(/^.*[\\\/]/, '');
	var n = src.substr(src.length - 5, 1);
	$(".playing .title span").text(n);
	$(".playing").show();

	var menu = $("#menu");
	var height = menu.height();
	menu.css('top', -height + 'px');
	menu.show();

	if(paintBucketApp == null) paintBucketApp = new PaintBucketApp("canvasDiv", "image/background.png");
	paintBucketApp.setCurColor("ffffff");
	paintBucketApp.setImage(src);
}

var btnClick = function(e){
	var src = $(e).children()[0].src
	var n = src.substr(src.length - 5, 1);
	switch(n){
		case '1':
			paintBucketApp.reset();
			break;
		case '2':
			paintBucketApp.download();
			break;
		case '3':
			paintBucketApp.print();
			break;
	}
}

var isFooterHide = false;
var footRibbonClick = function(e){
	isFooterHide = !isFooterHide;
	var img = $(e).children()[0];
	img.src = "image/btn-footer" + (!isFooterHide? 2 : 1) + ".png";
	$(".footer").animate({ "top": (!isFooterHide?'-':'+') + "=50px" }, "fast" );
}

var backClick = function(e){
	$(".playing").hide();
}

var isMenuHide = true;
var menuClick = function(e){
	isMenuHide = !isMenuHide;
	var menu = $("#menu");
	var height = menu.height();
	menu.animate({ "top": (isMenuHide?'-':'+') + "=" + height + "px" }, "fast" );
}

var colorClick = function(color, i){
	paintBucketApp.setCurColor(color);
	$(".color-item").css('border', '0');
	$(".color-item-" + i).css('border', '3px dotted #7ab800');
}

var eraseClick = function(){
	$(".color-item").css('border', '0');
	paintBucketApp.setCurColor('ffffff');
}

$(document).ready(function(){
	var div = $("#color-container");
	var colors = ['00ff00','ff69b4','ff7f00','ffff00','964b00','000000','ff0000','0000ff'];
	for(var i in colors)
		div.append('<a style="background: #' + colors[i] + 
			';" class="color-item color-item-' + i + '" href="#" onclick="colorClick(\'' + 
			colors[i] + '\', ' + i + ');"></a>');
});