from PIL import Image, ImageDraw

S = 512
a = (124, 92, 255)
b = (255, 95, 162)
grad = Image.new("RGBA", (S, S))
px = grad.load()
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * S - 2)
        px[x, y] = (int(a[0] + (b[0] - a[0]) * t), int(a[1] + (b[1] - a[1]) * t), int(a[2] + (b[2] - a[2]) * t), 255)
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([20, 20, S - 20, S - 20], radius=int(S * 0.24), fill=255)
img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
img.paste(grad, (0, 0), mask)
ImageDraw.Draw(img).polygon([(S * 0.40, S * 0.30), (S * 0.72, S * 0.50), (S * 0.40, S * 0.70)], fill=(255, 255, 255, 255))
big = img.resize((256, 256), Image.LANCZOS)
big.save("icon.png")
big.save("icon.ico", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print("icon ok")
