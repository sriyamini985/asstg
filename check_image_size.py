from PIL import Image

image_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\0d2c8a7f-a9e8-49d4-a6d9-f260aad88668\.user_uploaded\media__1785849376053.jpg"
try:
    img = Image.open(image_path)
    print("Dimensions:", img.size)
except Exception as e:
    print("Error:", e)
