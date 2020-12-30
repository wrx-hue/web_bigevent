$(function () {
    getUserInfo()

    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录？', function (index) {
            // do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问看
            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers(请求头) 就是请求头配置对象,统一为有权限的接口设置，这个可以放在公共的baseAPI文件中
        // headers: {
        //     // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        //     Authorization: localStorage.getItem("token") || ''
        // },
        success: (res) => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用 renderAvatar渲染用户的头像函数,要渲染得把数据传过去所以实参写res.data
            renderAvatar(res.data)
        },
        error(err) { },
        // 不论成功还是失败，最终都会调用 complete回调函数，如果每一个权限的请求都去判断很麻烦，这个可以放在公共的baseAPI文件中，因为多个页面会调用
        // complete: function (res) {
        //     // 在complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.status === 1 && res.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户的头像,用形参user接受实参
function renderAvatar(user) {
    // 1. 获取用户的名称，有nickname先展示这个
    const name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需求渲染用户的头像
    if (user.user_pic) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        const first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}