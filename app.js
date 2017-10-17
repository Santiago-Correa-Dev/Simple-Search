(function() {
    let form = document.getElementById('form');
    let submit = document.getElementById('submit');
    let searchText = document.getElementById('search');
    let images = document.getElementById('images-area');
    let articlearea = document.getElementById('articles-area');
    let apiNy = api.apiNy;
    let apiUp = api.apiUp;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        searchedForText = searchText.value;
        images.innerHTML = '';


        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
                headers: {
                    Authorization: `Client-ID ${apiUp}`
                }
            })
            .then(response => response.json())
            .then(addImage)
            .catch(e => requestError(e, "images"));


        function addImage(data) {
            const firstImage = data.results[0];
            if (firstImage) {
                htmlContent = `<figure><img src="${firstImage.urls.regular}" alt="${searchedForText}"><figcaption>${searchedForText} by ${firstImage.user.name}</figure>`;
            } else {
                htmlContent = `<div class="error-no-image">Unfortunately no image popped up for your search : ${searchedForText}</div`;
            }
            images.insertAdjacentHTML('afterbegin', htmlContent);
        };

        fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&page=1&sort=newest&api-key=${apiNy}`)
            .then(response => response.json())
            .then(addArticles)
            .catch(e => requestError(e, "articles"));

        function addArticles(data) {
            let articles = data.response.docs;
            if (articles.length > 1) {
                htmlContent = '<ul>' + articles.map(article => `<li class="article"><a href="${article.web_url}">${article.headline.main}</a><p>${article.snippet}</p></li>`).join('') + '</ul>';
            } else {
                htmlContent = `<ul><li class="error-no-articles>No articles came up by searching for ${searchedForText}</li></ul>"`;
            }
            images.insertAdjacentHTML('beforeend', htmlContent);
        };

        function requestError(e, part) {
            images.insertAdjacentHTML('beforeend', `<div class="error-no-articles">Something happend with the network. No ${part} were loaded </div>`);
        };
    });
})();