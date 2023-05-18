// TODO
// make implementation more flexible, for color dithering support
// multiple grey levels
// color dithering
// more dither methods
// interface:
// add exposure
// srgb
// style

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

var original_image = null

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
		[new_width, new_height] = [size, size*height/width]
	else
		[new_width, new_height] = [size*width/height, size]

	ctx.canvas.width = new_width
	ctx.canvas.height = new_height
	ctx.drawImage(original_image, 0, 0, new_width, new_height)
	image_data = ctx.getImageData(0, 0, new_width, new_height)

	for (var i = 0; i < image_data.data.length; i++)
		image_data.data[i] = (image_data.data[i] + image_data.data[i+1] + image_data.data[i+2])/3

	kernel = dither_kernels[document.getElementById("method_dropdown").value]

	// in-place
	image_data.width = new_width
	image_data.height = new_height
	dither(image_data, kernel)

	ctx.putImageData(image_data,0,0)
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

function dither(image, kernel) {
	var kernel_rows = Math.max(...kernel.map(el => el[1]))+1

	var e = []
	for (var i = 0; i < kernel_rows; i++)
		e.push(new Array(image.width).fill(0.))

	function getPixel(x,y,c) { return image.data[y*image.width*4+x*4+c]}
	function setPixel(x,y,c,v) { image.data[y*image.width*4+x*4+c] = v}
	// TODO
	function getPixelM(x,y) { return getPixel(x,y,0) }
	function setPixelM(x,y,v) { setPixel(x,y,0,v);
	setPixel(x,y,1,v);
	setPixel(x,y,2,v);
	setPixel(x,y,3,255); }


	for (var row = 0; row < image.height; row++) {
		e[e.length] = new Array(image.width).fill(0.)
		for (var col = 0; col < image.width; col++) {
			var color = getPixel(col, row, 0)

			var err = 0
			if (color+e[0][col] > 127) {
				setPixelM(col, row, 255)
				err = color+e[0][col]-255
			} else {
				setPixelM(col, row, 0)
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
