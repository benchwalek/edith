// format: rx, ry, weight
var dither_kernels = {
	"floyd-steinberg": 
	[			 			 [ 1,0,7/16],
	 [-1,1,3/16],[ 0,1,5/16],[ 1,1,1/16]],
	"shiau-fan": 
	[												  [ 1,0,8/16],
	 [-3,1,1/16],[-2,1,1/16],[-1,1,2/16],[ 0,1,4/16]],
	"atkinson": 
	[					   [ 1,0,1/8],[ 2,0,1/8],
	 [-1,1,1/8],[ 0,1,1/8],[ 1,1,1/8],
	 			[ 0,2,1/8]],
	"jarvis-judice-ninke":
	[									 [ 1,0,7/48],[ 2,0,5/48],
	 [-2,1,3/48],[-1,1,5/48],[ 0,1,7/48],[ 1,1,5/48],[ 2,1,3/48],
	 [-2,2,1/48],[-1,2,3/48],[ 0,2,5/48],[ 1,2,3/48],[ 2,2,1/48]],
	"stucki":
	[									 [ 1,0,8/42],[ 2,0,4/42],
	 [-2,1,2/42],[-1,1,4/42],[ 0,1,8/42],[ 1,1,4/42],[ 2,1,2/42],
	 [-2,2,1/42],[-1,2,2/42],[ 0,2,4/42],[ 1,2,2/42],[ 2,2,1/42]],
}

var bayer_matrices = { "bayer1": new bayerTexture( 4,  Uint8Array.of(0,128,32,160,192,64,224,96,48,176,16,144,240,112,208,80)),
					   "bayer2": new bayerTexture( 8,  Uint8Array.of(0,128,32,160,8,136,40,168,192,64,224,96,200,72,232,104,48,176,16,144,56,184,24,152,240,112,208,80,248,120,216,88,12,140,44,172,4,132,36,164,204,76,236,108,196,68,228,100,60,188,28,156,52,180,20,148,252,124,220,92,244,116,212,84)),
					   "bayer3": new bayerTexture( 16, Uint8Array.of(0,128,32,160,8,136,40,168,2,130,34,162,10,138,42,170,192,64,224,96,200,72,232,104,194,66,226,98,202,74,234,106,48,176,16,144,56,184,24,152,50,178,18,146,58,186,26,154,240,112,208,80,248,120,216,88,242,114,210,82,250,122,218,90,12,140,44,172,4,132,36,164,14,142,46,174,6,134,38,166,204,76,236,108,196,68,228,100,206,78,238,110,198,70,230,102,60,188,28,156,52,180,20,148,62,190,30,158,54,182,22,150,252,124,220,92,244,116,212,84,254,126,222,94,246,118,214,86,3,131,35,163,11,139,43,171,1,129,33,161,9,137,41,169,195,67,227,99,203,75,235,107,193,65,225,97,201,73,233,105,51,179,19,147,59,187,27,155,49,177,17,145,57,185,25,153,243,115,211,83,251,123,219,91,241,113,209,81,249,121,217,89,15,143,47,175,7,135,39,167,13,141,45,173,5,133,37,165,207,79,239,111,199,71,231,103,205,77,237,109,197,69,229,101,63,191,31,159,55,183,23,151,61,189,29,157,53,181,21,149,255,127,223,95,247,119,215,87,253,125,221,93,245,117,213,85))}

var palettes_packed = {
	"bw": [0x000000, 0xffffff],
	"apple2": [0x000000, 0x515c16, 0x843d52, 0xea7d27, 0x514888, 0xe85def, 0xf5b7c9, 0x006752, 0x00c82c, 0x919191, 0xc9d199, 0x00a6f0, 0x98dbc9, 0xc8c1f7, 0xffffff],
	"afr-32": [0xecebe7, 0xcbc6c1, 0xb28b78, 0x847066, 0x695b59, 0x4f4240, 0x352f2e, 0x723012, 0x845425, 0xa76343, 0xdc6a36, 0xf682bf, 0xd74060, 0xc5452b, 0xb02222, 0x8d1931, 0x6a1325, 0x3e1909, 0x406a3b, 0x76771d, 0x939446, 0xd3bd46, 0x99e0a8, 0x399a4d, 0x204f1a, 0x0f2c0c, 0x1a0a01, 0x14266a, 0x194f80, 0x2067a7, 0x49a3b4, 0x1de9de],
	"cc-29": [0xf2f0e5, 0xb8b5b9, 0x868188, 0x646365, 0x45444f, 0x3a3858, 0x212123, 0x352b42, 0x43436a, 0x4b80ca, 0x68c2d3, 0xa2dcc7, 0xede19e, 0xd3a068, 0xb45252, 0x6a536e, 0x4b4158, 0x80493a, 0xa77b5b, 0xe5ceb4, 0xc2d368, 0x8ab060, 0x567b79, 0x4e584a, 0x7b7243, 0xb2b47e, 0xedc8c4, 0xcf8acb, 0x5f556a ],
	"nopal-12": [0xe2e4df, 0xc5cfc4, 0xa8b5ae, 0x92929c, 0xffeced, 0xfbd4d2, 0xf1b4b4, 0xcca3a3, 0xf1eab6, 0xe4dba0, 0xcac18a, 0xaba47b],
	"steam-lords": [0x213b25, 0x3a604a, 0x4f7754, 0xa19f7c, 0x77744f, 0x775c4f, 0x603b3a, 0x3b2137, 0x170e19, 0x2f213b, 0x433a60, 0x4f5277, 0x65738c, 0x7c94a1, 0xa0b9ba, 0xc0d1cc]
}


var default_palette = packedRGBtoArray(palettes_packed["bw"])
var palette
var spread

var dist3 = euclidean_dist3
var generatePalette = medianCutPalette

var original_image = null
var original_filename = ""

var output_ctx

window.onload = function () {
	setPalette(default_palette)
	document.getElementById("drop-zone").addEventListener("dragover", dragOverHandler)
	document.getElementById("drop-zone").addEventListener("drop", dropHandler)
	document.querySelectorAll(".process-on-change").forEach(e => e.addEventListener("change", () => process()))
	document.getElementById("reset_input_button").addEventListener("click", unloadImage)
	document.getElementById("download_button").addEventListener("click", downloadResult)
	document.getElementById("file_input").addEventListener("change", openHandler)
	document.getElementById("exposure_slider").labels[0].addEventListener("dblclick", () => {document.getElementById("exposure_slider").value = 0; process()})
	document.getElementById("contrast_slider").labels[0].addEventListener("dblclick", () => {document.getElementById("contrast_slider").value = 0; process()})
	document.getElementById("k_means_button").addEventListener("click", runQuantization)
	document.getElementById("load_palette_button").addEventListener("click", loadPalette)

	function setColorTab(ev) {
		this.parentNode.querySelector(".active").classList.remove("active")
		this.parentNode.parentNode.querySelectorAll(".tab-content").forEach(e => e.classList.add("hidden"))
		var own_id = this.id
		this.classList.add("active")
		// document.querySelectorAll(".tab-content").forEach(e => e.classList.add("hidden"))
		console.log(own_id)
		document.getElementsByClassName(own_id)[0].classList.remove("hidden")
	}

	document.getElementById("from-palette-tab").addEventListener("click", setColorTab)
	document.getElementById("from-image-tab").addEventListener("click", setColorTab)
	document.getElementById("preprocessing-tab").addEventListener("click", setColorTab)
	document.getElementById("dithering-tab").addEventListener("click", setColorTab)

	visualizePalette()
}

function process() {
	if (original_image == null)
		return
	if (output_ctx == null)
		output_ctx = document.createElement('canvas').getContext('2d')

	// resize
	var size = parseInt(document.getElementById("size_input").value)
	if  (isNaN(size) || size > Math.max(original_image.width, original_image.height) || size <= 0)
		size = Math.max(original_image.width, original_image.height)
	document.getElementById("size_input").value = size

	var image_data = getResizedImageData(original_image, output_ctx, size)
	var method = document.getElementById("method_dropdown").value

	var pixels = new PixelData(image_data)

	var contrast = document.getElementById("contrast_slider").value
	pixels.inplaceMap(x => (x-128)*Math.pow(2, parseFloat(contrast))+128)

	var exposure = document.getElementById("exposure_slider").value
	pixels.inplaceMap(x => x+parseInt(exposure))

	pixels.inplaceMap(srgbToLinear)

	switch (method) {
	case "random":
		random_dither(pixels)
		break;
	case "bayer1":
	case "bayer2":
	case "bayer3":
		bayer_dither(pixels, bayer_matrices[method])
		break;
	case "floyd-steinberg":
	case "shiau-fan":
	case "atkinson":
	case "jarvis-judice-ninke":
	case "stucki":
		diffusion_dither(pixels, dither_kernels[method])
		break;
	case "threshold":
		no_dither(pixels)
	}

	pixels.inplaceMap(linearToSrgb)

	output_ctx.putImageData(pixels.asImageData(),0,0)
	document.getElementById("outimg").src = output_ctx.canvas.toDataURL()
}

function srgbToLinear(s) {
	s/=256
	return (s <= .04045 ? s/12.92 : Math.pow(((s+0.055)/1.055), 2.4))*256
}

function linearToSrgb(l) {
	l/=256
	return (l <= .0031308 ? l*12.92 : 1.055*Math.pow(l, 1/2.4) - 0.055)*256
}

var rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
	const hex = Math.floor(x).toString(16)
	return hex.length === 1 ? '0' + hex : hex
}).join('')

const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))

function packedRGBtoArray(packed)
{
	var array = []
	for (var p of packed) {
		array.push([p>>16&0xFF, p>>8&0xFF, p&0xFF])
	}

	return array
}

function MortonToHilbert3D( morton, bits )
{
	var hilbert = morton;
	if( bits > 1 )
	{
		var block = ( ( bits * 3 ) - 3 );
		var hcode = ( ( hilbert >> block ) & 7 );
		var mcode, shift, signs;
		shift = signs = 0;
		while( block )
		{
			block -= 3;
			hcode <<= 2;
			mcode = ( ( 0x20212021 >> hcode ) & 3 );
			shift = ( ( 0x48 >> ( 7 - shift - mcode ) ) & 3 );
			signs = ( ( signs | ( signs << 3 ) ) >> mcode );
			signs = ( ( signs ^ ( 0x53560300 >> hcode ) ) & 7 );
			mcode = ( ( hilbert >> block ) & 7 );
			hcode = mcode;
			hcode = ( ( ( hcode | ( hcode << 3 ) ) >> shift ) & 7 );
			hcode ^= signs;
			hilbert ^= ( ( mcode ^ hcode ) << block );
		}
	}
	hilbert ^= ( ( hilbert >> 1 ) & 0x92492492 );
	hilbert ^= ( ( hilbert & 0x92492492 ) >> 1 );
	return( hilbert );
}

function linearToOklab(c) {
	c=c.map(v=>v/256)
	const l = 0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2];
	const m = 0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2];
	const s = 0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2];

	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);

	return [
		0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
		1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
		0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
		];
}

function oklabToLinear(c) {
	const l_ = c[0] + 0.3963377774 * c[1] + 0.2158037573 * c[2];
	const m_ = c[0] - 0.1055613458 * c[1] - 0.0638541728 * c[2];
	const s_ = c[0] - 0.0894841775 * c[1] - 1.2914855480 * c[2];

	const l = l_ * l_ * l_;
	const m = m_ * m_ * m_;
	const s = s_ * s_ * s_;

	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
		].map(v=>v*256);
}

function getBit(x, n)
{
	return (x&(1<<n))>>n
}

function setBit(x, n, b)
{
	return (x & ~(1<<n)) | (b<<n)
}
function mortonCode3d(c)
{
	var code = 0
	for (var b = 0; b < 24; b++) {
		var lb = Math.floor(b/3)
		code = setBit(code, 23-b, getBit(c[b%3], 7-lb))
	}
	return code
}

function colorSortHilbert(colors)
{
	var codes = []
	// colors are 8bit
	for (var c of colors) {
		codes.push([...c, MortonToHilbert3D(mortonCode3d(c), 8)])
	}
	codes.sort((a,b) => b[3]-a[3])

	for (var i = 0; i < codes.length; i++)
		codes[i] = codes[i].slice(0,3)
	return codes
}

function calculateSpread(palette)
{
	var sum = [0,0,0]
	for (var c of palette)
		sum = sum.map((v,i) => v+c[i])
	var mean = sum.map(v => v/palette.length)

	var sum_of_squares = 0
	for (var c of palette) {
		var diff = mean.map((v,i) => v-c[i])
		sum_of_squares += diff.map(v=>v*v).reduce((a,v)=>a+v)
	}
	var spread = Math.sqrt(sum_of_squares/palette.length)
	return spread
}

function weightedRandom(probabilities)
{
	var cumulative = probabilities.map((sum => v => sum += v)(0))
	var r = Math.random() * cumulative[cumulative.length-1]
	return cumulative.findIndex(v => r >= v)
}

function runQuantization() {
	var ctx = document.createElement('canvas').getContext('2d')
	var image_data = getResizedImageData(original_image, ctx, 100)

	var colors = []
	for (var i = 0; i < image_data.data.length; i+=4) {
		var [r,g,b] = image_data.data.slice(i,i+3)
		colors.push([r,g,b])
	}
	colors = colors.map(v=>v.map(srgbToLinear)).map(linearToOklab)

	var num_colors = document.getElementById("k_means_k").value
	var generatePalette = {"k-means": kMeansPalette, "median-cut": medianCutPalette}[document.getElementById("quantization_dropdown").value]
	var num_iterations = 50

	// TODO
	setPalette(generatePalette(num_colors, colors, num_iterations).map(oklabToLinear).map(v=>v.map(linearToSrgb)))
}

function medianCutPalette(num_colors, colors)
{
	// first box contains all colors
	var boxes = [colors]
	while (boxes.length < num_colors) {
		// find axis with the highest mean square error in any box
		var [max_box, max_axis, max_mse] = [0, 0, -1]
		for (var box_idx = 0; box_idx < boxes.length; box_idx++) {
			var box = boxes[box_idx]
			for (var axis = 0; axis < 3; axis++){
				// calculate mean of axis for box
				var sum = 0
				for (var i = 0; i < box.length; i++)
					sum += box[i][axis]
				var mu = sum / box.length
				// calculate mse
				var mse = 0
				for (var i = 0; i < box.length; i++)
					mse += (box[i][axis] - mu)*(box[i][axis] - mu)

				if (mse > max_mse) {
					max_mse = mse
					max_box = box_idx
					max_axis = axis
				}
			}
		}

		// sort the max_box by that max_axis (highest mse)
		boxes[max_box].sort((a,b) => a[max_axis]-b[max_axis])
		// split on median
		boxes.push(boxes[max_box].slice(Math.floor(boxes[max_box].length/2), boxes[max_box].length))
		boxes[max_box] = boxes[max_box].slice(0, Math.floor(boxes[max_box].length/2)-1)
	}

	// calculate the average for each box to get the final colors
	var output = []
	for (var box of boxes) {
		output.push(mean(box))
	}

	return output
}

function mean(color_array) {
	var sum = [0,0,0]
	for (var c of color_array)
		sum = sum.map((v,i) => v + c[i])

	return sum.map(v => v/color_array.length)
}

function setPalette(pal)
{
	palette = pal
	palette = palette.map(v=>v.map(srgbToLinear))

	spread = calculateSpread(palette)

	palette = colorSortHilbert(palette)
	visualizePalette()
	process()
}

function loadPalette()
{
	var pal = document.getElementById("palette_dropdown").value

	setPalette(packedRGBtoArray(palettes_packed[pal]))
}

function kMeansPalette(k, colors, iterations)
{
	// k-means++
	// choose first center randomly
	var centers = []
	centers.push(colors[Math.floor(Math.random() * colors.length)])

	// for each color c, calculate distance between nearest center
	while (centers.length < k) {
		var distances = []
		for (var i = 0; i < colors.length; i++) {
			var minDistanceToCenter = Infinity
			for (var j = 0; j < centers.length; j++) {
				var distance = dist3(colors[i], centers[j]) 
				if (distance < minDistanceToCenter)
					minDistanceToCenter = distance
			}
			distances[i] = minDistanceToCenter
		}

		// for (var c of colors)
		// 	distances.push(centers.map(center => dist3(center, c)).reduce((a,v) => Math.min(a,v)))
		centers.push(colors[weightedRandom(distances)])
	}

	function categorizeToCenter(color, centers) {
		return argmin(centers.map(c => dist3(c, color)))
	}

	function mean(color_array) {
		if (color_array.length == 0)
			return colors[Math.floor(Math.random() * colors.length)]

		var sum = [0,0,0]
		for (var c of color_array)
			sum = sum.map((v,i) => v + c[i])

		return sum.map(v => v/color_array.length)
	}

	for (var iter = 0; iter < iterations; iter++) {
		var bins = []

		// set up categories
		for (var i = 0; i < k; i++)
			bins.push([])

		for (var c of colors)
			bins[categorizeToCenter(c, centers)].push(c)

		for (var i = 0; i < k; i++) {
			// calculate mean and save as new center
			centers[i] = mean(bins[i])
		}
	}

	return centers
}

function argmin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

function dist1(c1, c2) {
	return Math.abs(c1-c2)
}

function euclidean_dist3(c1, c2) {
	var dr=c1[0]-c2[0]
	var dg=c1[1]-c2[1]
	var db=c1[2]-c2[2]
	return (dr*dr + dg*dg + db*db)
}

function simple_dist3(c1, c2) {
  const r_mean = (c1[0] + c2[0]) / 2;
  var dr=c1[0]-c2[0]
  var dg=c1[1]-c2[1]
  var db=c1[2]-c2[2]
  return Math.sqrt((2 + r_mean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - r_mean) / 256) * db * db);
}

function find_nearest_color(color, palette)
{
	var dist = typeof color == "number" ? dist1 : dist3
	return palette[argmin(palette.map(c => dist(c, color)))]
}

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

function visualizePalette()
{
	var pickers = []
	for (var i = 0; i < palette.length; i++) {
		// console.log(rgbToHex(...color.map(linearToSrgb)))
		var picker = document.createElement("input")
		picker.type = "color"
		picker.value = rgbToHex(...palette[i].map(linearToSrgb))
		picker.addEventListener("change", ((i) => function (ev) {palette[i] = hexToRgb(this.value).map(srgbToLinear); process()})(i))
		pickers.push(picker)
	}
	document.getElementById("palette").replaceChildren(...pickers)
}

function dragOverHandler(ev) {
	ev.preventDefault()
}

function dropHandler(ev) {
	ev.preventDefault();

	var item = ev.dataTransfer.items[0]
	var filename = ev.dataTransfer.files[0].name
	if (item.kind === "file") {
		loadImage(filename, item.getAsFile())
	}
}

function openHandler(ev) {
	loadImage(this.files[0].name, this.files[0])
}

function getResizedImageData(img, ctx, long_edge) {
	var new_width, new_height
	if (img.width > img.height)
		[new_width, new_height] = [long_edge, Math.floor(long_edge*img.height/img.width)]
	else
		[new_width, new_height] = [Math.floor(long_edge*img.width/img.height), long_edge]
	ctx.canvas.width = new_width
	ctx.canvas.height = new_height
	ctx.drawImage(original_image, 0, 0, new_width, new_height)
	return ctx.getImageData(0, 0, new_width, new_height)
}

function loadImage(filename, file) {
	var fr = new FileReader();
	original_filename = filename
	fr.onload = function () {
		window.createImageBitmap(file).then(bitmap => {original_image = bitmap; process()})
		document.getElementById("inimg").src = fr.result;
		document.getElementById("drop_here_text").classList.add("hidden"); 
		document.getElementById("reset_input_button").disabled=false;
		document.getElementById("download_button").disabled=false;
	}
	fr.readAsDataURL(file);
}

function unloadImage() {
	original_image=null;
	original_filename=null;
	document.getElementById("outimg").src = ""
	document.getElementById("inimg").src = ""
	document.getElementById("drop_here_text").classList.remove("hidden");
	document.getElementById("download_button").disabled=true;
	document.getElementById("reset_input_button").disabled=true;
}

function downloadResult() {
    var a = document.createElement("a");
    output_ctx.canvas.toBlob(blob => {
    	a.href = URL.createObjectURL(blob)
	    a.download = "edith " + original_filename;
	    a.click();
	    URL.revokeObjectURL(a.href)
    })
}


function bayer_dither(pixels, threshold_map) {
	for (var row = 0; row < pixels.height; row++) {
		for (var col = 0; col < pixels.width; col++) {
			var color = pixels.getPixel(col, row, 0).map((v) => v-spread*(threshold_map.at(col,row)/256-.5))
			var nearest = find_nearest_color(color, palette)
			pixels.setPixel(col, row, nearest)
		}
	}
}

function no_dither(pixels) {
	for (var row = 0; row < pixels.height; row++) {
		for (var col = 0; col < pixels.width; col++) {
			var color = pixels.getPixel(col, row, 0)
			var nearest = find_nearest_color(color, palette)
			pixels.setPixel(col, row, nearest)
		}
	}
}

function random_dither(pixels) {
	for (var row = 0; row < pixels.height; row++) {
		for (var col = 0; col < pixels.width; col++) {
			var color = pixels.getPixel(col, row)
			var nearest = find_nearest_color(color.map(v => v - (Math.random()-.5)*spread), palette)

			pixels.setPixel(col, row, nearest)
		}
	}
}

function diffusion_dither(pixels, kernel) {
	var kernel_rows = Math.max(...kernel.map(el => el[1]))+1

	var e = []
	for (var i = 0; i < kernel_rows; i++) {
		var tmp = new Array(pixels.width)
		for (var j = 0; j < tmp.length; j++)
			tmp[j] = [0,0,0]
		e.push(tmp)
	}

	for (var row = 0; row < pixels.height; row++) {
		e.push([])
		for (var i = 0; i < pixels.width; i++)
			e[e.length-1].push([0,0,0])

		for (var col = 0; col < pixels.width; col++) {
			var color = pixels.getPixel(col, row)

			var adj_color = color.map((v,i) => v+e[0][col][i])

			var nearest = find_nearest_color(adj_color, palette)
			pixels.setPixel(col, row, nearest)
			var err = Array.from(adj_color).map((v,i) => v-nearest[i])


			for (var k of kernel) {
				if (col+k[0] < 0 || col+k[0] >= pixels.width)
					continue
				for (var j = 0; j < e[k[1]][col+k[0]].length; j++)
					e[k[1]][col+k[0]][j] += err[j]*k[2]
				// e[k[1]][col+k[0]] = e[k[1]][col+k[0]].map((v,i) => v+err.map((w) => w*k[2])[i])
			}
		}
		e.shift()
	}
}

function PixelData(image_data) {
	this.image_data = image_data
	this.data = image_data.data
	this.width = image_data.width
	this.height = image_data.height
}
PixelData.prototype.setPixel = function(x,y,v) {
	if (typeof v == "number") {
		this.image_data.data[y*this.width*4+x*4+0] = v
		this.image_data.data[y*this.width*4+x*4+1] = v
		this.image_data.data[y*this.width*4+x*4+2] = v
	} else {
		this.image_data.data[y*this.width*4+x*4+0] = v[0]
		this.image_data.data[y*this.width*4+x*4+1] = v[1]
		this.image_data.data[y*this.width*4+x*4+2] = v[2]
	}
}
PixelData.prototype.getPixel = function(x,y) {
	var index = y*this.width*4+x*4
	return this.image_data.data.slice(index, index+3)
}
PixelData.prototype.asImageData = function() {
	this.image_data.data = this.data
	return this.image_data
}
PixelData.prototype.inplaceMap = function(f) {
	for (var i = 0; i < this.data.length; i++)
		if (i%4!=3)
			this.data[i] = f(this.data[i])
}
function MonochromePixelData(image_data) {
	this.image_data = image_data
	new_array = []
	for (var i = 0; i < image_data.data.length; i+=4) {
		new_array.push((image_data.data[i]+image_data.data[i+1]+image_data.data[i+2])/3)
	}
	this.data = new_array
	this.width = image_data.width
	this.height = image_data.height
}
MonochromePixelData.prototype.setPixel = function(x,y,v) {
	this.data[y*this.width+x] = v
}
MonochromePixelData.prototype.getPixel = function(x,y) {
	return this.data[y*this.width+x]
}
MonochromePixelData.prototype.asImageData = function() {
	for (var i = 0; i < this.data.length; i++) {
		this.image_data.data[i*4+0] = this.data[i]
		this.image_data.data[i*4+1] = this.data[i]
		this.image_data.data[i*4+2] = this.data[i]
		this.image_data.data[i*4+3] = 255
	}
	return this.image_data
}
MonochromePixelData.prototype.inplaceMap = function(f) {
	for (var i = 0; i < this.data.length; i++)
		this.data[i] = f(this.data[i])
}