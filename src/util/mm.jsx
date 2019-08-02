/*
* @Author: Rosen
* @Date:   2018-01-23 22:54:28
* @Last Modified by:   Rosen
* @Last Modified time: 2018-01-31 14:21:22
*/

class MUtil {
    request(param) {
        // Promise 支持链式调用
        return new Promise((resolve, reject) => {
            $.ajax({
                type: param.type || 'get',
                url: param.url || '',
                dataType: param.dataType || 'json',
                data: param.data || null,
                success: res => {
                    // 在这里仅对http的状态进行拦截
                    // 数据请求成功
                    if (0 === res.status) {
                        typeof resolve === 'function' && resolve(res.data, res.msg);
                    }
                    // 没有登录状态，强制登录
                    else if (10 === res.status) {
                        this.doLogin();
                    }
                    else {
                        typeof reject === 'function' && reject(res.msg || res.data);
                    }
                },
                error: err => {
                    typeof reject === 'function' && reject(err.statusText);
                }
            });
        });
    }
    // 跳转登录
    doLogin() {
        // 带上redirect参数，标识从哪里跳转过来的
        // pathname中可能存在特殊字符，使用encodeURIComponent处理以下，保证字符串是安全的
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
    // 从URL读取特定的参数
    getUrlParam(name) {
        let queryString = window.location.search.split('?')[1] || '', //从地址栏地址中获得?号之后的参数s
            reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), // 编写正则匹配规则，param=123&param1=456
            result = queryString.match(reg);    //执行正则匹配，结果result是一个数组
        // match匹配的返回结果['param=123（完整匹配的）','第一个括号匹配','第二个括号匹配','第三个括号匹配']，所以参数值取第三个
        return result ? decodeURIComponent(result[2]) : null;
    }
    // 成功提示
    successTips(successMsg) {
        alert(successMsg || '操作成功！');
    }
    // 错误提示
    errorTips(errMsg) {
        alert(errMsg || '好像哪里不对了~');
    }
    // 本地存储
    setStorage(name, data) {
        let dataType = typeof data;
        // json对象
        if (dataType === 'object') {
            window.localStorage.setItem(name, JSON.stringify(data));
        }
        // 基础类型
        else if (['number', 'string', 'boolean'].indexOf(dataType) >= 0) {
            window.localStorage.setItem(name, data);
        }
        // 其他不支持的类型
        else {
            alert('该类型不能用于本地存储');
        }
    }
    // 取出本地存储内容
    getStorage(name) {
        let data = window.localStorage.getItem(name);
        if (data) {
            return JSON.parse(data);
        }
        else {
            return '';
        }
    }
    // 删除本地存储
    removeStorage(name) {
        window.localStorage.removeItem(name);
    }
}

export default MUtil;