from PIL import Image

def remove_white_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # If the pixel is white or very close to white, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_white_background(
        "/Users/janiele/Desktop/Oneway Interview App/public/logo.png",
        "/Users/janiele/Desktop/Oneway Interview App/public/logo_transparent.png"
    )
