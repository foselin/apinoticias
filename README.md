# Aplicación de Noticias de México

Esta es una aplicación web que consume la API de NewsAPI para mostrar las últimas noticias de México. La aplicación permite filtrar noticias por categoría y buscar por palabras clave.

## Requisitos

- Python 3.12
- Flask
- requests

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Instala las dependencias necesarias:
4. Utiliza un editor de código de tu preferencia puede ser Visual Code
5. En la terminal de code puedes ejecutar el siguiente comando:

    ```bash
    pip install Flask requests
    ```

## Ejecución

1. Ejecuta la aplicación:
2. Coloca el siguiente comando en la terminal de visual code 

    ```bash
    python news.py
    ```

2. Abre tu navegador web y navega a `http://127.0.0.1:5000` para ver la aplicación en funcionamiento.
   

## Descripción de la API

La aplicación utiliza la API de NewsAPI para obtener las últimas noticias. La API proporciona titulares de noticias de varias fuentes en tiempo real.

### Conexión a la API

La conexión a la API se realiza mediante la función `fetch_news`, que envía una solicitud GET a la URL base de la API con los parámetros necesarios, incluyendo la clave de API y el país (México). La función puede filtrar noticias por categoría y palabra clave.

```python
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
