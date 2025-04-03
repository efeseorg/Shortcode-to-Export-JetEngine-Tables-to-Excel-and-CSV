<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
<script>
jQuery(document).ready(function($) {
        // Crear estilos CSS dinámicamente
        var styles = `
            .modal { display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); } 
            .modal-content { background-color: #fefefe; margin: auto; padding: 2em; border: 1px solid #888; border-radius: 5px; width: 80%; max-width: 800px; } 
            .modal-header { display: flex; justify-content: space-between; align-items: center; } 
            .close { color: #aaa; float: right; font-size: 28px; font-weight: bold; } 
            .close:hover, .close:focus { color: black; text-decoration: none; cursor: pointer; } 
            #column-selector label {font-weight: normal; font-size: 1rem !important; font-family: inherit} 
            body[data-elementor-device-mode="desktop"] #column-selector label {width: calc(33% - 16px);} 
            body[data-elementor-device-mode="tablet"] #column-selector label {width: calc(50% - 16px);} 
            body[data-elementor-device-mode="mobile"] #column-selector label {width: calc(100%);}
        `;
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Crear el modal dinámicamente
        var modalHTML = `
            <div id="columnModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Columnas visibles</h2>
                        <span class="close">&times;</span>
                    </div>
                    <div id="column-selector"></div>
                </div>
            </div>
        `;
        $('body').append(modalHTML);

        var $table = $('.jet-dynamic-table');
        var $columnSelector = $('#column-selector');
        var $headerCells = $table.find('thead th');

        // Generar checkboxes dinámicamente
        $headerCells.each(function(index) {
            var columnClass = $(this).attr('class').match(/jet-dynamic-table__col--\w+/)[0];
            var columnName = $(this).text();
            var checkbox = $('<label><input type="checkbox" class="toggle-column" data-column-class="' + columnClass + '" checked> ' + columnName + '</label>');
            $columnSelector.append(checkbox);
        });

        function toggleColumns() {
            $columnSelector.find('.toggle-column').each(function() {
                var columnClass = $(this).data('column-class');
                var isChecked = $(this).is(':checked');

                if (isChecked) {
                    $table.find('.' + columnClass).show();
                } else {
                    $table.find('.' + columnClass).hide();
                }
            });
        }

        // Manejar el cambio de estado de los checkboxes
        $columnSelector.on('change', '.toggle-column', function() {
            toggleColumns();
        });

        // Obtener el modal
        var modal = $('#columnModal');

        // Obtener el botón que abre el modal
        var btn = $('#open-modal');

        // Obtener el elemento <span> que cierra el modal
        var span = $('.close');

        // Cuando el usuario hace clic en el botón, abrir el modal
        btn.on('click', function() {
            modal.show();
        });

        // Cuando el usuario hace clic en <span> (x), cerrar el modal
        span.on('click', function() {
            modal.hide();
        });

        // Cuando el usuario hace clic en cualquier lugar fuera del modal, cerrarlo
        $(window).on('click', function(event) {
            if ($(event.target).is(modal)) {
                modal.hide();
            }
        });

        // Escuchar cambios en la tabla después de AJAX
        $(document).ajaxComplete(function() {
            toggleColumns();
        });

        // Función para exportar a CSV
        function exportTableToCSV(filename) {
            var csv = [];
            var $allRows = $('.jet-dynamic-table tbody tr');
            
            $allRows.each(function() {
                var rowData = [];
                $(this).find('td, th').each(function() {
                    var cellClass = $(this).attr('class').match(/jet-dynamic-table__col--\w+/)[0];
                    if ($('.toggle-column[data-column-class="' + cellClass + '"]').is(':checked') && !$(this).hasClass('jet-dynamic-table__col--acciones')) {
                        rowData.push($(this).text());
                    }
                });
                csv.push(rowData.join(","));
            });

            // Descargar archivo CSV
            downloadCSV(csv.join("\n"), filename);
        }

        function downloadCSV(csv, filename) {
            var csvFile;
            var downloadLink;

            csvFile = new Blob([csv], {type: "text/csv"});

            downloadLink = document.createElement("a");
            downloadLink.download = filename;
            downloadLink.href = window.URL.createObjectURL(csvFile);
            downloadLink.style.display = "none";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        // Función para exportar a Excel
        function exportTableToExcel(tableID, filename = '') {
            var cloneTable = $('.jet-dynamic-table').clone();
            cloneTable.find('tr').show(); // Asegurar que todas las filas estén visibles en el clon

            // Remover columnas no visibles en el clon
            cloneTable.find('th, td').each(function() {
                var cellClass = $(this).attr('class').match(/jet-dynamic-table__col--\w+/)[0];
                if (!$('.toggle-column[data-column-class="' + cellClass + '"]').is(':checked') || $(this).hasClass('jet-dynamic-table__col--acciones')) {
                    $(this).remove();
                }
            });

            var wb = XLSX.utils.table_to_book(cloneTable[0], {sheet: "Sheet JS"});
            var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            var blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});

            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }

        // Añadir eventos a botones de exportación
        document.getElementById("exportCSV").addEventListener("click", function () {
            exportTableToCSV('tabla_exportada.csv');
        });

        document.getElementById("exportExcel").addEventListener("click", function () {
            exportTableToExcel('.jet-dynamic-table', 'tabla_exportada.xlsx');
        });

        // Ejecutar la función al cargar la página para aplicar la visibilidad inicial
        toggleColumns();

        // Escuchar cambios en la tabla después de AJAX
        $(document).ajaxComplete(function() {
            setTimeout(toggleColumns, 100); // Añadir un pequeño retraso para asegurar que las columnas estén cargadas
        });
    });
    </script>
