$(function () {
    // let form = layui.form
    const { form } = layui

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样哦！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        // 阻止了默认提交事件
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                // 重置表单 ， 后面加[0]是将其转化为原生dom文档，reset是layui提供的方法，只对原生的form对象有用，对jq对象无效
                $('.layui-form')[0].reset()
                // 更新完密码后，跳转到登录页面
                window.parent.location.href = '/login.html'
            }
        })

    })
})