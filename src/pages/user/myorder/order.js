import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import { Modal,Toast } from 'antd-mobile';
import {localParam,lazyImg,setScrollTop} from '../../../assets/js/utils/util.js';
import {request} from '../../../assets/js/libs/request.js';
import UpRefresh from '../../../assets/js/libs/uprefresh.js';
import Css from '../../../assets/css/user/myorder/order.css';
class  OrderPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            status:localParam(this.props.location.search).search.status?localParam(this.props.location.search).search.status:"",
            aOrder:[]
        }
        this.oUpRefresh=null;
        this.curPage=1;
        this.maxPage=0;
        this.offsetBottom=100;
    }
    componentDidMount(){
        setScrollTop()
        this.getData();
    }
    componentWillUnmount(){
        this.oUpRefresh=null;
        this.setState=(state,callback)=>{
            return;
        }
    }
    getData(){
        let sUrl=config.baseUrl+"/api/user/myorder/index?uid="+this.props.state.user.uid+"&status="+this.state.status+"&token="+config.token+"&page="+this.curPage;
        request(sUrl).then(res=>{
            if (res.code===200){
                this.maxPage=res.pageinfo.pagenum;
                this.setState({aOrder:res.data},()=>{
                    lazyImg();
                    this.getScrollPage();
                });
            }
        })
    }
    getScrollPage(){
        this.oUpRefresh=new UpRefresh({"curPage":this.curPage,"maxPage":this.maxPage,"offsetBottom":this.offsetBottom},curPage=>{
            let sUrl=config.baseUrl+"/api/user/myorder/index?uid="+this.props.state.user.uid+"&status="+this.state.status+"&token="+config.token+"&page="+curPage;
            request(sUrl).then((res)=>{
                if (res.code===200){
                    if (res.data.length>0){
                        let aOrder=this.state.aOrder;
                        for (let i=0;i<res.data.length;i++){
                            aOrder.push(res.data[i]);
                        }
                        this.setState({aOrder:aOrder},()=>{
                            lazyImg();
                        });
                    }
                }
            });
        });
    }
    //取消订单
    cancelOrder(ordernum,index){
        Modal.alert('', '确认要取消订单吗？', [
            { text: '取消', onPress: () => {}, style: 'default' },
            { text: '确认', onPress: () => {
                    let sUrl=config.baseUrl+"/api/user/myorder/clearorder?uid="+this.props.state.user.uid+"&ordernum="+ordernum+"&token="+config.token;
                    request(sUrl).then(res=>{
                        if (res.code===200){
                            let aOrder=this.state.aOrder;
                            aOrder.splice(index, 1);
                            this.setState({aOrder:aOrder});
                        }
                    })
                }
            }
        ]);
    }
    //确认收货
    firmOrder(ordernum,index){
        let sUrl=config.baseUrl+"/api/user/myorder/finalorder?uid="+this.props.state.user.uid+"&ordernum="+ordernum+"&token="+config.token;
        request(sUrl).then(res=>{
            if (res.code===200) {
                let aOrder=this.state.aOrder;
                aOrder[index].status="2";
                this.setState({aOrder:aOrder});
            }
            Toast.info(res.data, 2);
        });
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return(
            <React.Fragment>
                {
                    this.state.aOrder.length>0?
                        this.state.aOrder.map((item,index)=>{
                            return (
                                <div className={Css['order-list']} key={index} onClick={this.pushPage.bind(this, 'order/detail?ordernum='+item.ordernum)}>
                                    <div className={Css['ordernum-wrap']}>
                                        <div className={Css['ordernum']}>订单编号：{item.ordernum}</div>
                                        <div className={Css['status']}>{item.status==='0'?"待付款":item.status==='1'?"待收货":item.status==='2'?"已收货":''}</div>
                                    </div>
                                    {
                                        item.goods!==null?
                                            item.goods.map((item2,index2)=>{
                                                return (
                                                    <div key={index2} className={Css['item-list']}>
                                                        <div className={Css['image']}><img data-echo={item2.image} src={require("../../../assets/images/common/lazyImg.jpg")} alt=""/></div>
                                                        <div className={Css['title']}>{item2.title}</div>
                                                        <div className={Css['amount']}>x {item2.amount}</div>
                                                    </div>
                                                )
                                            })
                                        :""
                                    }
                                    <div className={Css['total-wrap']}>
                                        <div className={Css['total']}>实付金额：¥{item.total}</div>
                                        {item.status!=='2'?<div className={Css['status-btn']} onClick={item.status==='0'?(e)=>{e.stopPropagation();this.cancelOrder(item.ordernum,index)}:item.status==='1'?(e)=>{e.stopPropagation();this.firmOrder(item.ordernum,index)}:()=>{}}>{item.status==='0'?"取消订单":item.status==='1'?"确认收货":""}</div>:""}
                                    </div>
                                </div>
                            )
                        })
                    :""
                }
            </React.Fragment>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(OrderPage)