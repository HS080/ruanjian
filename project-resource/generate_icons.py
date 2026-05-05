import struct
import zlib
import os
import math

def create_png(width, height, pixels):
    """Create a PNG file from pixel data."""
    def make_chunk(chunk_type, data):
        chunk_len = struct.pack('>I', len(data))
        chunk_crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return chunk_len + chunk_type + data + chunk_crc
    
    signature = b'\x89PNG\r\n\x1a\n'
    
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr = make_chunk(b'IHDR', ihdr_data)
    
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            idx = y * width + x
            if idx < len(pixels):
                r, g, b, a = pixels[idx]
            else:
                r, g, b, a = 0, 0, 0, 0
            raw_data += struct.pack('BBBB', r, g, b, a)
    
    compressed = zlib.compress(raw_data, 9)
    idat = make_chunk(b'IDAT', compressed)
    
    iend = make_chunk(b'IEND', b'')
    
    return signature + ihdr + idat + iend

def draw_line(pixels, width, height, x1, y1, x2, y2, color, thickness=2):
    """Draw a line with thickness."""
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    steps = max(dx, dy)
    
    if steps == 0:
        return
    
    for step in range(steps + 1):
        t = step / steps if steps > 0 else 0
        x = x1 + (x2 - x1) * t
        y = y1 + (y2 - y1) * t
        
        for tx in range(int(x) - thickness, int(x) + thickness + 1):
            for ty in range(int(y) - thickness, int(y) + thickness + 1):
                if 0 <= tx < width and 0 <= ty < height:
                    pixels[ty * width + tx] = (*color, 255)

def draw_circle(pixels, width, cx, cy, radius, color, filled=True):
    """Draw a circle."""
    for y in range(int(cy) - radius - 1, int(cy) + radius + 2):
        for x in range(int(cx) - radius - 1, int(cx) + radius + 2):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx * dx + dy * dy)
            
            if filled:
                if dist <= radius:
                    if 0 <= x < width and 0 <= y < width:
                        pixels[y * width + x] = (*color, 255)
            else:
                if radius - 2 <= dist <= radius:
                    if 0 <= x < width and 0 <= y < width:
                        pixels[y * width + x] = (*color, 255)

def draw_rect(pixels, width, x, y, w, h, color):
    """Draw a filled rectangle."""
    for py in range(max(0, y), min(width, y + h)):
        for px in range(max(0, x), min(width, x + w)):
            pixels[py * width + px] = (*color, 255)

def create_icon(icon_type, active=False, size=81):
    """Create a tab bar icon."""
    if active:
        color = (245, 158, 11)
    else:
        color = (153, 153, 153)
    
    pixels = [(0, 0, 0, 0)] * (size * size)
    
    cx, cy = size // 2, size // 2
    
    if icon_type == 'home':
        # House - simple clean design
        base_y = cy + size // 5
        
        # Walls
        wall_w = size // 4
        wall_h = size // 4
        draw_rect(pixels, size, cx - wall_w, base_y - wall_h // 2, wall_w * 2, wall_h, color)
        
        # Door
        door_w = wall_w // 3
        door_h = wall_h // 2
        draw_rect(pixels, size, cx - door_w, base_y - door_h, door_w * 2, door_h, 
                  (255, 255, 255) if not active else (255, 200, 100))
        
        # Roof
        roof_top = base_y - wall_h - size // 6
        for y in range(base_y - wall_h, int(roof_top) - 1, -1):
            progress = (base_y - wall_h - y) / (base_y - wall_h - roof_top)
            half_width = int(wall_w * (1 + progress * 0.5))
            for x in range(cx - half_width, cx + half_width + 1):
                if 0 <= x < size and 0 <= y < size:
                    pixels[y * size + x] = (*color, 255)
    
    elif icon_type == 'category':
        # Grid - 2x2 squares
        s = size // 5
        gap = 4
        
        positions = [
            (cx - s - gap, cy - s - gap),
            (cx + gap, cy - s - gap),
            (cx - s - gap, cy + gap),
            (cx + gap, cy + gap),
        ]
        
        for px, py in positions:
            draw_rect(pixels, size, px, py, s, s, color)
    
    elif icon_type == 'vip':
        # Diamond/gem shape
        d = size // 3
        
        # Top triangle
        for y in range(cy - d, cy):
            progress = (cy - y) / d
            half_w = int(d * (1 - progress))
            for x in range(cx - half_w, cx + half_w + 1):
                if 0 <= x < size and 0 <= y < size:
                    pixels[y * size + x] = (*color, 255)
        
        # Bottom triangle
        for y in range(cy, cy + d):
            progress = (y - cy) / d
            half_w = int(d * (1 - progress))
            for x in range(cx - half_w, cx + half_w + 1):
                if 0 <= x < size and 0 <= y < size:
                    pixels[y * size + x] = (*color, 255)
    
    elif icon_type == 'mine':
        # User profile icon
        head_r = size // 6
        head_y = cy - size // 6
        
        # Head circle
        draw_circle(pixels, size, cx, head_y, head_r, color, filled=True)
        
        # Body
        body_w = size // 3
        body_top = head_y + head_r + 2
        body_bottom = cy + size // 4
        
        for y in range(body_top, body_bottom):
            progress = (y - body_top) / (body_bottom - body_top)
            current_w = int(body_w * (1 - progress * 0.2))
            draw_rect(pixels, size, cx - current_w, y, current_w * 2, 1, color)
    
    return create_png(size, size, pixels)

icons = [
    ('tab-home', 'home'),
    ('tab-home-active', 'home'),
    ('tab-category', 'category'),
    ('tab-category-active', 'category'),
    ('tab-vip', 'vip'),
    ('tab-vip-active', 'vip'),
    ('tab-mine', 'mine'),
    ('tab-mine-active', 'mine'),
]

output_dir = r'e:\project-resource\images'
os.makedirs(output_dir, exist_ok=True)

for filename, icon_type in icons:
    active = 'active' in filename
    png_data = create_icon(icon_type, active=active)
    filepath = os.path.join(output_dir, f'{filename}.png')
    with open(filepath, 'wb') as f:
        f.write(png_data)
    print(f'Created {filepath} ({len(png_data)} bytes)')

print('All icons generated successfully!')
