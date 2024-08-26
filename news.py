from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

#API_KEY = '522b4131fa85411686e10b3cbc2b5bfa'
#BASE_URL = 'https://newsapi.org/v2/top-headlines?'

def fetch_news(category=None, keyword=None):
    country = 'mx'  # México
    params = {
        'apiKey': API_KEY,
        'country': country,
    }
    if category:
        params['category'] = category
    if keyword:
        params['q'] = keyword

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching news: {e}")
        return {"status": "error", "message": "No se pudo conectar a la API de noticias."}
    
@app.route('/')
def index():
    categories = ['all', 'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']
    news_data = fetch_news()
    return render_template('news.html', categories=categories, news_data=news_data)

@app.route('/search')
def search():
    category = request.args.get('category')
    keyword = request.args.get('keyword')
    news_data = fetch_news(category=category, keyword=keyword)
    return jsonify(news_data)

if __name__ == '__main__':
    app.run(debug=True)