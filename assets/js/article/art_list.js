$(function () {
    const { layer, form, laypage } = layui
    let q = {
        pagenum: 1,  // 页码值，默认请求第一页的数据
        pagesize: 5,    // 每页显示几条数据，默认每页显示2条
        cate_id: '',    // 文章分类的 Id
        state: ''   // 文章的发布状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    initTable()
    initCate()

    // 获取列表的数据
    function initTable() {
        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 实现筛选的功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的 `renderPage` 方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',    // 分页容器的 Id
            count: total,   // 总数据条数
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum,    // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],  // 每页显示多少条
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump(obj, first) {
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                if (!first) {
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                    initTable()
                }
            }
        })

    }


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 点击删除按钮的时候，就获取到删除按钮的个数，说明有几条数据
        const len = $('.btn-delete').length
        // 获取到文章的 id
        let id = $(this).attr('data-id')
        // 用户点击确认，发送请求，删除当前文章，携带文章`id`
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    // 请求成功之后，获取最新的文章列表信息
                    layer.msg('删除文章成功！')

                    if (len === 1 && q.pagenum !== 1) {
                        // 这里执行页码值-1的操作
                        q.pagenum--
                    }
                    initTable()
                }
            })
            // 关闭当前弹出层
            layer.close(index)
        })
    })
})