$(document).ready(function () {
    $('denied').cssCharts({ type: "donut" }).trigger('show-donut-chart');
    $('altered').cssCharts({ type: "donut" }).trigger('show-donut-chart');
    $('approved').cssCharts({ type: "donut" }).trigger('show-donut-chart');
});
    /*$('#total').attr('text', "total");
    $('#total').attr('data-dimension', "250");
    $('#total').attr('data-info', "Requests");
    $('#total').attr('data-width', "30");
    $('#total').attr('data-fontsize', "38");
    $('#total').attr('data-fgcolor', "#FFF");
    $('#total').attr('data-bgcolor', "#EEE");
    $('#total').attr('data-fill', "#DDD");
    $('#total').attr('animationStep', "5");
    $('#total').attr('foregroundBorderWidth', "5");
    $('#total').attr('backgroundBorderWidth', "15");
    $('#total').attr('percent', "total");
    $('#total').circliful(//{
            //percent: "total"
        //}
        );
        /*$('#denied').circliful({
            /*animationStep: 5,
            foregroundBorderWidth: 5,
            backgroundBorderWidth: 15,
            percent: 75
        });
        $('#altered').circliful({
            /*animationStep: 5,
            foregroundBorderWidth: 5,
            backgroundBorderWidth: 15,
            percent: 75
        });
        $('#approved').circliful({
            /*animationStep: 5,
            foregroundBorderWidth: 5,
            backgroundBorderWidth: 15,
            percent: 75
        });
    });*/