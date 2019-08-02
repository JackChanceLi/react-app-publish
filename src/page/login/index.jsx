/*
* @Author: Rosen
* @Date:   2018-01-25 17:37:22
* @Last Modified by:   Rosen
* @Last Modified time: 2018-01-26 12:29:31
*/
import React from 'react';
import MUtil from 'util/mm.jsx'
import User from 'service/user-service.jsx'

const _mm = new MUtil();
const _user = new User();

import './index.scss';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            redirect: _mm.getUrlParam('redirect') || '/'
            //从url读取参数，跳转来源（登录成功后要成功回去），为空的话就跳转到根首页
        }
    }
    componentWillMount() {
        // 设置网页标签名字
        document.title = '登录 - MMALL ADMIN';
    }
    //多个事件通过一个函数实现
    //通过e.target.value 以及e.target.name来进行区分和处理
    onInputChange(e) {
        let inputValue = e.target.value, // 输入的值
            inputName = e.target.name;  // 输入的字段名
        this.setState({
            [inputName]: inputValue    // 语法，覆盖修改名为inputName的值
        });
    }
    // 回车登录的实现
    onInputKeyUp(e) {
        if (e.keyCode === 13) {
            this.onSubmit();
        }
    }
    // 用户提交表单
    onSubmit() {
        let loginInfo = {
            username: this.state.username,
            password: this.state.password
        },
            checkResult = _user.checkLoginInfo(loginInfo); //检查输入是否合法
        // 验证通过
        if (checkResult.status) {
            // 登录请求
            _user.login(loginInfo)
                .then((res) => {
                    _mm.setStorage('userInfo', res);
                    this.props.history.push(this.state.redirect);
                }, (errMsg) => {
                    _mm.errorTips(errMsg);
                });
        }
        // 验证不通过
        else {
            _mm.errorTips(checkResult.msg);
        }

    }
    render() {
        return (
            <div className="col-md-4 col-md-offset-4">
                <div className="panel panel-default login-panel">
                    <div className="panel-heading">欢迎登录 - MMALL管理系统</div>
                    <div className="panel-body">
                        <div>
                            <div className="form-group">
                                <input type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="请输入用户名"
                                    onKeyUp={e => this.onInputKeyUp(e)}
                                    onChange={e => this.onInputChange(e)} />
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="请输入密码"
                                    onKeyUp={e => this.onInputKeyUp(e)}
                                    onChange={e => this.onInputChange(e)} />
                            </div>
                            <button className="btn btn-lg btn-primary btn-block"
                                onClick={e => { this.onSubmit(e) }}>登录</button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Login;