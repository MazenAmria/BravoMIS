$(document).ready(function(){
    let eventHandlers = function(){
        var $row = $(this);
        $row.find(".editRow").on('click', function(){
            $row.find(".editRow, .deleteRow").css("display", "none");
            $row.find(".fEditRow, .cEditRow").css("display", "inline-block");
            $row.find("td").not(":last-child").each(function(){
                $(this).html(`<input name='${$(this).attr('name')}' value='${$(this).text()}'>`);
            });
        });
        $row.find(".cEditRow").on('click', function(){
            $row.find(".editRow, .deleteRow").css("display", "inline-block");
            $row.find(".fEditRow, .cEditRow").css("display", "none");
            $row.find("td").each(function(){
                $(this).text($(this).find("input").attr('value'));
            });
        });
        $row.find(".fEditRow").on('click', function(){
            let obj = {};
            $row.find("input").each(function(){
                obj[($(this).attr('name'))] = $(this).val();
            });
            $.ajax({
                url: `/edit`,
                type: `POST`,
                data: obj,
                success: function() {
                    $row.find("td").each(function(){
                        $(this).text($(this).find("input").val());
                    });
                },
                error: function(err) {
                    $row.find("td").each(function(){
                        $(this).text($(this).find(".original-data").val());
                    });
                    alert(`Failed to edit item: status ` + err.status);
                }
            });
            $row.find(".editRow, .deleteRow").css("display", "inline-block");
            $row.find(".fEditRow, .cEditRow").css("display", "none");
        });
        $row.find(".deleteRow").on('click', function(){
            let itemId = $row.find("td[name=itemId]").text();
            $.ajax({
                url: `/delete/${itemId}`,
                type: 'DELETE',
                success: function() {
                    $row.remove();
                },
                error: function(err) {
                    alert(`Failed to delete item: status ` + err.status);
                }
            });
        });
    }
    $(".addr").each(function(){
        var $row = $(this);
        let obj = {};
        $(".add-new").on('click', function(){
            let addnew = "<tr class='clearfix addednew'>";
            $row.find("input").each(function(){
                obj[$(this).attr('name').trim()] = $(this).val();
                addnew += `<td name="${$(this).attr('name').trim()}">${$(this).val()}</td>`;
            });
            addnew += `
                <td>
                    <button class='editRow'>
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="fEditRow">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="cEditRow">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class='deleteRow'>
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
            `;
            $.ajax({
                url: `/add`,
                type: `POST`,
                data: obj,
                success: function() {
                    $(addnew).insertBefore($(".table tbody .addr"));
                    $(".table tbody .addr input").val("");
                    $(".table tbody tr.addednew").each(eventHandlers);
                },
                error: function(err) {
                    alert(`Failed to add item: status ` + err.status);
                }
            });            
        });
    });
    $(".table tbody tr").not(".addr").each(eventHandlers);
});