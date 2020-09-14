import React from 'react';
import {connect} from "react-redux";
import {Toast} from 'antd-mobile';
import Css from '../../../assets/css/home/balance/index.css';
import config from "../../../assets/js/conf/config";
import {request} from '../../../assets/js/libs/request.js';
import {safeAuth,setScrollTop} from '../../../assets/js/utils/util.js';
import SubHeaderComponent from '../../../components/header/subheader';
class BalanceIndex extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            sName:"",
            sCellphone:"",
            sProvince:"",
            sCity:"",
            sArea:"",
            sAddress:""
        };
        this.bSubmit=true;
    }
    replacePage(url){
        this.props.history.replace(config.path+url);
    }
    componentDidMount(){
        setScrollTop();
        if (sessionStorage['addressId']!==undefined){
            this.getSelectAddress();
        }else{
            this.getDefaultAddress();
        }
    }
    //获取选择收货地址
    getSelectAddress(){
        if (sessionStorage['addressId']!==undefined){
            let sUrl=config.baseUrl+"/api/user/address/info?uid="+this.props.state.user.uid+"&aid="+sessionStorage['addressId']+"&token="+config.token;
            request(sUrl).then(res=>{
                if (res.code===200){
                    localStorage['addressId']=res.data.aid;
                    this.setState({sName:res.data.name, sCellphone:res.data.cellphone,sProvince:res.data.province, sCity:res.data.city,sArea:res.data.area, sAddress:res.data.sAddress})
                }
            });
        }
    }
    //获取默认收货地址
    getDefaultAddress(){
        let sUrl=config.baseUrl+"/api/user/address/defaultAddress?uid="+this.props.state.user.uid+"&token="+config.token;
        request(sUrl).then(res=>{
            if (res.code===200){
                localStorage['addressId']=res.data.aid
                this.setState({sName:res.data.name, sCellphone:res.data.cellphone,sProvince:res.data.province, sCity:res.data.city,sArea:res.data.area, sAddress:res.data.sAddress})
            }
        });
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    //提交收货地址
    submitOrder(){
        let sAddressId=sessionStorage['addressId'] || localStorage['addressId'];
        if (sAddressId!==undefined){
            if (this.props.state.cart.total>0){
                if (this.bSubmit){
                    this.bSubmit=false;
                    let sUrl=config.baseUrl+"/api/order/add?token="+config.token;
                    let jData={
                        uid:this.props.state.user.uid,
                        freight:this.props.state.cart.freight,
                        addsid:sAddressId,
                        goodsData:JSON.stringify(this.props.state.cart.aCartData)
                    };
                    request(sUrl, "post",jData).then(res=>{
                        if (res.code===200){
                            this.props.history.push(config.path+"balance/end");
                        }
                    });
                }

            } else{
                Toast.info('您的购物车里还没有商品！',2);
            }
        }else{
            Toast.info('请选择收货地址',2);
        }
    }
    render(){
        return (
            <div className={Css['page']}>
                <SubHeaderComponent title="确认订单"></SubHeaderComponent>
                <div className={Css['main']}>
                    <div className={Css['address-wrap']} onClick={this.replacePage.bind(this, 'address/index')}>
                        {
                            sessionStorage['addressId']!==undefined || localStorage['addressId']!==undefined?
                                <React.Fragment>
                                    <div className={Css['persion-info']}>
                                        <span>收货人：{this.state.sName}</span><span>{this.state.sCellphone}</span>
                                    </div>
                                    <div className={Css['address']}>
                                        <img src={require("../../../assets/images/home/cart/map.png")} alt="收货地址"/><span>{this.state.sProvince}{this.state.sCity}{this.state.sArea}{this.state.sAddress}</span>
                                    </div>
                                </React.Fragment>
                                :
                                <div className={Css['address-null']}>您的收货地址为空,点击添加收货地址</div>
                        }
                        <div className={Css['arrow']}></div>
                        <div className={Css['address-border-wrap']}>
                            <div className={Css['trapezoid']+" "+Css['style1']}></div>
                            <div className={Css['trapezoid']+" "+Css['style2']}></div>
                            <div className={Css['trapezoid']+" "+Css['style1']}></div>
                            <div className={Css['trapezoid']+" "+Css['style2']}></div>
                            <div className={Css['trapezoid']+" "+Css['style1']}></div>
                            <div className={Css['trapezoid']+" "+Css['style2']}></div>
                            <div className={Css['trapezoid']+" "+Css['style1']}></div>
                            <div className={Css['trapezoid']+" "+Css['style2']}></div>
                            <div className={Css['trapezoid']+" "+Css['style1']}></div>
                            <div className={Css['trapezoid']+" "+Css['style2']}></div>
                        </div>
                    </div>
                    <div className={Css['goods-wrap']}>
                        {
                            this.props.state.cart.aCartData.length>0?
                                this.props.state.cart.aCartData.map((item,index)=>{
                                    return (
                                        item.checked?
                                            <div className={Css['goods-list']} key={index}>
                                                <div className={Css['image']}><img src={item.img} alt={item.title}/></div>
                                                <div className={Css['goods-param']}>
                                                    <div className={Css['title']}>{item.title}</div>
                                                    <div className={Css['attr']}>
                                                        {
                                                            item.attrs.length>0?
                                                                item.attrs.map((item2,index2)=>{
                                                                    return(
                                                                        <span key={index2}>{item2.title}：
                                                                        {
                                                                            item2.param.length>0?
                                                                                item2.param.map((item3,index3)=>{
                                                                                    return(
                                                                                        <React.Fragment key={index3}>{item3.title}</React.Fragment>
                                                                                    )
                                                                                })
        :''
                                                                        }
                                                                        </span>
                                                                    )
                                                                })
                                                            :''
                                                        }

                                                    </div>
                                                    <div className={Css['amount']}>x {item.amount}</div>
                                                    <div className={Css['price']}>￥{item.price}</div>
                                                </div>
                                            </div>
                                        :""
                                    )
                                })
                            :""
                        }
                    </div>
                    <ul className={Css['total-wrap']}>
                        <li>商品总额</li>
                        <li>￥{this.props.state.cart.total}</li>
                    </ul>
                    <ul className={Css['total-wrap']}>
                        <li>运费</li>
                        <li>￥{this.props.state.cart.freight}</li>
                    </ul>
                </div>
                <div className={Css['balance-wrap']}>
                    <div className={Css['price-wrap']}>
                        <span>实际金额：</span><span>￥{parseFloat(Math.round(this.props.state.cart.total+this.props.state.cart.freight).toFixed(2))}</span>
                    </div>
                    <div className={Css['balance-btn']} onClick={this.submitOrder.bind(this)}>提交订单</div>
                </div>
            </div>
        )
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(BalanceIndex)