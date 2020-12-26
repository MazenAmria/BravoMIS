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