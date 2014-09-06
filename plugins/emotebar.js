/** 
 * InfernoShoutMod Plugin
 * Emote Bar by Impulser
 */

define(['htmlparser', 'soupselect'],
    function (HtmlParser, SoupSelect) {
        var $$ = SoupSelect.select;

        return {
            init: function (mod) {
                var buttonsParent = $('input[type="button"][value="Shout"]').parent(),
                    barParent = buttonsParent.parent().parent();

                $.get("/misc.php?do=getsmilies&editorid=vB_Editor_001", function (data) {
                    new HtmlParser.Parser(new HtmlParser.HtmlBuilder(function (err, dom) {
                        if (err) {
                            console.log(err);
                        } else {
                            var rows = $$(dom, 'ul.smilielist li img'),
                                listMarkup = rows.map(function (res) {
                                    var data = /src="(.*?)" .* alt="(.*?)"/g.exec(res.raw);
                                    return '<li title="' + data[2] + '"><img src="' + data[1] + '" alt="' + data[2] + '"></li>';
                                }).join('');



                            barParent
                                .append($('<br />'))
                                .append($('<span />', {
                                        style: 'display: none;',
                                        id: 'emoteBar'
                                    })
                                    .html('<ul style="display: flex;">' + listMarkup + '</ul>'));

                            var emoteBar = $('#emoteBar'),
                                emotesButton = $("<input />").attr({
                                    type: "button",
                                    value: "Emotes",
                                    class: "button"
                                });

                            emoteBar.find('img').click(function (e) {
                                $('#vbshout_pro_shoutbox_editor').val(($('#vbshout_pro_shoutbox_editor').val() + " " + $(this).attr('alt')).trim());
                            });

                            emotesButton.click(function (e) {
                                e.preventDefault();
                                emoteBar['slideToggle'](1000);
                            });

                            emotesButton.appendTo(buttonsParent);
                        }
                    })).parseComplete(data);
                });
            }
        };
    });
