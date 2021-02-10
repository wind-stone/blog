/* 开始--图片裁剪功能 */
    /**
     * 该函数用于图片的裁剪功能
     *
     * @param {Object} option 参数描述
     *     @param {string} option.picType：列表图片--"list-image"，详情图片--"details-image"
     *     @param {number} option.previewWidth：预览框的宽度
     *     @param {number} option.previewHeight：预览框的高度
     *     @param {number} option.hid：酒店ID，用于查找房型
     *     @param {number} option.rtid：房型ID，用于查找房型
     * @return {Object} 
     */
function imageClipping(option) {

        var tmpl = '<div class="image-popup">' +
                        '    <h2><span class="left">图片上传</span><span class="image-close">×</span></h2>' +
                        '    <div class="image-container">' +
                        '        <div>' +
                        '            <input type="file" class="btn btn-primary image-input" >' +
                        '            <span class="tips">仅支持JPG GIF PNG格式图片 图片大小不超过2M</span>' +
                        '        </div>' +
                        '        <div class="image-interception  mg-t-20">' +
                        '            <div class="init-ctn">' +
                        '                <img src="" class="image-init">' +
                        '            </div>' +
                        '            <div class="vertical-line"></div>' +
                        '            <div class="preview-pane">' +
                        '                <div class="preview-ctn">' +
                        '                    <img src="" class="jcrop-preview">' +
                        '                </div>' +
                        '                <span class="preview-tips">图片尺寸 318*214</span>' +
                        '            </div>' +
                        '        </div>' +
                        '        <div class="image-coord">' +
                        '            <span class="image-w"></span>*<span class="image-h"></span>' +
                        '            <span class="image-x1"></span>*<span class="image-y1"></span>' +
                        '            <span class="image-x2"></span>*<span class="image-y2"></span>' +
                        '            <span class="image-w2"></span>*<span class="image-h2"></span>' +
                        '        </div>' +
                        '        <div class="mg-t-20"><a class="btn btn-primary image-save">保存</a><span class="warning image-warning"></span></div>' +
                        '    </div>' +
                        '</div>' ;

        var $tmpl = $(tmpl);

        $(document.body).append($tmpl);
        $(document.body).append('<div class="image-clipping-overlay"></div>');

        //  保存 jcrop 变量，以便进行销毁或者操作
        var jcrop_api;

        // 遮盖层显示、图片截取弹出框显示
        $(".image-clipping-overlay").show();
        $(".image-popup").show();

        // 设置 图片预览框的大小
        // 
        var previewPanelWidth = parseInt($('.preview-pane').css("width"));
        var previewPanelHeight = parseInt($('.preview-pane').css("height"));
        var previewVertivalPadding = 0;
        var previewHorizontalPadding =0;
        if (option.previewWidth <= previewPanelWidth && option.previewHeight <= previewPanelHeight) {
            previewHorizontalPadding= (previewPanelWidth - option.previewWidth) / 2;
            previewVertivalPadding = (previewPanelHeight - option.previewHeight) / 2;
        }
        $(".preview-ctn").css({
            "width": option.previewWidth + "px",
            "height": option.previewHeight + "px"
        });
        $('.preview-pane').css({
            "padding-left":  previewHorizontalPadding + "px",
            "padding-right":  previewHorizontalPadding + "px",
            "padding-top":  previewVertivalPadding + "px"
        });
        $(".preview-tips").html("图片尺寸 " + option.previewWidth + "*" + option.previewHeight);

        //  给图片弹出框添加 change 事件
        $(".image-input").change(function () {

            var uploadImage = $(".image-input")[0].files[0];
            var reg = /^(image\/jpeg|image\/png)$/i;
            if (! reg.test(uploadImage.type)) {
                alert("请选择图像文件！");
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {

                // 要显示图片的 load 事件 
                $(".image-init")[0].onload = function () {

                    $(".image-init").css({
                                "width": "0",
                                "height": "0"
                    });
                    $(".init-ctn").css("padding", 0);

                    // 在更换新图片时，必须清除上一次 jcrop 插件的作用，否则会引起图片大小问题
                    if (typeof jcrop_api != 'undefined') {
                        jcrop_api.destroy();
                        console.log("Jcrop destroy---------------------");
                    }
                    // 原始图片包含框的宽高值
                    var ctnWidth = parseInt($(".init-ctn").css("width"));
                    var ctnHeight = parseInt($(".init-ctn").css("height"));
                    var ctnRate = ctnWidth / ctnHeight;

                    // 上传图片的宽高值及宽高比
                    var naturalHeight = $(this).prop("naturalHeight");
                    var naturalWidth = $(this).prop("naturalWidth");
                    var rate = naturalWidth / naturalHeight;

                    // 原始图片包含框上下边距、左右边距
                    var vertivalPadding = 0;
                    var horizontalPadding = 0;

                    if (naturalHeight < ctnHeight && naturalWidth < ctnWidth) {
                        vertivalPadding = (ctnHeight - naturalHeight)/2;
                        horizontalPadding = (ctnWidth - naturalWidth)/2;
                        $(".init-ctn").css("padding-top", vertivalPadding + "px");
                        $(".init-ctn").css("padding-bottom", vertivalPadding + "px");
                        $(".init-ctn").css("padding-left", horizontalPadding + "px");
                        $(".init-ctn").css("padding-right", horizontalPadding + "px");
                        $(".image-init").css({
                            "width": naturalWidth + "px",
                            "height": naturalHeight + "px"
                        });
                    } else{
                        /* 
                         * 超过包含框宽度或者高度时，保证图片竖直方向或者水平方向居中
                         * 当宽高比超过400/300时，图片宽度占据包含框全部宽度，高度居中显示，添加包含框的上下内边距
                         * 当宽高比低于400/300时，图片高度占据包含框全部高度，宽度居中显示，添加包含框的左右内边距
                         */
                        if (rate >= ctnRate) {
                            var vertivalPadding = (ctnHeight - ctnWidth / rate)/2;
                            $(".init-ctn").css("padding-top", vertivalPadding + "px");
                            $(".init-ctn").css("padding-bottom", vertivalPadding + "px");
                            $(".init-ctn").css("padding-left", 0);
                            $(".init-ctn").css("padding-right", 0);
                            $(".image-init").css({
                                "width": (ctnWidth + "px"),
                                "height": (ctnWidth / rate + "px")
                            });
                        } else {
                            var horizontalPadding = (ctnWidth - ctnHeight * rate)/2;
                            $(".init-ctn").css("padding-left", horizontalPadding + "px");
                            $(".init-ctn").css("padding-right", horizontalPadding + "px");
                            $(".init-ctn").css("padding-top", 0);
                            $(".init-ctn").css("padding-bottom", 0);
                            $(".image-init").css({
                                "width": (ctnHeight * rate + "px"),
                                "height": (ctnHeight + "px")
                            });
                        }
                    }
                    // Create variables (in this scope) to hold the API and image size
                    var boundx;
                    var boundy;

                    // Grab some information about the preview pane
                    var $preview = $('.preview-pane');
                    var $pcnt = $('.preview-ctn');
                    var $pimg = $('.preview-ctn img');

                    var xsize = $pcnt.width();
                    var ysize = $pcnt.height();

                    // destroy Jcrop if it is existed
                    if (typeof jcrop_api != 'undefined') {
                        jcrop_api.destroy();
                        console.log("Jcrop destroy");
                    }
                    $(".image-init").Jcrop({
                        onChange: updatePreview,
                        onSelect: updatePreview,
                        aspectRatio: xsize / ysize,
                        allowResize: true, //  不允许选框缩放
                        allowSelect: true // 不允许重新设置新选框
                    }, function(){
                        // Use the API to get the real image size
                        var bounds = this.getBounds();
                        boundx = bounds[0];
                        boundy = bounds[1];
                        // Store the API in the jcrop_api variable
                        jcrop_api = this;

                        // Move the preview into the jcrop container for css positioning
                        //$preview.appendTo(jcrop_api.ui.holder);
                    });

                    function updatePreview(c) {

                        if (parseInt(c.w) > 0) {
                            var rx = xsize / c.w;
                            var ry = ysize / c.h;
                            $pimg.css({
                              width: Math.round(rx * boundx) + 'px',
                              height: Math.round(ry * boundy) + 'px',
                              marginLeft: '-' + Math.round(rx * c.x) + 'px',
                              marginTop: '-' + Math.round(ry * c.y) + 'px'
                            });
                        }

                        // 压缩比 = 图片原始宽度 / 图片显示宽度
                        var compressionRate = naturalWidth / parseFloat($(".image-init").css("width"));
                        var x1 = parseInt(c.x * compressionRate);
                        var y1 = parseInt(c.y * compressionRate);
                        var x2 = parseInt(c.x2 * compressionRate);
                        var y2 = parseInt(c.y2 * compressionRate);
                        var w2 = parseInt(c.w * compressionRate);
                        var h2 = parseInt(c.h * compressionRate);
                        $(".image-w").html(naturalWidth);
                        $(".image-h").html(naturalHeight);
                        $(".image-x1").html(x1);
                        $(".image-y1").html(y1);
                        $(".image-x2").html(x2);
                        $(".image-y2").html(y2);
                        $(".image-w2").html(w2);
                        $(".image-h2").html(h2);
                    };
                };
                $(".image-init").attr("src", e.target.result);
                $(".jcrop-preview").attr("src", e.target.result);
            }
            reader.readAsDataURL(uploadImage);
        });
        
/* 开始--保存--上传图片 */
        $(".image-save").click(function () {
            // FormData 对象
            // 
            if (!$(".image-input")[0].files[0]) {
                $(".image-warning").html("请选择上传的图片！").show();
                alert("请选择上传的图片！");
                return;
            } else{
                var uploadImage = $(".image-input")[0].files[0];
                var reg = /^(image\/jpeg|image\/png)$/i;
                if (! reg.test(uploadImage.type)) {
                    alert("文件类型有错！");
                    $(".image-warning").html("请选择图像文件！").show();
                    return;
                }
            }
            if (!$(".image-x1").text()) {
                $(".image-warning").html("请先裁剪图片！").show();
                return;
            }

            option.callback({
                photo: $(".image-input")[0].files[0],
                px1: $(".image-x1").text(),
                py1: $(".image-y1").text(),
                px2: $(".image-x2").text(),
                py2: $(".image-y2").text(),
                w: option.previewWidth,
                h: option.previewHeight,
                "room_type": option["room_type"],
                type: option.type
            });
            $(".image-popup").hide().remove();
            $(".image-clipping-overlay").hide().remove();
        });
/* 结束--保存--上传图片 */

        // 点击 图片截取浮层 的 “×”，关闭图片截取浮层
        $(document.body).on("click", ".image-close", function () {
            $(".image-popup").hide().remove();
            $(".image-clipping-overlay").hide().remove();
        });
}
/* 结束--图片裁剪功能 */
    
