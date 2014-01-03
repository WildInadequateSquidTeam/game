function castShadows(ctx, body, x, y, scale) {
	var invert = false;
	if (scale == undefined) {
		scale = 100;
	}
	if (body.isCircle) {
		// http://www.kompoblog.ru/?p=23
		var dx = body.x - x;
		var dy = body.y - y;
		var dd = dx * dx + dy * dy;
		
		if (dd <= body.data.radius * body.data.radius) {
		
			/*ctx.beginPath();
				ctx.arc(x, y, dd * scale, 0, 2 * Math.PI);
			ctx.fill();*/
			//ctx.fillRect(0, 0, width, height);
		
		} else {
		
			var cx = x + dx / 2;
			var cy = y + dy / 2;
			var d = Math.sqrt(dd);
			
			var x1 = body.x;
			var y1 = body.y;
			var r1 = body.data.radius;
			var x2 = cx;
			var y2 = cy;
			var r2 = d / 2;
			var r2r2 = dd / 4;
			
			var DD = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
			var D = Math.sqrt(DD);
			var B = (r2r2 - r1 * r1 + DD) / (2 * D);
			var A = D - B;
			var H = Math.sqrt(r2r2 - B*B);
			
			var X = x1 + (x2-x1)/(D/A);
			var Y = y1 + (y2-y1)/(D/A);
			
			var hx1 = X - (Y-y2)*H/B;
			var hy1 = Y + (X-x2)*H/B;
			var hx2 = X + (Y-y2)*H/B;
			var hy2 = Y - (X-x2)*H/B;
			
			var fx1 = hx1 + (hx1 - x) * scale;
			var fy1 = hy1 + (hy1 - y) * scale;
			var fx2 = hx2 + (hx2 - x) * scale;
			var fy2 = hy2 + (hy2 - y) * scale;
			ctx.beginPath();
				ctx.moveTo((x1 - x) * scale, (y1 - y) * scale);
				ctx.lineTo(fx1, fy1);
				ctx.arcTo(x, y, hx2, hy2, r1);
				ctx.lineTo(fx2, fy2);
				ctx.closePath();
			ctx.fill();
		
		}
		
	} else {
	
		// http://www.codenet.ru/progr/cg/lec_1_2.php
		
		ctx.save();
		
			// FIXME: performance can be improved
		
			ctx.translate(body.x, body.y);
			ctx.rotate(body.angle);
	
			var cosA = Math.cos(-body.angle);
			var sinA = Math.sin(-body.angle);
			var tx = (x - body.x) * cosA - (y - body.y) * sinA;
			var ty = (x - body.x) * sinA + (y - body.y) * cosA;						
			
			var v = body.data.vertices;
			
			var x1 = v[v.length - 1].x;
			var y1 = v[v.length - 1].y;
			
			var iStart = 0;
			var iEnd = v.length - 1;
			var flag = false;
			var prevFlag = false;
			var length = 0;
			
			for (var i = 0; i < v.length; i++) {
				var x2 = v[i].x;
				var y2 = v[i].y;
				// http://coderlife.ru/progr/polozhenie-tochki-otnositelno-pryamoj.html
				var r = (x2 - x1) * (ty - y1) - (y2 - y1) * (tx - x1);
				var flag = ((r > 0) ^ invert);
				if (flag) { 
					length++;
				}
				if (flag != prevFlag) {
					if (flag) {
						iStart = ((i - 1) + v.length) % v.length;
					} else {
						iEnd = Math.min(iEnd, i - 1);
					}
				}
				prevFlag = flag;
				x1 = x2;
				y1 = y2;
			}
			if (flag) {
				iEnd = Math.min(iEnd, v.length - 1);
			}
			
			if (length > 0) {
			
				var fx1 = v[iStart].x + (v[iStart].x - tx) * scale;
				var fy1 = v[iStart].y + (v[iStart].y - ty) * scale;
				var fx2 = v[iEnd].x + (v[iEnd].x - tx) * scale;
				var fy2 = v[iEnd].y + (v[iEnd].y - ty) * scale;
				
				ctx.beginPath();
				
					ctx.moveTo(-tx * scale, -ty * scale);
				
					ctx.lineTo(fx1, fy1);
				
					for (var i = 0, j = iStart; i <= length; i++, j = (j + 1) % v.length) {
						ctx.lineTo(v[j].x, v[j].y);
					}
					
					ctx.lineTo(fx2, fy2);
					ctx.closePath();
					
				ctx.fill();
			
			}
		
		ctx.restore();
	
	}
}