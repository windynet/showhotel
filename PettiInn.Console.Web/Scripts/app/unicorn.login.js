﻿$(function () {
    var cookie_login_user = "'cookie.login.user'";
    var cookieUser = $.cookie(cookie_login_user);
    if (cookieUser && cookieUser.length) {
        $("#RememberMe").attr("checked", "checked");
        $("#UserName").val(cookieUser).keyup();
    };

    $("#aCaptcha").click(function () {
        var $captchaImg = $("#imgCaptcha");
        var src = $captchaImg.attr('src') + '?';
        $captchaImg.attr('src', src);
        $("#Captcha").val("");

        setTimeout(function () {
            $("#Captcha").focus();
        }, 500);

        return false;
    });

    function errorPlacement(error, element) {
        var errText = $(error).html(),
            err = $($.format("<span class='help-inline'>{0}</span>", errText));

        element.closest(".control-group").addClass("error");
    }

    function successPlacement(element, errorClass) {
        $(element).closest(".control-group").removeClass("error");
    }

    $("#formLogin").validate(
        {
            errorPlacement: errorPlacement,
            unhighlight: successPlacement,
            messages:
                {
                    UserName:
                        {
                            required: "请输入登录邮箱"
                        },
                    Password:
                        {
                            required: "请输入登录密码"
                        },
                    Captcha:
                        {
                            required: "请输入验证码"
                        }
                },
            submitHandler: function (form) {
                $(form).ajaxSubmit(
                {
                    dataType: "json",
                    beforeSubmit: function (formData, $form, options) {
                        $("#loginbox").block(
                            {
                                message: " "
                            });
                    },

                    success: function (responseText, statusText, xhr, element) {
                        $("#loginbox").unblock();
                        if (responseText.success) {
                            if ($("#RememberMe").is(":checked")) {
                                $.cookie(cookie_login_user, $("#UserName").val());
                            }
                            else {
                                $.cookie(cookie_login_user, null);
                            }
                            window.location = responseText.returnUrl;
                        } else {
                            $.alert(responseText.errors.join("</br>"));
                        }

                        $("#aCaptcha").click();
                    }
                });
            }
        });
});