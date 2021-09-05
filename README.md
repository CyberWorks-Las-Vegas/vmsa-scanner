# vmsa scanner

the pdf-417-reader is the complete module for scanning an idea with a webcam but a camera that uses 1080p or better is need for scanning

the pdf-417-reader needs this import in the package.json in order for it to be used in the component your importing it into

"@zxing/library": "file:./pdf-417-reader/library",

the made functions that parse the barcode output from the scanner is in:
parse.js

the keys used to map the definitions of the barcode may need to be updated for the specific state you are in and should be referenced by looking for:
{state} driver licence barcode codes
the definitions for the codes are in:
dlKeys.js

import adapter from 'webrtc-adapter'; needs to be in the file

the way it gets imported sets global variable that the pdf-417-adapter looks for

the input used for the scanner input should auto focus on page load to force the scanner to load the barcode output into the page properly or else the browser will register as a bunch of button inputs
