$(document).ready(function(){
    $(".alert").each(function(){
        let $this = $(this);
        $this.find(".close").on('click', function(){
            $this.fadeOut(200);
        })
    });
    $("#loginForm").on('submit', function(event){
        event.preventDefault();
        let username = $('.username').val(),
            password = $('.password').val();

        $.ajax({
            url: `/login`,
            type: `POST`,
            data: {username, password},
            success: function(){
                location.assign("/");
            },
            error: function(err){
                $("#loginForm .alert").fadeIn();
            }
        });
    });
    $('#table_id').DataTable({
        select: {
            style: 'multi'
        },
        language: {
            url: 'DatatablesArabic.json'
        }
    });

});

function styleTables(options) {
    if (!options) options = {};
    if (!options.onDelete) options.onDelete = function ( e, dt, node, config ) {
        alert('لاريب');
    }
    if (!options.onEdit) options.onEdit = function ( e, dt, node, config ) {
        alert('لاريب');
    }
    let table = $('.genericTable').DataTable({
        dom: 'Blfrtip',
        select: {
            style: 'multi'
        },
        language: {
            url: 'DatatablesArabic.json'
        },
        buttons: [
            {
                text: 'حذف',
                attr: { id: 'deleteButton' },
                enabled: false,
                action: options.onDelete
            },
            {
                text: 'تعديل',
                attr: {id: 'editButton' },
                enabled: false,
                action: options.onEdit
            }
        ]
    });

    table.on('select deselect', function ( e, dt, type, indexes ) {
        let selectedRows = table.rows( { selected: true } ).count();
        console.log(table.rows( { selected: true } ).data().length);
        if(selectedRows > 0){
            table.button( 0 ).enable(true);
            table.button( 1 ).enable(true);
        }else{
            table.button( 0 ).enable(false);
            table.button( 1 ).enable(false);
        }
    });
}

const tableTemplate = `<div class='generic-table widget'>
    <div class='widget-title'>
        <h2><%= title %></h2>
    </div>
    <table class="genericTable display" style="width:100%">
        <thead>
        <tr>
            <% if (data.length > 0) { %>
                <% for (const column in data[0]) { %>
                    <th><%= column %></th>
                <% } %>
            <% } %>
        </tr>
        </thead>
        <tbody>
        <% for (const tuple of data) { %>
            <tr>
                <% for (const cell in tuple) { %>
                    <td><%= tuple[cell] %></td>
                <% } %>
            </tr>
        <% } %>
        </tbody>
    </table>
</div>`;
