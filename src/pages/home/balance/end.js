import React from 'react';
import {connect} from "react-redux";
import Css from '../../../assets/css/home/balance/end.css';
import config from "../../../assets/js/conf/config";
import {request} from '../../../assets/js/libs/request.js';
import {safeAuth,setScrollTop} from '../../../assets/js/utils/util.js';
import SubHeaderComponent from '../../../components/header/subheader';
class BalanceEnd extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            orderNum:""
        };

    }

    componentDidMount(){
        setScrollTop();
        this.getOrdernum();
    }

    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    //获取订单编号
    getOrdernum(){
        let sUrl=config.baseUrl+"/api/order/lastordernum?uid="+this.props.state.user.uid+"&token="+config.token;
        request(sUrl).then(res=>{
            if (res.code===200){
                this.setState({orderNum:res.data.ordernum});
            }
        });
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return (
            <div className={Css['page']}>
                <SubHeaderComponent title="订单结束"></SubHeaderComponent>
                <div className={Css['main']}>
                    <div className={Css['list']+" "+Css['success']}>订购成功！</div>
                    <div className={Css['list']+" "+Css['ordernum']}>订单编号：{this.state.orderNum}</div>
                    <div className={Css['list']} onClick={this.pushPage.bind(this, 'myorder/order?status=all')}>查看订单</div>
                    <div className={Css['pay-btn']}>去付款</div>
                </div>
            </div>
        )
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(BalanceEnd)