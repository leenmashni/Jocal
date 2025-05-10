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

# ✅ Function to scrape Pure Home Decor
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
    price = float(match.group(0))

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

# ✅ Utilities
def get_soup(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    cookies = {"currency": "JOD"}
    response = requests.get(url, headers=headers, cookies=cookies)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch page: {response.status_code}")
    return BeautifulSoup(response.text, "html.parser")

def get_image(soup, selector):
    img = soup.select_one(selector)
    if not img:
        raise Exception("Image not found")
    src = img.get("src") or img.get("data-src")
    if src.startswith("//"):
        src = "https:" + src
    return src

# ✅ Other brand-specific scrapers (بدون Pure Home Decor)
def extract_zaya_data(url):
    soup = get_soup(url)
    title = soup.select_one("h1").text.strip()
    price_text = soup.select_one("span.price-item--regular").text.strip()
    price = float(re.search(r"\d+\.\d{2}|\d+", price_text).group())
    image = get_image(soup, "div.product__media img")
    return title, price, image

def extract_fnl_data(url):
    soup = get_soup(url)
    title = soup.select_one("h1.product__title").text.strip()
    price = float(re.search(r"\d+\.\d{2}", soup.select_one("span.price").text).group())
    image = get_image(soup, "img.product__media-item")
    return title, price, image

def extract_amina_data(url):
    soup = get_soup(url)
    title = soup.select_one("h1.product__title").text.strip()
    price = float(re.search(r"\d+\.\d{2}", soup.select_one("span.price").text).group())
    image = get_image(soup, "img.product__media-item")
    return title, price, image

def extract_famekey_data(url):
    soup = get_soup(url)
    title = soup.select_one("h1.product-title").text.strip()
    price = float(re.search(r"\d+\.\d{2}", soup.select_one("span.product-price").text).group())
    image = get_image(soup, "img.zoomImg")
    return title, price, image

def extract_jobedu_data(url):
    soup = get_soup(url)
    title = soup.select_one("h1.product__title").text.strip()
    price = float(re.search(r"\d+\.\d{2}", soup.select_one("span.price").text).group())
    image = get_image(soup, "img.product__media-item")
    return title, price, image

def extract_joyjewels_data(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.find("h1").text.strip()
    price = soup.find("span", class_="money buckscc-money").text.strip()
    image = "https:" + soup.find("img", {"src": lambda x: x and "cdn.shop" in x})["src"]
    return title, float(re.search(r"\d+\.\d{2}", price).group()), image

def extract_watan_data(url):
    soup = get_soup(url)
    title = soup.select_one("h1.product__title").text.strip()
    price = float(re.search(r"\d+\.\d{2}", soup.select_one("span.price").text).group())
    image = get_image(soup, "img.product__media-item")
    return title, price, image

# ✅ Dispatcher
brand_scrapers = {
    "Zaya": extract_zaya_data,
    "FNL": extract_fnl_data,
    "Amina's Skin Care": extract_amina_data,
    "Famekey": extract_famekey_data,
    "Jobedu": extract_jobedu_data,
    "Joy Jewels": extract_joyjewels_data,
    "Watan": extract_watan_data
    
}

# ✅ Main loop
product_docs = list(products_collection.find())
print(f"🔍 Found {len(product_docs)} products to scrape.")

for product in product_docs:
    url = product.get("url")
    brand = product.get("brand")

    if not url or not brand:
        print(f"⚠️ Missing URL or brand in product: {product.get('_id')}")
        continue

    print(f"🔄 Checking: {url} (Brand: {brand})")

    try:
        if brand == "Pure Home Decor":
            title, new_price, image = extract_product_data(url)
        else:
            scraper = brand_scrapers.get(brand)
            if not scraper:
                print(f"⚠️ No scraper for brand: {brand}")
                continue
            title, new_price, image = scraper(url)

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

    except Exception as e:
        print(f"❌ Error with {url}: {e}")

    time.sleep(1)

print("✅ Done scraping all products.")
