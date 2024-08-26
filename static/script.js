document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loading');
    const newsContainer = document.getElementById('news-container');

    function checkOnlineStatus() {
        return navigator.onLine;
    }

    function showOfflineError() {
        newsContainer.innerHTML = '<p>No hay conexión a internet. Por favor, verifique su conexión e intente de nuevo.</p>';
        loadingIndicator.style.display = 'none';
    }

    function fetchNews(category = '', keyword = '') {
        if (!checkOnlineStatus()) {
            showOfflineError();
            return;
        }

        loadingIndicator.style.display = 'flex';
        let url = '/search?';
        if (category) {
            url += 'category=' + encodeURIComponent(category) + '&';
        }
        if (keyword) {
            url += 'keyword=' + encodeURIComponent(keyword);
        }

        fetch(url)
            .then(response => {
                if (!checkOnlineStatus()) {
                    throw new Error('Conexión perdida durante la solicitud');
                }
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                newsContainer.innerHTML = '';
                loadingIndicator.style.display = 'none';
                if (data.status === 'error') {
                    newsContainer.innerHTML = `<p>${data.message}</p>`;
                } else if (data.articles && data.articles.length > 0) {
                    data.articles.forEach(article => {
                        const articleDiv = document.createElement('div');
                        articleDiv.className = 'news-item';
                        articleDiv.innerHTML = `
                            <h2>${article.title}</h2>
                            <p>${article.description || 'Click en leer mas para ver la noticia completa.'}</p>
                            <a href="${article.url}" target="_blank">Leer más</a>
                        `;
                        newsContainer.appendChild(articleDiv);
                    });
                } else {
                    newsContainer.innerHTML = '<p>No se encontraron noticias.</p>';
                }
            })
            .catch(error => {
                if (!checkOnlineStatus()) {
                    showOfflineError();
                } else {
                    newsContainer.innerHTML = '<p>No se pudo cargar las noticias. Verifique su conexión a internet y la API.</p>';
                }
                loadingIndicator.style.display = 'none';
            });
    }

    fetchNews();

    document.getElementById('searchBtn').addEventListener('click', () => {
        const category = document.getElementById('category').value;
        const keyword = document.getElementById('keyword').value;
        fetchNews(category, keyword);
    });

    window.addEventListener('online', () => {
        console.log('Conexión restablecida. Actualizando noticias...');
        fetchNews();
    });

    window.addEventListener('offline', () => {
        console.log('Conexión perdida.');
        showOfflineError();
    });

    // Temporizador para actualización automática cada minuto (60000 ms)
    setInterval(() => {
        console.log('Actualizando noticias automáticamente...');
        fetchNews();
    }, 60000); // Actualizar cada 60 segundos
});
