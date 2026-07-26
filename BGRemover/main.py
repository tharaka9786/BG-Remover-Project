from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove, new_session
import io
from PIL import Image

from database import engine
import models
from auth import router as auth_router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Background Removal API", description="API to remove background from images using rembg.")

# Setup CORS to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Routes
app.include_router(auth_router)

# We will lazy-load the session on the first request to prevent Render from timing out during startup
session = None

@app.post("/api/remove-bg", summary="Remove Background", description="Upload an image to remove its background and optionally upscale it.")
def remove_background(
    file: UploadFile = File(...),
    resolution: str = Form("original") # HD, 2K, 4K, original
):
    global session
    if session is None:
        print("Initializing AI model (this may take a minute on the first run)...")
        session = new_session("u2netp")
        
    # Read image contents
    contents = file.file.read()
    
    # Process image with rembg
    try:
        # Pass bytes to remove function with the lightweight session
        output_bytes = remove(contents, session=session)
        
        # Check if resizing is needed
        if resolution != "original":
            # Load the processed image into PIL
            image = Image.open(io.BytesIO(output_bytes))
            
            # Determine target dimensions (approximate standard sizes by width)
            target_width = None
            if resolution == "HD":
                target_width = 1920
            elif resolution == "2K":
                target_width = 2560
            elif resolution == "4K":
                target_width = 3840
            
            if target_width and image.width < target_width:
                # Calculate new height maintaining aspect ratio
                aspect_ratio = image.height / image.width
                target_height = int(target_width * aspect_ratio)
                
                # Resize using LANCZOS for best upscaling quality
                image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
                
                # Save back to bytes
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='PNG')
                output_bytes = img_byte_arr.getvalue()
        
        return Response(content=output_bytes, media_type="image/png")
    except Exception as e:
        return Response(content=f"Error processing image: {str(e)}", status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
