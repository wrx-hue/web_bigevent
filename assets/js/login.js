$(function () {
    // 点击去注册按钮
    $("#link_reg").on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录按钮
    $("#link_login").on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    /* 
    const layer = layui.layer
    const form = layui.form 
    */
    // 对象解构，变量的名字匹配对象的属性，如果匹配成功，则将对象属性的值赋值给变量
    const { form, layer } = layui
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,16}$/, '密码不符合规则，需要输入6-16位，且不能输入空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次输入的密码不一致！'
            }
        }
    })


    // 监听注册表单的提交事件
    $("#form_reg").on('submit', function (e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        $.ajax({
            url: '/api/reguser',
            method: "POST",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 模拟人的点击事件，注册成功后自动跳往登录页面
                $('#link_login').click()
            }
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: "POST",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功')
                // 将登录成功的 token 字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})