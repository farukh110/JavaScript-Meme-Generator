$(document).ready(function(){

	var canvas = document.getElementById('meme');
	ctx = canvas.getContext('2d');
    
    
	
	// core drawing function
	var drawMeme = function() {
		var img = document.getElementById('start-image');

		var fontSize = parseInt( $('#text_font_size').val() );
		
		var memeSize = parseInt( $('#canvas_size').val() );

		var fontColor = document.getElementById('fontColor');
		var backColor = document.getElementById('BackColor');
		var strokeColor = document.getElementById('strokeColor');
		
		// set form field properties
		$('#text_top_offset').attr('max', memeSize);
		$('#text_bottom_offset').attr('max', memeSize);
		
		// initialize canvas element with desired dimensions
		canvas.width = memeSize;
		canvas.height = memeSize;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// calculate minimum cropping dimension
		var croppingDimension = img.height;
		if( img.width < croppingDimension ){
			croppingDimension = img.width;
		}
		
		ctx.drawImage(img, 0, 0, croppingDimension, croppingDimension, 0, 0, memeSize, memeSize);

		
		ctx.lineWidth  = parseInt( $('#text_stroke_width').val() );
		ctx.font = fontSize + 'pt sans-serif';
		ctx.strokeStyle = strokeColor.value;
		ctx.fillStyle = fontColor.value;
		ctx.textAlign = 'center';
		
		ctx.textBaseline = 'top';
        ctx.fillStyle = backColor.value;
        ctx.fillRect (0, 0, 600, 100);

		var text1 = $('#text_top').val();
		text1 = text1.toUpperCase();
		x = memeSize / 2;
		y = parseInt( $('#text_top_offset').val() );

		var lineHeight = fontSize + parseInt( $('#text_line_height').val() );
		var maxTextAreaWidth = memeSize * 0.85;
		
		wrapText(ctx, text1, x, y, maxTextAreaWidth, lineHeight, false);

		
		ctx.textBaseline = 'bottom';
		ctx.fillStyle = backColor.value;
		ctx.fillRect (0, 400, 600, 100);
		var text2 = $('#text_bottom').val();
		text2 = text2.toUpperCase();
		y = parseInt( $('#text_bottom_offset').val() );

		wrapText(ctx, text2, x, y, maxTextAreaWidth, lineHeight, true);

	};

	
	// build inner container for wrapping text inside
	var wrapText = function(context, text, x, y, maxWidth, lineHeight, fromBottom) {
		var pushMethod = (fromBottom) ? 'unshift' : 'push';

		lineHeight = (fromBottom) ? -lineHeight : lineHeight;

		var lines = [];
		var y = y;
		var line = '';
		var words = text.split(' ');

		for (var n = 0; n < words.length; n++) {
			var testLine = line + ' ' + words[n];
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;

			if (testWidth > maxWidth) {
				lines[pushMethod](line);
				line = words[n] + ' ';
			} else {
				line = testLine;
			}
		}
		lines[pushMethod](line);

		for (var k in lines) {
			context.strokeText(lines[k], x, y + lineHeight * k);
			context.fillText(lines[k], x, y + lineHeight * k);
		}
	};
	
	
	$("#imgInp").change(function(){
		var input = this;
		
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			
			reader.onload = function (e) {
				$('#start-image').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
		}
		
		window.setTimeout(function(){
			drawMeme();
			$('#image_credit').hide();
		}, 500);
	});
	
	
	
	// register event listeners
	
	$(document).on('change keydown keyup', '#text_top', function() {
		drawMeme();
	});
	
	$(document).on('change keydown keyup', '#text_bottom', function() {
		drawMeme();
	});
	
	$(document).on('input change', '#text_top_offset', function() {
		$('#text_top_offset__val').text( $(this).val() );
		drawMeme();
	});
	
	$(document).on('input change', '#text_bottom_offset', function() {
		$('#text_bottom_offset__val').text( $(this).val() );
		drawMeme();
	});
	
	$(document).on('input change', '#text_font_size', function() {
		$('#text_font_size__val').text( $(this).val() );
		drawMeme();
	});
	
	$(document).on('input change', '#text_line_height', function() {
		$('#text_line_height__val').text( $(this).val() );
		drawMeme();
	});
	
	$(document).on('input change', '#text_stroke_width', function() {
		$('#text_stroke_width__val').text( $(this).val() );
		drawMeme();
	});
	
	$(document).on('input change', '#canvas_size', function() {
		$('#canvas_size__val').text( $(this).val() );
		drawMeme();
	});
	
	// TODO: replace this with a server-side processing method 
	// $('#download_meme').click(function(e){
	// 	$(this).attr('href', canvas.toDataURL());
	// 	$(this).attr('download', 'meme.png');
	// });
	
	
	
	// init at startup
	window.setTimeout(function(){
		drawMeme();
	}, 100);

});
