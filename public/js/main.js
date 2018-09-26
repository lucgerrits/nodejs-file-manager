var table;
var contextmenu_data;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function popitup(url, windowName) {
    newwindow = window.open(url, windowName, 'height=' + (parseInt(window.innerHeight) * 0.3) + ',width=' + (parseInt(window.innerWidth) * 0.3) + '');
    if (window.focus) {
        newwindow.focus()
    }
    return false;
}
/*js for right click*/
function setcontextmenu() {
    $(".dataTable tbody tr").bind("contextmenu", function(event) {
        contextmenu_data = table.row($(this)).data();
        //console.log(contextmenu_data)
        // Avoid the real one
        event.preventDefault();
        // Show contextmenu
        $(".custom-menu").finish().toggle(100).
        // In the right position (the mouse)
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
    });
    // If the document is clicked somewhere
    $(document).bind("mousedown", function(e) {
        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu").length > 0) {
            // Hide it
            $(".custom-menu").hide(100);
        }
    });
    // If the menu element is clicked
    $(".custom-menu li").click(function() {
        // This is the triggered action name
        switch ($(this).attr("data-action")) {
            // A case for each action. Your actions here
            case "open":
                if (contextmenu_data[3] == "directory") {
                    window.location.href = "/?path=" + contextmenu_data[4];
                } else {
                    //openInNewTab("file?path=" + contextmenu_data[4]);
                    popitup("/file/open?path=" + contextmenu_data[4], "file");
                }
                break;
            case "upload":
                $("#upload_file_input").click();
            break;
            case "download":
                window.location.href = "/file/download/?path=" + contextmenu_data[4];
            break;

        }
        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });
}
$(document).ready(function() {
    function loadtable(path) {
        if (table) {
            table.destroy();
        }
        table = $('#example').DataTable({
            "ajax": '/api/show/?path=' + encodeURIComponent(path),
            "iDisplayLength": 25,
            "initComplete": function(settings, json) {
                setcontextmenu();
            }
        });
        if (path) {
            var text = "<a href='/'><i class=\"fas fa-home\"></i></a>";
            var subpath = "";
            path.split("/").map(elem => {
                if (elem != "") {
                    subpath += "/" + elem;
                    text += "<a href='/?path=" + subpath + "'>/" + elem + "</a>";
                }
            });
            $("#path").html(text);
        }
    }
    var path = getParameterByName("path");
    if (path) {
        loadtable(path);
    } else {
        loadtable("");
    }
    /*js for table load*/
    $('.dataTable').on('click', 'tbody tr', function() {
        //console.log('API row values : ', table.row(this).data());
        var row_data = table.row(this).data();
        if (row_data[3] == "directory") {
            window.location.href = "/?path=" + row_data[4];
        } else {
            //openInNewTab("file?path=" + row_data[4]);
            popitup("/file/open?path=" + row_data[4], "file");
        }
    })
    /*js for file upload*/
    $("#upload_file_button").click(function() {
        $("#upload_file_input").click();
    })
    $("#upload_file_input").change(function() {
        $("#upload_file").submit();
    })
    $("#upload_file").submit(function(e) { //form to create a new box
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: $(this).attr("action") + "?path=" + (getParameterByName("path") ? getParameterByName("path") : "/"),
            type: 'POST',
            data: formData,
            success: function(data) {
                //alert(data);
                location.reload();
            },
            error: function(xhr) {
                alert(xhr.responseText)
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    $("#create_folder").submit(function(e) { //form to create a new box
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: $(this).attr("action") + "?path=" + (getParameterByName("path") ? getParameterByName("path") + $("#create_folder_path").val() : "/" + $("#create_folder_path").val()),
            type: 'POST',
            data: formData,
            success: function(data) {
                location.reload();
            },
            error: function(xhr) {
                alert(xhr.responseText)
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

});