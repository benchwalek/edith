// TODO
// make implementation more flexible, for color dithering support: mono arrays, rgb arrays, drop alpha
// multiple grey levels
// color dithering
// canvas drawing instead of embed (performance?)
// more dither methods: riemersma, ordered, blue noise, ordered+error diff, error diff w/ random element
// add exposure compensation / contrast
// style
// fix #inimg dimension change when adding image

// format: rx, ry, weight
let dither_kernels = {
	"floyd-steinberg": 
	[[ 1,0,7/16],
	 [-1,1,3/16],
	 [ 0,1,5/16],
	 [ 1,1,1/16]],
	"shiau-fan": 
	[[ 1,0,8/16],
	 [-3,1,1/16],
	 [-2,1,1/16],
	 [-1,1,2/16],
	 [ 0,1,4/16]],
	"atkinson": 
	[[ 1,0,1/8],
	 [ 2,0,1/8],
	 [-1,1,1/8],
	 [ 0,1,1/8],
	 [ 1,1,1/8],
	 [ 0,2,1/8]],
	"jarvis-judice-ninke":
	[[ 1,0,7/48],
	 [ 2,0,5/48],
	 [-2,1,3/48],
	 [-1,1,5/48],
	 [ 0,1,7/48],
	 [ 1,1,5/48],
	 [ 2,1,3/48],
	 [-2,2,1/48],
	 [-1,2,3/48],
	 [ 0,2,5/48],
	 [ 1,2,3/48],
	 [ 2,2,1/48]],
	"stucki":
	[[ 1,0,8/42],
	 [ 2,0,4/42],
	 [-2,1,2/42],
	 [-1,1,4/42],
	 [ 0,1,8/42],
	 [ 1,1,4/42],
	 [ 2,1,2/42],
	 [-2,2,1/42],
	 [-1,2,2/42],
	 [ 0,2,4/42],
	 [ 1,2,2/42],
	 [ 2,2,1/42]],
}

let bayer_matrices = { "bayer1": new bayerTexture( 4,  Uint8Array.of(0,128,32,160,192,64,224,96,48,176,16,144,240,112,208,80)),
					   "bayer2": new bayerTexture( 8,  Uint8Array.of(0,128,32,160,8,136,40,168,192,64,224,96,200,72,232,104,48,176,16,144,56,184,24,152,240,112,208,80,248,120,216,88,12,140,44,172,4,132,36,164,204,76,236,108,196,68,228,100,60,188,28,156,52,180,20,148,252,124,220,92,244,116,212,84)),
					   "bayer3": new bayerTexture( 16, Uint8Array.of(0,128,32,160,8,136,40,168,2,130,34,162,10,138,42,170,192,64,224,96,200,72,232,104,194,66,226,98,202,74,234,106,48,176,16,144,56,184,24,152,50,178,18,146,58,186,26,154,240,112,208,80,248,120,216,88,242,114,210,82,250,122,218,90,12,140,44,172,4,132,36,164,14,142,46,174,6,134,38,166,204,76,236,108,196,68,228,100,206,78,238,110,198,70,230,102,60,188,28,156,52,180,20,148,62,190,30,158,54,182,22,150,252,124,220,92,244,116,212,84,254,126,222,94,246,118,214,86,3,131,35,163,11,139,43,171,1,129,33,161,9,137,41,169,195,67,227,99,203,75,235,107,193,65,225,97,201,73,233,105,51,179,19,147,59,187,27,155,49,177,17,145,57,185,25,153,243,115,211,83,251,123,219,91,241,113,209,81,249,121,217,89,15,143,47,175,7,135,39,167,13,141,45,173,5,133,37,165,207,79,239,111,199,71,231,103,205,77,237,109,197,69,229,101,63,191,31,159,55,183,23,151,61,189,29,157,53,181,21,149,255,127,223,95,247,119,215,87,253,125,221,93,245,117,213,85))}


function bayerTexture(size, array)
{
	this.size = size
	this.array = array
}

bayerTexture.prototype.at = function(x, y) {
	x %= this.size
	y %= this.size
	return this.array[y*this.size+x]
}

var original_image = null

function bayer_dither(pixels, threshold_map) {
	for (var row = 0; row < pixels.height; row++) {
		for (var col = 0; col < pixels.width; col++) {
			var color = pixels.getPixel(col, row, 0)

			if (color > threshold_map.at(col, row))
				pixels.setPixel(col, row, 255)
			else
				pixels.setPixel(col, row, 0)
		}
	}
}


window.onload = function () {
	document.getElementById("drop-zone").addEventListener("dragover", dragOverHandler)
	document.getElementById("drop-zone").addEventListener("drop", dropHandler)
	document.getElementById("options").addEventListener("change", () => process())
	document.getElementById("reset_input_button").addEventListener("click", unloadImage)
	document.getElementById("file_input").addEventListener("change", openHandler)
}

function dragOverHandler(ev) {
	ev.preventDefault()
}

function dropHandler(ev) {
	ev.preventDefault();

	[...ev.dataTransfer.items].forEach((item, i) =>
	{	
		if (item.kind === "file") {
			loadImage(item.getAsFile())
		}
	})
}

function openHandler(ev) {
	loadImage(this.files[0])
}

function process() {
	if (original_image == null)
		return

	ctx = document.createElement('canvas').getContext('2d')

	// resize
	var size = parseInt(document.getElementById("size_input").value)
	var [width, height] = [original_image.width, original_image.height]

	if  (isNaN(size) || size > Math.max(width, height) || size <= 0)
		size = Math.max(width, height)
	document.getElementById("size_input").value = size

	var new_width, new_height
	if (width > height)
		[new_width, new_height] = [size, Math.floor(size*height/width)]
	else
		[new_width, new_height] = [Math.floor(size*width/height), size]

	ctx.canvas.width = new_width
	ctx.canvas.height = new_height
	ctx.drawImage(original_image, 0, 0, new_width, new_height)
	image_data = ctx.getImageData(0, 0, new_width, new_height)

	var method = document.getElementById("method_dropdown").value


	pixels = new MonochromePixelData(image_data, new_width, new_height)
	pixels.inplaceMap = function (f) { 
								for (var i = 0; i < this.data.length; i++)
									this.data[i] = f(this.data[i])
						}

	pixels.inplaceMap(srgbToLinear)
	if (method.includes("bayer"))
		bayer_dither(pixels, bayer_matrices[method])
	else
		dither(pixels, dither_kernels[method])
	pixels.inplaceMap(linearToSrgb)

	ctx.putImageData(pixels.asImageData(),0,0)
	document.getElementById("outimg").src = ctx.canvas.toDataURL()
}

function loadImage(file) {
	var fr = new FileReader();
	fr.onload = function () {
		window.createImageBitmap(file).then(bitmap => {original_image = bitmap; process()})
		document.getElementById("inimg").src = fr.result;
		document.getElementById("drop_here_text").classList.add("hidden"); 
		document.getElementById("reset_input_button").disabled=false;
	}
	fr.readAsDataURL(file);
}

function unloadImage() {
	original_image=null;
	document.getElementById("outimg").src = ""
	document.getElementById("inimg").src = ""
	document.getElementById("drop_here_text").classList.remove("hidden");
	document.getElementById("reset_input_button").disabled=true;
}

function srgbToLinear(s) {
	s/=256
	return (s <= .04045 ? s/12.92 : Math.pow(((s+0.055)/1.055), 2.4))*256
}

function linearToSrgb(l) {
	l/=256
	return (l <= .0031308 ? l*12.92 : 1.055*Math.pow(l, 2.4) - 0.055)*256
}

function PixelData(image_data, width, height) {
	this.image_data = image_data
	this.data = image_data.data
	this.width = width
	this.height = height
}
PixelData.prototype.setPixel = function(x,y,c,v) {
	this[y*this.width*4+x*4+c] = v
}
PixelData.prototype.getPixel = function(x,y,c) {
	return this[y*this.width*4+x*4+c]
}
PixelData.prototype.asImageData = function() {
	image_data.data = this.data
	return image_data
}
function MonochromePixelData(image_data_array, width, height) {
	this.image_data = image_data
	new_array = []
	for (var i = 0; i < image_data.data.length; i+=4) {
		new_array.push((image_data.data[i]+image_data.data[i+1]+image_data.data[i+2])/3)
	}
	this.data = new_array
	this.width = width
	this.height = height
}
MonochromePixelData.prototype.setPixel = function(x,y,v) {
	this.data[y*this.width+x] = v
}
MonochromePixelData.prototype.getPixel = function(x,y,c) {
	return this.data[y*this.width+x]
}
MonochromePixelData.prototype.asImageData = function() {
	for (var i = 0; i < this.data.length; i++) {
		image_data.data[i*4+0] = this.data[i]
		image_data.data[i*4+1] = this.data[i]
		image_data.data[i*4+2] = this.data[i]
		image_data.data[i*4+3] = 255
	}
	return image_data
}
MonochromePixelData.prototype.inplaceMap = function(f) {
	for (var i = 0; i < this.data.length; i++)
		this.data[i] = f(this.data[i])
}

function dither(pixels, kernel) {
	var kernel_rows = Math.max(...kernel.map(el => el[1]))+1

	var e = []
	for (var i = 0; i < kernel_rows; i++)
		e.push(new Array(pixels.width).fill(0.))

	for (var row = 0; row < pixels.height; row++) {
		e[e.length] = new Array(pixels.width).fill(0.)
		for (var col = 0; col < pixels.width; col++) {
			var color = pixels.getPixel(col, row, 0)

			var err = 0
			if (color+e[0][col] > 127) {
				pixels.setPixel(col, row, 255)
				err = color+e[0][col]-255
			} else {
				pixels.setPixel(col, row, 0)
				err = color+e[0][col]
			}

			for (k of kernel) {
				e[k[1]][col+k[0]] += k[2] * err
			}
		}
		e.shift()
	}
}

// function find_threshold(image) {
// 	h = new Array(256).fill(0)
// 	image.scan(0, 0, image.bitmap.width, image.bitmap.width, (x,y,idx) => h[image.bitmap.data[idx]]++)

// 	sum = 0;
// 	for (var t=0 ; t<256 ; t++) sum += t * h[t];

// 		var_max = 0
// 	wb = 0, wf = 0
// 	sum_b = 0
// 	total = image.bitmap.width * image.bitmap.height
// 	for (var t = 0; t < h.length; t++) {
// 	   wb += h[t];               // Weight Background
// 	   if (wb == 0) continue;

// 	   wf = total - wb;                 // Weight Foreground
// 	   if (wf == 0) break;

// 	   sum_b += t * h[t]

// 	   mb = sum_b / wb;            // Mean Background
// 	   mf = (sum - sum_b) / wf;    // Mean Foreground

// 	   // Calculate Between Class Variance
// 	   variance = wb * wf * (mb - mf) * (mb - mf);

// 	   // Check if new maximum found
// 	   if (variance > var_max) {
// 	   	var_max = variance
// 	   	threshold = t;
// 	   }
// 	}
// 	return threshold
// }
