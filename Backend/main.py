from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json, os, sys

sys.path.append(os.path.dirname(__file__))
import database
from recommendation_engine import RecommendationEngine

app = FastAPI(title="DressiFy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

database.initialize_database()
engine = RecommendationEngine()

# ── MODELS ────────────────────────────────────
class ProfileUpdate(BaseModel):
    name: Optional[str] = "User"
    age: Optional[int] = 20
    gender: Optional[str] = "Female"
    skin_tone: Optional[str] = "Wheatish"
    body_type: Optional[str] = "All"
    preferred_fit: Optional[str] = "Regular"
    fav_colors: Optional[List[str]] = []

class OutfitRequest(BaseModel):
    gender: str = "Female"
    age: int = 20
    body_type: str = "All"
    skin_tone: str = "Wheatish"
    occasion: str = "College"
    weather: str = "Sunny"
    preferred_fit: str = "Regular"
    fav_colors: List[str] = ["Neutral"]
    use_wardrobe: bool = False

class WardrobeItem(BaseModel):
    item_type: str
    item_name: str
    color: Optional[str] = ""
    color_family: Optional[str] = "Neutral"
    notes: Optional[str] = ""

class SaveOutfit(BaseModel):
    occasion: str
    weather: str
    items: dict
    explanation: str
    ai_score: int = 0
    confidence: str = ""

class WishlistItem(BaseModel):
    name: str
    brand: Optional[str] = ""
    price: Optional[str] = ""
    link: Optional[str] = ""
    item_type: Optional[str] = "shoes"

# ── ROUTES ────────────────────────────────────

@app.get("/")
def root():
    return {"message": "DressiFy API running ✨"}

@app.get("/api/user")
def get_user():
    user = database.get_or_create_user()
    try:
        user["fav_colors"] = json.loads(user.get("fav_colors", "[]"))
    except:
        user["fav_colors"] = []
    return user

@app.put("/api/user")
def update_user(profile: ProfileUpdate):
    user = database.get_or_create_user()
    uid = user["user_id"]
    database.update_user(uid,
        name=profile.name, age=profile.age, gender=profile.gender,
        skin_tone=profile.skin_tone, body_type=profile.body_type,
        preferred_fit=profile.preferred_fit,
        fav_colors=json.dumps(profile.fav_colors)
    )
    return {"success": True}

@app.post("/api/outfit/generate")
def generate_outfit(req: OutfitRequest):
    user = database.get_or_create_user()
    uid = user["user_id"]
    result = engine.generate_outfit(
        user_id=uid, gender=req.gender, age=req.age,
        body_type=req.body_type, skin_tone=req.skin_tone,
        occasion=req.occasion, weather=req.weather,
        preferred_fit=req.preferred_fit, fav_colors=req.fav_colors,
        use_wardrobe=req.use_wardrobe
    )
    # Convert hair_options tuples to lists for JSON
    result["hair_options"] = [list(h) for h in result["hair_options"]]
    return result

@app.post("/api/outfit/generate-with-ai")
async def generate_with_ai(req: OutfitRequest):
    import google.generativeai as genai
    user = database.get_or_create_user()
    uid = user["user_id"]
    result = engine.generate_outfit(
        user_id=uid, gender=req.gender, age=req.age,
        body_type=req.body_type, skin_tone=req.skin_tone,
        occasion=req.occasion, weather=req.weather,
        preferred_fit=req.preferred_fit, fav_colors=req.fav_colors,
        use_wardrobe=req.use_wardrobe
    )
    result["hair_options"] = [list(h) for h in result["hair_options"]]

    # Gemini explanation
    api_key = os.environ.get("GEMINI_API_KEY", "")
    explanation = f"This look is crafted for {req.occasion.lower()} in {req.weather.lower()} weather. The colours beautifully complement your {req.skin_tone.lower()} skin tone while the {req.preferred_fit.lower()} fit enhances your silhouette."
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            outfit_lines = "\n".join(f"- {k.upper()}: {v['item']}" for k,v in result["outfit"].items())
            prompt = f"DressiFy AI stylist. User: {req.gender}, {req.age}y, {req.body_type}, {req.skin_tone} skin, {req.occasion}, {req.weather}.\nOutfit:\n{outfit_lines}\n2-3 warm sentences why this works. Plain text only."
            explanation = model.generate_content(prompt).text.strip()
        except:
            pass
    result["explanation"] = explanation
    return result

@app.post("/api/outfit/save")
def save_outfit(data: SaveOutfit):
    user = database.get_or_create_user()
    uid = user["user_id"]
    oid = database.save_outfit(uid,
        occasion=data.occasion, weather=data.weather,
        items_dict=data.items, explanation=data.explanation,
        ai_score=data.ai_score, confidence=data.confidence
    )
    return {"outfit_id": oid}

@app.get("/api/outfit/history")
def get_history():
    user = database.get_or_create_user()
    return database.get_outfit_history(user["user_id"], limit=30)

@app.put("/api/outfit/{outfit_id}/rate/{rating}")
def rate(outfit_id: int, rating: int):
    database.rate_outfit(outfit_id, rating)
    return {"success": True}

@app.put("/api/outfit/{outfit_id}/favourite")
def fav_outfit(outfit_id: int):
    database.toggle_outfit_favourite(outfit_id)
    return {"success": True}

# ── WARDROBE ──────────────────────────────────
@app.get("/api/wardrobe")
def get_wardrobe():
    user = database.get_or_create_user()
    return database.get_wardrobe(user["user_id"])

@app.post("/api/wardrobe")
def add_item(item: WardrobeItem):
    user = database.get_or_create_user()
    iid = database.add_wardrobe_item(
        user["user_id"], item.item_type, item.item_name,
        item.color, item.color_family, "", item.notes
    )
    return {"item_id": iid}

@app.delete("/api/wardrobe/{item_id}")
def delete_item(item_id: int):
    database.delete_wardrobe_item(item_id)
    return {"success": True}

@app.put("/api/wardrobe/{item_id}/favourite")
def fav_item(item_id: int):
    database.toggle_wardrobe_favourite(item_id)
    return {"success": True}

@app.put("/api/wardrobe/{item_id}/worn")
def mark_worn(item_id: int):
    database.mark_item_worn(item_id)
    return {"success": True}

@app.delete("/api/wardrobe")
def clear_wardrobe():
    user = database.get_or_create_user()
    conn = database.get_connection()
    conn.execute("DELETE FROM wardrobe WHERE user_id=?", (user["user_id"],))
    conn.commit(); conn.close()
    return {"success": True}

@app.get("/api/wardrobe/analytics")
def get_analytics():
    user = database.get_or_create_user()
    wardrobe = database.get_wardrobe(user["user_id"])
    analytics = database.get_wardrobe_analytics(user["user_id"])
    missing = engine.find_missing_items(wardrobe, "Female")
    color_data = engine.analyze_colors(wardrobe)
    return {**analytics, "missing": missing, "color_analysis": color_data}

@app.get("/api/catalogue")
def get_catalogue(type: str = None, gender: str = None, occasion: str = None):
    df = engine.df.copy()
    if type and type != "All": df = df[df["type"] == type]
    if gender and gender != "All": df = df[df["gender"] == gender]
    if occasion and occasion != "All": df = df[df["occasion"] == occasion]
    return df.fillna("").to_dict(orient="records")

@app.get("/api/trends")
def get_trends():
    return [
        {"season":"Summer 2026","title":"Linen Everything","sub":"Breathable, elegant, effortless","items":["Linen Shirt","Linen Co-ord","Linen Trousers","Linen Shorts"],"color":"#d4895a"},
        {"season":"Summer 2026","title":"Earth Tones","sub":"Warm, grounded, nature-inspired","items":["Rust Crop Top","Camel Trousers","Terracotta Dress","Olive Jacket"],"color":"#8b7355"},
        {"season":"Summer 2026","title":"Co-ord Sets","sub":"Matching sets are the new power move","items":["Sage Green Set","White Linen Set","Brown Knit Set","Beige Set"],"color":"#7a9dbf"},
        {"season":"Summer 2026","title":"Minimal Silver","sub":"Less is more — clean and simple","items":["Thin Gold Chain","Silver Cuff","Minimal Watch","Hoop Earrings"],"color":"#9b87b8"},
        {"season":"Summer 2026","title":"Wide-Leg Denim","sub":"The 90s are back","items":["Baggy Blue Jeans","Wide-Leg White","Mom Jeans","Barrel Leg"],"color":"#7aaa90"},
        {"season":"Summer 2026","title":"Sporty Luxe","sub":"Gym-to-street looks","items":["Crop Sports Bra","Track Pants","Windbreaker","Chunky Sneakers"],"color":"#c97070"},
    ]

@app.get("/api/trends/advice")
async def trends_advice():
    import google.generativeai as genai
    api_key = os.environ.get("GEMINI_API_KEY","")
    advice = "Linen and earth tones dominate Summer 2026. Try a sage green co-ord set or camel wide-leg trousers. Minimalist silver jewellery pairs beautifully with neutral tones."
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            r = model.generate_content("Give 3 practical Summer 2026 fashion tips in 80 words. Conversational tone, no markdown.")
            advice = r.text.strip()
        except: pass
    return {"advice": advice}
