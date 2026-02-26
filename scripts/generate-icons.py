#!/usr/bin/env python3
"""Generates simple pink heart PWA icons using only stdlib."""
import struct, zlib, os

def create_png(size, pixels_fn):
    def chunk(name, data):
        c = zlib.crc32(name + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)

    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0))

    raw = b''
    for y in range(size):
        raw += b'\x00'
        for x in range(size):
            r, g, b = pixels_fn(x, y, size)
            raw += bytes([r, g, b])

    compressed = zlib.compress(raw, 9)
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')
    return b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend

def heart_pixel(x, y, size):
    cx, cy = size / 2, size * 0.45
    nx = (x - cx) / (size * 0.26)
    ny = -(y - cy) / (size * 0.28)
    in_heart = (nx*nx + ny*ny - 1)**3 - nx*nx * ny**3 <= 0

    if in_heart:
        # Rainbow gradient left→right
        hue = x / size
        r, g, b = hsv_to_rgb(hue, 0.85, 0.95)
        return int(r*255), int(g*255), int(b*255)
    else:
        return 255, 255, 255  # white background

def hsv_to_rgb(h, s, v):
    i = int(h * 6)
    f = h * 6 - i
    p, q, t = v*(1-s), v*(1-f*s), v*(1-(1-f)*s)
    return [
        (v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)
    ][i % 6]

os.makedirs('public', exist_ok=True)
for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png')]:
    data = create_png(size, heart_pixel)
    with open(f'public/{name}', 'wb') as f:
        f.write(data)
    print(f'✓ public/{name} ({size}x{size})')

print('Icons generated!')
