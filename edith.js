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

var threshold_maps = { "bayer1": new thresholdTexture( 4,  Uint8Array.of(0,128,32,160,192,64,224,96,48,176,16,144,240,112,208,80)),
					   "bayer2": new thresholdTexture( 8,  Uint8Array.of(0,128,32,160,8,136,40,168,192,64,224,96,200,72,232,104,48,176,16,144,56,184,24,152,240,112,208,80,248,120,216,88,12,140,44,172,4,132,36,164,204,76,236,108,196,68,228,100,60,188,28,156,52,180,20,148,252,124,220,92,244,116,212,84)),
					   "bayer3": new thresholdTexture( 16, Uint8Array.of(0,128,32,160,8,136,40,168,2,130,34,162,10,138,42,170,192,64,224,96,200,72,232,104,194,66,226,98,202,74,234,106,48,176,16,144,56,184,24,152,50,178,18,146,58,186,26,154,240,112,208,80,248,120,216,88,242,114,210,82,250,122,218,90,12,140,44,172,4,132,36,164,14,142,46,174,6,134,38,166,204,76,236,108,196,68,228,100,206,78,238,110,198,70,230,102,60,188,28,156,52,180,20,148,62,190,30,158,54,182,22,150,252,124,220,92,244,116,212,84,254,126,222,94,246,118,214,86,3,131,35,163,11,139,43,171,1,129,33,161,9,137,41,169,195,67,227,99,203,75,235,107,193,65,225,97,201,73,233,105,51,179,19,147,59,187,27,155,49,177,17,145,57,185,25,153,243,115,211,83,251,123,219,91,241,113,209,81,249,121,217,89,15,143,47,175,7,135,39,167,13,141,45,173,5,133,37,165,207,79,239,111,199,71,231,103,205,77,237,109,197,69,229,101,63,191,31,159,55,183,23,151,61,189,29,157,53,181,21,149,255,127,223,95,247,119,215,87,253,125,221,93,245,117,213,85)),
					   "blue_noise": new thresholdTexture(64, Uint8Array.of(161,59,143,107,200,120,80,11,190,233,4,175,149,45,126,100,40,180,226,151,188,239,89,54,107,13,133,39,118,178,87,133,175,26,153,184,73,207,21,191,232,171,102,52,224,136,65,104,16,226,178,3,156,58,97,11,162,249,94,211,164,55,186,39,247,96,211,72,253,35,226,169,65,155,125,219,94,252,72,203,160,62,92,23,74,41,205,172,251,215,84,235,66,205,34,232,112,244,60,2,230,104,161,83,115,39,200,126,79,167,237,182,49,139,85,110,197,246,142,215,111,133,46,16,78,232,140,83,123,26,185,3,158,91,135,25,208,99,36,69,19,187,142,25,237,130,194,254,161,114,144,21,125,48,154,183,0,141,160,49,79,197,99,169,132,35,253,53,216,150,15,250,35,208,5,121,200,255,64,215,42,76,178,34,64,234,183,153,118,204,19,176,52,150,223,133,55,189,215,111,51,244,195,133,235,114,54,211,84,8,45,101,213,2,230,77,196,102,28,212,113,94,224,183,10,138,43,221,85,195,144,7,183,72,135,176,98,55,150,90,31,165,18,128,170,9,122,86,202,2,90,221,35,65,103,236,202,77,36,109,231,16,70,166,144,9,173,85,158,5,174,104,155,223,172,139,60,180,97,39,239,168,136,75,248,18,62,123,252,159,204,16,122,62,225,112,93,235,29,218,116,192,240,72,220,106,151,240,95,225,188,253,145,169,58,131,251,193,138,7,115,160,243,86,174,124,248,33,225,105,59,206,44,221,75,246,38,115,69,236,30,131,207,151,63,6,227,53,163,189,207,88,28,103,73,241,185,23,170,45,205,159,57,82,11,161,22,136,181,57,196,34,62,154,23,49,102,31,213,107,13,166,89,219,58,186,20,199,45,148,97,202,76,129,254,28,146,123,197,20,141,188,13,199,84,245,15,117,191,98,179,120,24,133,40,152,228,179,48,110,154,82,246,134,13,119,243,198,130,229,103,42,248,1,85,140,212,113,74,206,129,230,185,156,79,48,180,31,248,98,135,68,216,5,60,181,20,160,188,89,229,61,98,181,52,217,95,124,162,50,174,81,253,43,211,79,242,104,220,65,128,12,235,139,35,212,102,63,190,38,89,172,46,70,207,170,125,210,109,234,14,181,241,167,10,83,56,21,239,117,226,148,127,12,225,159,111,234,154,118,215,51,0,116,169,15,241,131,81,253,153,40,228,109,216,28,129,159,13,148,49,174,3,191,85,210,165,67,193,1,165,230,151,221,137,3,254,154,25,91,61,149,36,165,55,131,34,93,149,249,122,198,141,207,0,75,205,53,179,35,84,190,41,246,81,140,240,202,42,216,155,32,173,3,66,194,16,70,141,200,60,227,108,195,232,90,158,249,51,113,25,94,254,119,44,79,24,107,66,188,100,120,192,223,14,238,188,77,203,103,225,63,204,43,173,98,33,61,106,169,233,90,118,252,17,138,99,24,173,103,64,152,84,110,71,199,120,100,212,129,175,249,97,1,171,77,37,134,22,67,124,33,145,196,224,133,52,214,186,127,247,197,157,30,234,50,79,138,175,98,121,6,254,156,17,175,115,4,217,72,162,255,190,38,22,143,198,70,170,212,62,194,226,11,218,29,130,181,9,220,50,235,145,25,85,47,151,235,116,188,246,97,213,183,223,104,173,7,75,178,158,18,92,147,7,51,216,77,142,209,22,248,44,67,221,143,46,84,195,135,241,88,143,234,16,131,83,154,62,242,7,130,44,237,113,156,48,116,167,195,230,55,250,139,88,184,43,241,113,182,208,30,54,146,9,168,47,143,14,61,242,91,233,30,107,242,60,222,170,101,122,181,8,170,127,103,160,206,27,182,105,213,29,71,45,188,23,116,202,49,228,114,166,185,104,221,86,145,3,83,251,137,72,93,20,157,101,35,167,11,78,163,202,12,69,134,221,88,203,69,114,255,86,207,128,155,48,210,69,132,202,29,74,230,40,250,94,60,228,191,2,90,129,245,61,152,231,111,163,211,63,170,92,179,9,214,39,77,26,161,193,34,178,207,19,188,37,243,122,210,68,196,115,208,227,55,129,91,245,105,163,19,240,132,32,192,161,45,23,201,115,146,182,12,163,113,189,136,17,154,195,117,29,74,141,232,41,170,8,125,185,15,252,101,149,39,244,69,147,95,200,134,238,56,118,247,67,130,105,224,150,57,176,2,144,239,22,134,98,154,32,219,172,42,197,58,102,179,222,0,107,231,184,76,4,252,92,231,46,88,245,56,206,82,45,240,165,204,52,180,111,75,225,91,52,139,81,28,224,128,212,26,121,251,5,109,151,208,16,97,218,46,171,87,24,205,109,229,89,51,171,67,254,3,193,61,143,6,121,231,147,43,80,152,67,136,94,165,217,37,62,122,215,147,1,166,119,225,145,18,85,121,253,13,217,155,199,33,237,203,160,58,186,1,107,192,164,57,176,231,45,73,175,135,159,9,237,62,125,166,75,35,184,113,218,37,186,120,233,108,81,251,181,72,24,207,123,239,198,29,247,56,107,141,172,199,27,71,186,99,31,66,187,102,214,36,149,94,62,20,136,101,174,7,117,245,91,143,76,47,225,86,210,22,94,194,244,39,77,202,141,182,255,11,213,152,247,9,142,94,161,75,44,177,206,30,93,216,162,96,174,15,53,159,121,20,195,240,10,101,159,241,129,211,254,173,10,237,140,70,175,197,118,168,250,57,127,74,209,42,173,230,201,155,16,137,66,162,123,145,3,114,234,94,28,108,44,139,99,54,124,73,197,238,14,210,147,17,126,157,51,132,9,248,64,111,228,86,213,178,81,127,68,231,42,89,17,47,83,137,116,52,200,4,240,27,227,84,40,191,223,22,141,106,13,64,30,118,237,103,196,249,29,226,64,206,171,53,196,226,79,190,232,23,204,173,32,60,131,102,248,59,219,103,240,198,42,140,220,31,187,145,8,49,227,31,150,188,120,222,144,194,160,26,228,92,164,128,107,48,133,208,2,146,96,180,233,167,217,132,254,83,181,41,134,82,48,185,100,153,22,127,150,0,119,168,66,156,243,90,118,224,187,38,165,88,190,1,73,115,168,87,182,125,72,244,105,136,165,96,214,57,6,167,65,108,214,69,183,36,219,81,193,158,69,176,112,242,65,32,87,48,76,192,163,53,215,11,108,222,169,119,13,253,86,222,63,247,38,217,17,110,45,144,4,154,80,215,22,139,237,37,179,222,17,54,211,3,160,42,209,66,255,18,180,110,247,200,34,240,3,125,250,145,17,59,247,13,233,90,46,159,205,119,248,153,24,112,3,96,147,174,60,18,149,210,76,192,36,178,102,162,203,93,134,186,227,70,182,246,51,111,180,71,118,160,132,92,254,152,108,231,94,196,25,119,187,86,140,40,78,132,98,151,52,172,78,110,201,169,98,147,32,185,221,23,131,7,189,99,206,239,128,226,33,242,203,91,37,233,56,141,115,211,20,77,142,56,241,81,12,211,101,24,129,225,8,200,47,214,63,27,194,71,35,134,62,174,145,223,5,54,236,156,219,12,182,230,90,208,20,47,227,122,42,213,113,137,63,100,173,226,60,137,44,168,63,198,78,121,153,248,132,108,174,4,245,50,129,236,6,192,31,173,119,157,40,202,170,92,145,251,105,11,233,144,113,177,239,203,15,249,77,99,163,199,103,26,191,115,69,22,195,130,238,159,86,2,176,73,238,10,192,255,38,79,161,14,221,87,19,143,179,7,51,183,73,24,202,95,152,72,167,200,115,157,99,221,51,254,137,73,239,58,32,77,164,183,96,204,48,5,84,156,111,48,130,28,242,70,127,168,58,249,143,164,39,102,64,141,189,251,134,197,51,165,86,148,116,198,244,125,184,108,252,40,224,103,212,15,223,157,237,42,187,221,32,89,47,249,67,145,19,87,190,2,119,155,192,229,134,22,68,247,159,126,223,32,189,229,177,150,43,215,10,229,93,36,213,82,243,177,10,220,33,59,94,25,107,209,30,217,1,54,97,25,66,157,194,132,71,168,117,88,137,59,119,82,132,10,110,230,182,12,210,124,200,163,106,228,47,218,13,111,52,210,120,26,89,196,65,142,96,67,0,208,108,182,84,147,198,126,4,112,56,210,124,81,113,165,223,150,244,126,69,134,233,179,152,209,236,48,4,95,234,30,149,253,38,194,214,25,250,148,205,69,130,152,40,80,235,59,33,176,82,131,172,89,243,146,177,222,44,174,243,20,216,123,245,87,138,59,253,27,52,176,233,190,145,26,162,203,238,15,187,76,7,178,46,161,100,74,39,129,83,115,214,163,55,201,73,170,107,1,160,63,177,95,51,173,24,242,104,174,6,117,245,144,205,27,65,198,40,1,72,104,138,8,112,166,49,152,35,195,15,163,120,206,105,153,65,91,41,254,97,66,42,130,53,116,217,93,203,251,15,195,224,9,190,144,27,244,129,11,232,49,184,241,85,114,224,36,234,118,84,192,55,215,150,196,73,11,99,252,151,224,100,186,156,255,203,61,228,78,198,103,172,71,238,38,220,80,10,243,23,166,218,135,0,184,149,200,250,168,35,141,23,120,58,142,109,160,248,63,178,80,103,189,21,93,130,32,150,201,8,138,188,17,162,221,31,134,92,47,220,126,179,50,114,15,130,236,49,29,90,154,129,31,251,9,213,127,98,187,54,144,180,131,203,116,74,196,111,235,79,21,98,68,231,190,79,219,175,236,85,47,21,101,208,41,219,143,164,198,226,67,217,53,169,91,65,245,143,70,114,253,18,185,160,34,229,82,196,163,64,86,216,121,191,17,212,177,89,145,57,228,21,154,109,232,34,96,46,227,14,54,161,33,125,224,155,5,124,51,158,104,40,18,205,170,230,127,157,2,119,57,80,115,13,139,100,27,255,127,211,46,102,5,197,169,83,234,108,66,147,19,213,43,182,146,25,173,56,245,106,48,120,191,33,167,76,205,2,68,195,246,78,147,182,248,90,214,179,45,110,245,181,208,13,245,129,74,139,98,58,196,75,250,174,236,210,42,247,161,194,118,73,191,15,158,181,225,131,59,40,136,0,189,241,127,102,249,4,200,111,228,142,78,161,6,224,71,242,106,133,251,173,125,150,16,171,123,30,105,139,8,63,207,167,74,34,92,146,62,199,178,254,7,217,30,144,45,93,26,155,63,180,83,4,234,148,37,105,239,76,31,93,241,202,157,217,91,47,170,67,138,92,235,72,11,99,34,235,200,135,157,14,209,50,30,88,218,40,104,210,60,232,197,72,240,147,88,16,138,222,117,231,164,20,112,43,155,119,185,106,223,191,132,102,225,126,35,204,58,175,220,130,55,144,208,162,10,102,70,29,121,205,14,225,33,177,54,131,166,210,186,110,59,88,38,183,80,151,186,117,58,234,183,84,4,153,43,175,26,107,231,190,53,171,2,81,46,238,91,209,66,233,83,17,162,65,6,171,25,91,241,138,97,24,75,195,2,229,116,50,190,123,228,176,255,75,158,192,109,148,217,30,253,47,149,20,177,247,112,220,128,236,6,201,160,18,139,254,113,220,93,126,202,159,41,123,255,97,193,212,122,142,190,28,171,140,49,240,121,201,255,142,213,185,49,166,230,114,153,251,96,170,21,85,248,147,16,53,100,142,39,87,243,8,78,191,92,120,75,233,131,0,159,55,23,98,64,228,105,79,47,165,68,184,19,249,82,60,211,22,71,155,30,61,178,14,75,225,105,0,206,153,29,85,46,70,14,117,78,27,207,8,180,43,65,137,205,178,66,37,212,164,193,4,230,132,56,201,115,153,15,222,198,35,95,215,77,200,253,175,144,36,131,242,202,21,214,135,53,151,0,223,136,181,108,238,138,220,101,247,153,52,130,251,73,103,185,227,111,239,194,154,249,131,64,143,89,216,123,240,32,106,224,135,90,116,68,207,106,181,22,162,228,43,180,61,140,167,52,186,147,41,123,82,216,186,11,169,94,124,37,101,229,193,112,171,92,12,202,45,86,8,168,41,91,207,177,24,195,57,138,7,169,55,96,38,218,101,190,237,34,194,11,164,58,153,5,188,234,19,246,44,150,80,251,67,97,132,246,104,7,243,115,229,17,105,164,8,50,109,71,222,56,155,238,175,84,28,69,245,38,229,122,164,231,117,204,132,232,28,116,83,164,233,41,214,128,206,146,4,164,49,19,119,172,77,111,229,93,208,121,79,55,156,123,177,12,214,125,34,206,17,74,162,209,86,29,136,69,213,184,232,152,244,194,139,16,189,65,6,145,208,124,157,57,148,68,26,187,50,73,22,186,65,148,221,12,119,156,87,21,108,76,236,182,80,212,153,58,244,139,22,185,46,253,169,33,203,87,223,100,53,189,165,141,232,186,37,128,56,193,169,246,90,31,63,129,23,90,41,252,107,218,120,247,43,181,8,217,193,101,252,83,150,217,162,109,248,40,199,95,241,67,180,252,166,199,57,135,111,254,92,3,203,39,218,69,146,14,105,228,136,64,29,144,239,111,5,87,54,113,219,154,238,105,13,49,148,117,201,82,212,156,121,170,80,27,167,96,73,232,106,80,135,17,170,124,3,238,90,14,171,77,137,50,188,28,136,44,10,122,31,220,13,41,195,125,156,104,85,172,128,212,84,185,1,248,199,172,75,41,203,250,173,23,92,1,72,206,126,225,190,4,251,46,175,11,227,55,208,149,49,201,20,140,206,34,242,51,220,197,39,136,55,195,126,226,2,160,113,219,97,228,152,246,86,158,185,140,70,235,53,183,249,19,232,36,161,50,112,158,97,15,129,224,154,65,121,199,230,135,182,40,161,98,68,171,136,106,235,72,100,184,0,125,237,177,114,162,56,175,112,155,93,63,112,211,149,244,36,104,205,250,61,16,203,70,51,102,196,66,242,101,168,29,211,8,123,57,110,192,70,242,132,34,220,50,187,102,18,136,33,75,156,52,255,85,26,243,19,220,87,31,147,192,36,135,230,84,33,64,255,11,82,235,5,192,29,248,160,78,21,96,67,179,26,88,140,171,124,184,234,139,1,127,47,18,218,114,76,145,167,204,89,150,9,215,87,196,71,146,234,82,166,241,215,177,106,21,118,216,146,187,128,53,163,199,16,115,250,62,159,108,218,142,95,214,127,199,144,74,124,176,12,232,187,166,222,151,123,187,43,238,81,24,209,38,223,175,202,86,148,186,246,98,39,225,27,236,117,178,18,163,253,117,3,206,38,58,97,5,237,204,169,63,100,44,208,109,238,70,216,166,88,201,27,180,13,191,43,171,30,99,50,230,210,99,58,128,44,110,6,54,241,71,216,6,158,112,171,85,154,60,107,235,34,59,14,173,66,130,187,77,44,142,60,103,25,183,66,140,178,118,193,149,46,82,141,8,234,176,80,2,142,37,129,51,6,144,243,54,126,78,226,150,68,249,182,18,41,141,194,218,87,252,133,197,20,115,148,93,201,47,240,16,117,252,9,157,122,223,137,199,241,1,102,164,250,199,227,133,212,45,243,94,226,14,252,68,127,223,35,192,122,28,153,248,191,95,233,178,222,104,75,210,165,239,113,24,207,135,109,164,83,244,1,153,28,205,75,174,97,206,36,255,128,68,100,143,188,41,213,69,194,100,44,82,112,152,216,59,12,95,32,79,172,110,152,28,132,79,158,27,198,172,106,250,87,215,64,112,25,159,74,120,32,194,133,38,95,2,59,184,87,6,56,227,120,174,71,116,181,60,147,33,235,164,61,178,13,194,31,224,74,131,94,170,23,249,162,210,26,183,39,136,188,121,159,240,19,72,196,219,54,189,110,230,95,10,62,158,48,135,168,226,54,209,9,252,61,169,17,219,148,203,133,246,160,218,146,197,26,50,222,95,242,18,221,85,122,2,140,83,229,157,61,177,21,204,237,51,146,77,9,124,62,227,85,244,70,222,50,193,140,231,9,90,165,38,213,56,142,239,124,205,19,189,10,88,180,138,107,200,151,89,245,110,50,176,78,30,103,42,74,98,252,137,191,39,126,166,107,190,47,211,240,109,45,123,90,246,161,105,7,186,119,219,173,236,141,99,172,21,108,147,3,91,113,57,179,121,247,137,0,176,82,42,182,76,229,99,246,125,31,237,79,19,124,42,183,71,236,15,222,120,193,231,174,19,161,68,7,156,201,57,10,251,133,74,184,23,201,217,3,116,42,143,64,209,27,96,57,34,197,5,151,209,38,201,177,255,30,209,149,24,74,192,99,244,156,211,24,149,116,35,154,71,215,158,49,176,231,212,5,157,131,96,166,55,150,10,128,207,112,236,92,217,78,229,146,176,28,100,152,60,168,139,235,195,78,181,255,84,134,243,189,114,79,252,52,118,236,86,61,122,165,80,236,104,214,33,65,126,18,105,234,60,177,207,52,191,1,93,204,135,68,95,118,199,37,211,25,247,72,93,240,58,32,181,133,20,117,37,97,68,224,204,8,249,84,37,64,149,226,25,111,168,45,148,12,158,216,130,180,71,163,11,139,218,44,198,5,56,143,168,228,204,53,185,137,89,10,238,106,137,253,120,35,241,23,166,54,254,80,179,108,138,200,36,184,155,81,226,48,187,151,237,193,124,48,138,172,108,128,183,99,14,127,56,216,0,232,76,223,64,100,40,14,219,95,193,239,20,106,157,130,187,250,114,12,151,80,254,37,219,125,163,27,81,172,62,151,103,189,225,134,15,152,62,233,0,167,221,101,126,6,167,104,253,61,0,165,21,245,81,36,231,18,209,250,167,201,88,155,193,101,126,179,21,167,196,242,138,32,119,52,176,70,244,92,26,76,46,94,179,123,4,168,198,73,44,188,227,16,198,219,9,78,41,106,184,221,117,45,83,122,53,20,245,204,142,28,76,202,133,88,208,109,179,215,66,158,46,76,114,37,242,134,67,27,206,43,250,140,81,109,63,159,213,81,146,204,36,220,169,212,137,238,32,222,96,57,109,149,249,101,145,48,89,114,175,247,155,209,88,29,141,205,185,251,148,77,189,61,91,214,171,114,43,227,148,59,5,143,91,197,134,6,218,180,17,49,174,239,146,89,113,55,207,24,229,183,1,246,110,12,127,59,118,7,156,189,69,197,157,243,22,214,7,67,209,122,239,33,140,59,125,4,67,244,163,12,96,31,213,162,116,39,237,128,23,233,184,73,29,191,121,243,25,110,227))
					}

var palettes_packed = {
	"bw": [0x000000, 0xffffff],
	"gameboy": [0x1b3715, 0x3d6135, 0x92ab37, 0xa1bb3d],
	"apple2": [0x000000, 0x515c16, 0x843d52, 0xea7d27, 0x514888, 0xe85def, 0xf5b7c9, 0x006752, 0x00c82c, 0x919191, 0xc9d199, 0x00a6f0, 0x98dbc9, 0xc8c1f7, 0xffffff],
	// "afr-32": [0xecebe7, 0xcbc6c1, 0xb28b78, 0x847066, 0x695b59, 0x4f4240, 0x352f2e, 0x723012, 0x845425, 0xa76343, 0xdc6a36, 0xf682bf, 0xd74060, 0xc5452b, 0xb02222, 0x8d1931, 0x6a1325, 0x3e1909, 0x406a3b, 0x76771d, 0x939446, 0xd3bd46, 0x99e0a8, 0x399a4d, 0x204f1a, 0x0f2c0c, 0x1a0a01, 0x14266a, 0x194f80, 0x2067a7, 0x49a3b4, 0x1de9de],
	// "cc-29": [0xf2f0e5, 0xb8b5b9, 0x868188, 0x646365, 0x45444f, 0x3a3858, 0x212123, 0x352b42, 0x43436a, 0x4b80ca, 0x68c2d3, 0xa2dcc7, 0xede19e, 0xd3a068, 0xb45252, 0x6a536e, 0x4b4158, 0x80493a, 0xa77b5b, 0xe5ceb4, 0xc2d368, 0x8ab060, 0x567b79, 0x4e584a, 0x7b7243, 0xb2b47e, 0xedc8c4, 0xcf8acb, 0x5f556a ],
	// "nopal-12": [0xe2e4df, 0xc5cfc4, 0xa8b5ae, 0x92929c, 0xffeced, 0xfbd4d2, 0xf1b4b4, 0xcca3a3, 0xf1eab6, 0xe4dba0, 0xcac18a, 0xaba47b],
	// "steam-lords": [0x213b25, 0x3a604a, 0x4f7754, 0xa19f7c, 0x77744f, 0x775c4f, 0x603b3a, 0x3b2137, 0x170e19, 0x2f213b, 0x433a60, 0x4f5277, 0x65738c, 0x7c94a1, 0xa0b9ba, 0xc0d1cc],
	"win16": [0xffffff, 0x00ffff, 0xff00ff, 0xffff00, 0xc0c0c0, 0xff0000, 0x00ff00, 0x0000ff, 0x808080, 0x008080, 0x800080, 0x808000, 0x000000, 0x800000, 0x008000, 0x000080],
	"macintosh2": [0xffffff,0xffff00,0xff6500,0xdc0000,0xff0097,0x360097,0x0000ca,0x0097ff,0x00a800,0x006500,0x653600,0x976536,0xb9b9b9,0x868686,0x454545,0x000000],
	"teletext": [0x000000,0xffffff,0xfffd33,0xff3016,0x0027fb,0x00f92c,0xff3ffc,0x00fcfe],
	"c64": [0x000000, 0x626262, 0x898989, 0xadadad, 0xffffff, 0x9f4e44, 0xcb7e75, 0x6d5412, 0xa1683c, 0xc9d487, 0x9ae29b, 0x5cab5e, 0x6abfc6, 0x887ecb, 0x50459b, 0xa057a3],
	"pico8": [0x000000,0x1d2b53,0x7e2553,0x008751,0xab5236,0x5f574f,0xc2c3c7,0xfff1e8,0xff004d,0xffa300,0xffec27,0x00e436,0x29adff,0x83769c,0xff77a8,0xffccaa],
}

var color_change_timer = []


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

	for (var p in palettes_packed) {
		addSwatch(packedRGBtoArray(palettes_packed[p]))
	}

	document.getElementById("drop-zone").addEventListener("dragover", dragOverHandler)
	document.getElementById("drop-zone").addEventListener("drop", dropHandler)
	document.querySelectorAll(".process-on-change").forEach(e => e.addEventListener("change", () => process()))
	document.getElementById("reset_input_button").addEventListener("click", unloadImage)
	document.getElementById("download_button").addEventListener("click", downloadResult)
	document.getElementById("file_input").addEventListener("change", openHandler)
	document.getElementById("exposure_slider").labels[0].addEventListener("dblclick", () => {document.getElementById("exposure_slider").value = 0; process()})
	document.getElementById("contrast_slider").labels[0].addEventListener("dblclick", () => {document.getElementById("contrast_slider").value = 0; process()})
	document.getElementById("quant-button").addEventListener("click", runQuantization)
	// document.getElementById("load_palette_button").addEventListener("click", loadPalette)

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

	document.querySelectorAll(".minus-btn").forEach(el => el.addEventListener("click", function (ev) {
		var input = this.parentNode.querySelector("input")
		var value = parseInt(input.value)
		if (isNaN(value)) return
		input.value = Math.max(value - 1, 2)
	}))
	document.querySelectorAll(".plus-btn").forEach(el => el.addEventListener("click", function (ev) {
		var input = this.parentNode.querySelector("input")
		var value = parseInt(input.value)
		if (isNaN(value)) return
		input.value = Math.min(value + 1, 64)
	}))

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
		map_dither(pixels, threshold_maps[method])
		break;
	case "blue_noise":
		map_dither(pixels, threshold_maps[method])
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

	var num_colors = document.getElementById("num-colors-input").value
	var generatePalette = {"k-means": kMeansPalette, "median-cut": medianCutPalette}[document.getElementById("quant-dropdown").value]
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

function addSwatch (colors) {
	var swatch = document.createElement("div")
	swatch.className = "color-swatch";
	var divs = []
	for (var i = 0; i < colors.length; i++) {
		var color_div = document.createElement("div")
		color_div.className = "color-swatch-element"
		color_div.style = "background-color: "+rgbToHex(...colors[i]);
		divs.push(color_div)
	}
	swatch.replaceChildren(...divs)
	swatch.addEventListener("click", () => setPalette(colors))
	document.getElementById("palette-selector").appendChild(swatch)
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

function thresholdTexture(size, array)
{
	this.size = size
	this.array = array
}

thresholdTexture.prototype.at = function(x, y) {
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
		picker.addEventListener("change", ((i) => function (ev) {clearTimeout(color_change_timer[i]);
																 color_change_timer[i] = setTimeout(() => {palette[i] = hexToRgb(this.value).map(srgbToLinear); process()}, 100) })(i))
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


function map_dither(pixels, threshold_map) {
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
		var tmp = new Array(pixels.width*3).fill(0)
		// for (var j = 0; j < tmp.length; j++)
		// 	tmp[j] = 0
		e.push(tmp)
	}

	for (var row = 0; row < pixels.height; row++) {
		e.push(new Array(pixels.width*3).fill(0))

		for (var col = 0; col < pixels.width; col++) {
			var color = pixels.getPixel(col, row)

			var adj_color = color.map((v,i) => v+e[0][col*3+i])

			var nearest = find_nearest_color(adj_color, palette)
			pixels.setPixel(col, row, nearest)
			var err = Array.from(adj_color).map((v,i) => v-nearest[i])


			for (var k of kernel) {
				if (col+k[0] < 0 || col+k[0] >= pixels.width)
					continue
				for (var j = 0; j < 3; j++)
					e[k[1]][(col+k[0])*3+j] += err[j]*k[2]
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