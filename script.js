let allData = {};
        let currentCategory = '';

        function showMainContent() {
            $('#enEstrenoScroll, #seriesScroll, #peliculasScroll').empty();
            
            Object.entries(allData.formatos).forEach(([titulo, item]) => {
                const esEstreno = item.estreno === "true";
                const esSerie = item.categoría === "DRAMA" || item.TIPO === "SERIE";
                const esPelicula = item.categoría === "PELÍCULA" || item.TIPO === "PELÍCULA";
                
                const contentHTML = `
                    <div class="content-item" data-title="${titulo}">
                        <img src="${item.icono || '/api/placeholder/100/150'}" alt="${titulo}">
                        ${item.estado ? `<div class="status">${item.estado}</div>` : ''}
                    </div>
                `;
                
                if (esEstreno) {
                    $('#enEstrenoScroll').append(contentHTML);
                }
                if (esSerie) {
                    $('#seriesScroll').append(contentHTML);
                }
                if (esPelicula) {
                    $('#peliculasScroll').append(contentHTML);
                }
            });
        }

        function showCategoryContent(category) {
            currentCategory = category;
            const searchQuery = $('#categorySearchInput').val().toLowerCase();
            
            $('#categoryGrid').empty();
            $('#categoryTitle').text(category.toUpperCase());
            
            Object.entries(allData.formatos).forEach(([titulo, item]) => {
                if (titulo.toLowerCase().includes(searchQuery)) {
                    const esEstreno = item.estreno === "true";
                    const esSerie = item.categoría === "DRAMA" || item.TIPO === "SERIE";
                    const esPelicula = item.categoría === "PELÍCULA" || item.TIPO === "PELÍCULA";
                    
                    if ((category === 'enEstreno' && esEstreno) ||
                        (category === 'series' && esSerie) ||
                        (category === 'peliculas' && esPelicula)) {
                        const contentHTML = `
                            <div class="content-item" data-title="${titulo}">
                                <img src="${item.icono || '/api/placeholder/150/225'}" alt="${titulo}">
                                ${item.estado ? `<div class="status">${item.estado}</div>` : ''}
                            </div>
                        `;
                        $('#categoryGrid').append(contentHTML);
                    }
                }
            });
            
            $('#mainView').hide();
            $('#categoryView').show();
        }

        function showDetails(titulo) {
            const item = allData.formatos[titulo];
            let capitulosHtml = '';
            for (let i = 1; i <= 35; i++) {
                const capKey = `CAPITULO ${i}`;
                if (item[capKey] && item[capKey].trim() !== '') {
                    capitulosHtml += `<div class="capitulo" data-video="${item[capKey]}">Capítulo ${i}</div>`;
                }
            }

            $('#categoryView, #mainView').hide();
            $('#detailView').html(`
                <div class="category-header">
                    <button class="back-button">&#8592;</button>
                    <h2>${titulo}</h2>
                </div>
                <div class="player-container">
                    <video id="videoPlayer" class="video-player" controls>
                        <source id="videoSource" src="" type="video/mp4">
                    </video>
                </div>
                <div class="info">
                    <p><strong>Tipo:</strong> ${item.TIPO || 'No especificado'}</p>
                    <p><strong>Categoría:</strong> ${item['categoría'] || 'No especificada'}</p>
                    <p><strong>Año:</strong> ${item.año || 'No especificado'}</p>
                    <p><strong>Estado:</strong> ${item.estado || 'No especificado'}</p>
                    <p><strong>Idioma:</strong> ${item.idioma || 'No especificado'}</p>
                    <p><strong>Temporadas:</strong> ${item.temporadas || 'No especificado'}</p>
                </div>
                <div class="capitulos">
                    <h3>Capítulos</h3>
                    ${capitulosHtml}
                </div>
            `).show();

            if (item['CAPITULO 1']) {
                loadVideo(item['CAPITULO 1']);
            }
        }

        function loadVideo(videoUrl) {
            $('#videoSource').attr('src', videoUrl);
            $('#videoPlayer')[0].load();
        }

        $(document).ready(function() {
            $.getJSON('web.json', function(data) {
                allData = data;
                showMainContent();
            }).fail(function() {
                console.error('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
            });

            $('#categorySearchInput').on('input', function() {
                showCategoryContent(currentCategory);
            });

            $(document).on('click', '.section-title', function() {
                const category = $(this).data('category');
                if (category) {
                    showCategoryContent(category);
                }
            });

            $(document).on('click', '.content-item', function() {
                showDetails($(this).data('title'));
            });

            $(document).on('click', '.capitulo', function() {
                loadVideo($(this).data('video'));
            });

            $(document).on('click', '.back-button', function() {
                if ($('#detailView').is(':visible')) {
                    $('#detailView').hide();
                    $('#categoryView').show();
                } else {
                    $('#categoryView').hide();
                    $('#mainView').show();
                }
            });
        });