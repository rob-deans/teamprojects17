/**
 * Created by Rob on 13/02/2016.
 * Tag allows you to dynamically add a tag and delete etc
 */

;(function ($) {

    var defaults = {
        text: undefined,
        atLeastOne: false,
        data: {},
        css: {
            colour: 'black',
            fontColour: 'white',
            "list-style": "none",
            "padding": "0",
            "font-size" : "100%"
        },
        inputName: 'tagValues',
        removeable: true,
        maximum : 100
    };

    var internalPrefix = '_tag';

    $.fn.tag = function (method) {
        if ( functions[method] ) {
            return functions[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof method === 'object' || !method) {
            return functions.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tag' );
        }

    };

    var functions = {
        init: function (options) {
            return this.each(function () {
                $this = $(this);
                if (!($this.find("input").length)) {
                    var settings = $.extend({}, defaults, options || {});
                    var $hidden = $("<input type='hidden' name='" + settings.inputName + "' id='" + settings.inputName + "'>");
                    $this.append($hidden);
                    $this.data(internalPrefix, settings);
                }
            });
        },
        addTag: function (data) {
            var duplicate = false;
            var settings = $(this).data(internalPrefix);
            if($(this).children().length <= settings.maximum) {
                this.children(".tag").each(function (i) {
                    $child = $(this);
                    if ($child.text().substring(0, $child.text().length - 1) == data) {
                        duplicate = true;
                    }
                });
                if (!duplicate) {
                    var $this = $(this);
                    functions['getValues']($this, settings, data);
                }
            }
        },
        getValues: function ($this, settings, data) {
            var tag = "<span class='tag'>" + data + "<span class='tag-close'>x</span></span>";
            var $tag = $(tag);
            $this.append($tag);
            $tag.css(settings.css);
            if (settings.data['data-beg'] != null) {
                $tag.attr('data-beg', settings.data['data-beg']);
                $tag.attr('data-end', settings.data['data-end']);
            }
            var $hidden = $this.find("input");
            if ($hidden.val() == "") {
                $hidden.val(data);
            } else {
                $hidden.val($hidden.val() + "," + data);
            }

            $this.data = settings;
            $(".tag-close").unbind('click');
            closeListener();
            return $this;
        },
        deleteTag: function ($this) {
            var text = $this.parent().text().substring(0, $this.parent().text().length - 1);
            var $hidden = $this.parent().parent().find("input");
            var values = $hidden.val().split(",");
            var valString = "";
            for (var i = 0; i < values.length; i++) {
                if (text == values[i]) {
                    delete values[i];
                } else {
                    valString += valString == "" ? values[i] : "," + values[i];
                }
            }
            $hidden.val(valString);
            $this.parent().remove();
        }
    };

    function closeListener() {
        $(".tag-close").click(function (e) {
            var $this = $(this);
            var settings = $this.parent().parent().data(internalPrefix);
            if(settings.removeable){
                if(settings.atLeastOne) {
                    if($this.parent().parent().children().length > 2) {
                        functions['deleteTag']($this);
                    }
                } else {
                    functions['deleteTag']($this);
                }
            }

        });
    }
})(jQuery);