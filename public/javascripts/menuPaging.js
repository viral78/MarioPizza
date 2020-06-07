$(document).ready(function () {
    $('#pizzaLink').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/menu/pizzas',
            success: function (renderedEjs) {
                $(".dynamic-menu-container").html(renderedEjs);
            },
            error: function (err) {
                if (err) throw err;
            }
        });
    });

    $('#pastaLink').on('click', function () {

        $.ajax({
            type: 'GET',
            url: '/menu/pastas',
            success: function (renderedEjs) {
                $(".dynamic-menu-container").html(renderedEjs);

            },
            error: function (err) {
                if (err) throw err;
            }
        });
    });

    $('#burgerLink').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/menu/burgers',
            success: function (renderedEjs) {
                $(".dynamic-menu-container").html(renderedEjs);
            },
            error: function (err) {
                if (err) throw err;
            }
        });
    });

    $('#drinkLink').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/menu/drinks',
            success: function (renderedEjs) {
                $(".dynamic-menu-container").html(renderedEjs);
            },
            error: function (err) {
                if (err) throw err;
            }
        });
    });

    $('#searchSubmit').on('click', function () {
        let searchVal = $('#searchField').val();
        let filterVal = $('#filterField').val();

        $.ajax({
            type: 'POST',
            url: '/menu/search',
            data: { search: searchVal, filter: filterVal },
            success: function (renderedEjs) {
                $(".dynamic-menu-container").html(renderedEjs);
            },
            error: function (err) {
                if (err) throw err;
            }
        });
    });

    $('.dynamic-menu-container').on('click', 'a.orderButton', function () {

        let arr = $(this).data("value").split("::")
        let itemName = arr[0];
        let itemPrice = arr[1].substring(1);
        let itemCategory = arr[2];
        let userId = arr[3];
        $('#itemName').val(itemName);
        $('#itemPrice').val(itemPrice);
        if (itemCategory != 'pizza') {
            $('#exampleModal2').modal('show');

        }
        else {
            $('#exampleModal').modal('show');
        }
    });

    $('.dynamic-menu-container').on('click', 'button#addCartBtn', function () {

        let userId = $('#userId').val();
        $.ajax({
            type: 'POST',
            url: '/menu/addCart/' + userId,
            data: $("#addCartForm").serialize(),
            success: function (response) {
                if (response.redirect) {
                    window.location = response.redirectURL;


                }
            },
            error: function (err) {
                if (err) throw err;
            }
        });

    });

    $('.dynamic-menu-container').on('click', 'button#addOtherCartBtn', function () {
        let userId = $('#userId').val();
        let itemName = $('#itemName').val();
        let itemPrice = $('#itemPrice').val();
        let quantity = $('#quantSelect').val();
        $.ajax({
            type: 'POST',
            url: '/menu/addCart/' + userId,
            data: {
                itemName: itemName,
                veggies: [],
                optradio: "NA",
                optradio1: "NA",
                quantity: quantity,
                itemPrice: itemPrice
            },
            success: function (response) {
                if (response.redirect) {
                    window.location = response.redirectURL;


                }
            },
            error: function (err) {
                if (err) throw err;
            }
        });
    });


});