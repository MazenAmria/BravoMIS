$(document).ready(function(){
    const menuItems = [...$('.menu-item')];
    if(menuItems.length > 0) menuItems[0].click();
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

function route(path) {
    event.preventDefault();
    $.ajax({
        url: path,
        method: 'GET',
        data: {},
        success: (data, status) => {
            $('page-template').html(data);
        }
    });
}

function styleTables(options, tableCount) {
    if (!options) options = {};
    if (!options.onDelete) options.onDelete = function ( e, buttonApi, dataTable, node, config )  {
        let selectedRows = buttonApi.rows( {selected: true} ).data();
        for (let i = 0; i < selectedRows.length; i++) console.log(selectedRows[i]);
    }
    if (!options.onEdit) options.onEdit = function ( e, buttonApi, dataTable, node, config )  {
        let selectedRows = buttonApi.rows( {selected: true} ).data();
        for (let i = 0; i < selectedRows.length; i++) console.log(selectedRows[i]);
    }
    let table = $(`.genericTable${tableCount}`).DataTable({
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
        if(selectedRows > 0){
            if(selectedRows == 1){
                table.button( 1 ).enable(true);
            }else{
                table.button( 1 ).enable(false);
            }
            table.button( 0 ).enable(true);
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
    <table class="genericTable<%= tableCount %> display" style="width:100%">
        <thead>
        <tr>
            <% for (const column of columns) { %>
                <th><%= column %></th>
            <% } %>
        </tr>
        </thead>
        <tbody>
        <% for (const tuple of tuples) { %>
            <tr>
                <% for (const cell in tuple) { %>
                    <td field='<%= cell %>'><%= tuple[cell] %></td>
                <% } %>
            </tr>
        <% } %>
        </tbody>
    </table>
</div>`;

const errTemplate = `<div class="widget">
    <div class="widget-title">
        <h2><span><%= errCode %></span> <%= errMessage %></h2>
    </div>
</div>`;

const popUpTemplate = `<div class="pop-up widget">
    ${tableTemplate}
</div>`;

const tenderFormTemplate = `<div class="widget">
    <div class="widget-title">
        <h2>مناقصة <span>جديدة</span></h2>
    </div>
    <form>
        <div class="row">
            <label for="requestId" class="col-xs-4">رقم الطلب</label>
            <input type="text" class="col-xs-8">
        </div>
        <input type="text">
        <input type="text">
        <input type="text">
    </form>
</div>`;

function hidePopUp() {
    let popUps = [...$('.pop-up')];
    if(popUps.length > 0)
        if (event.clientX < popUps[0].offsetLeft ||
            event.clientX > (popUps[0].offsetLeft + popUps[0].offsetWidth) ||
            event.clientY < popUps[0].offsetTop ||
            event.clientY > (popUps[0].offsetTop + popUps[0].offsetHeight))
            $('pop-up-template').html('');
}
