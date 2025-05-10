import requests
from bs4 import BeautifulSoup
import re
import time
from datetime import datetime
from pymongo import MongoClient

# ✅ MongoDB setup
client = MongoClient("mongodb+srv://sawsan:kzFUSu1DAucqE53h@ac-lclokmu-shard-00-00.rwcyv8y.mongodb.net/?retryWrites=true&w=majority")

db = client["jolocalDB"]
products_collection = db["products"]

# ✅ Function to scrape product data
def extract_product_data(url):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    cookies = {
        "currency": "JOD"
    }

    response = requests.get(url, headers=headers, cookies=cookies)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch page: {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")

    # ----- Title -----
    title_tag = soup.select_one("h1.product-single__title")
    if not title_tag:
        raise Exception("Title not found")
    title = title_tag.text.strip()

    # ----- Price -----
    price_tag = soup.select_one("div.product__price")
    if not price_tag:
        raise Exception("Price not found")

    price_text = price_tag.text
    match = re.search(r"\d+\.\d{2}", price_text)
    if not match:
        raise Exception("Price format not recognized")
    price = float(match.group(0))  # already in JOD

    # ----- Image -----
    image_tag = soup.select_one("img.feature-row__image")
    if not image_tag:
        raise Exception("Image tag not found")

    image = image_tag.get("src") or image_tag.get("data-src")
    if not image:
        raise Exception("Image 'src' or 'data-src' missing")
    if image.startswith("//"):
        image = "https:" + image

    USD_TO_JOD = 0.709
    price_jod = round(price * USD_TO_JOD, 2)

    return title, price_jod, image
# ✅ Main loop to process products
product_docs = list(products_collection.find())
print(f"🔍 Found {len(product_docs)} products to scrape.")

for product in product_docs:
    url = product.get("url")
    print(f"🔄 Checking: {url}")
    try:
        result = extract_product_data(url)
        if result:
            title, new_price, image = result
            old_price = float(product["price"])

            update_fields = {
                "title": title,
                "image": image,
                "price": new_price,
                "last_update": datetime.utcnow()
            }

            if not product.get("original_price"):
                update_fields["original_price"] = old_price

            price_entry = {
                "price": new_price,
                "date": datetime.utcnow()
            }

            products_collection.update_one(
                {"_id": product["_id"]},
                {
                    "$set": update_fields,
                    "$push": {"price_history": price_entry}
                }
            )

            print(f"✅ Updated {title} — {old_price} ➜ {new_price}")
        else:
            print(f"⚠️ Skipped (no data): {url}")
    except Exception as e:
        print(f"❌ Error with {url}: {e}")

    time.sleep(1)

print("✅ Done scraping all products.")