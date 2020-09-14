import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import {safeAuth,setScrollTop} from '../../../assets/js/utils/util.js';
import { Modal} from 'antd-mobile';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/home/address/index.css';
class  AddressIndex extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            aAddress:[]
        }
    }
    componentDidMount(){
        setScrollTop()
        this.getAddress();
    }
    pushPage(url){
        this.props.history.push(config.path+url)
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    //删除收货地址
    delAddress(e,index,aid){
        e.stopPropagation();
        Modal.alert('', '确认要删除吗？', [
            { text: '取消', onPress: () => {}, style: 'default' },
            { text: '确认', onPress: () => {
                    let aAddress=this.state.aAddress;
                    aAddress.splice(index, 1);
                    this.setState({aAddress:aAddress});
                    let sUrl=config.baseUrl+"/api/user/address/del?uid="+this.props.state.user.uid+"&aid="+aid+"&token="+config.token;
                    request(sUrl).then(res=>{
                        if (res.code===200){
                            if (aid === sessionStorage['addressId']){
                                sessionStorage.removeItem("addressId");
                            }
                            if (aid === localStorage['addressId']){
                                localStorage.removeItem("addressId");
                            }
                        }
                    });
                }
            }
        ]);
    }
    //获取收货地址列表
    getAddress(){
        let sUrl=config.baseUrl+"/api/user/address/index?uid="+this.props.state.user.uid+"&token="+config.token;
        request(sUrl).then(res=>{
            if (res.code===200){
                this.setState({aAddress:res.data});
            }
        });
    }
    //选择收货地址
    selectAddress(aid){
        sessionStorage['addressId']=aid;
        this.props.history.replace(config.path+"balance/index");
    }
    //修改收货地址
    modAddress(e,aid){
        e.stopPropagation();
        this.pushPage('address/mod?aid='+aid)
    }
    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title="选择收货地址"></SubHeaderComponent>
                <div className={Css['main']}>
                    <div className={Css['address-nav']}>
                        <div className={Css['address-nav-name-1']}>配送地址</div>
                        <div className={Css['address-nav-name-2']} onClick={this.pushPage.bind(this, 'address/add')}>+添加收货地址</div>
                    </div>
                    {
                        this.state.aAddress.length>0?
                            this.state.aAddress.map((item,index)=>{
                                return (
                                    <div className={Css['address-list']} key={index} onClick={this.selectAddress.bind(this,item.aid)}>
                                        <div className={Css['address-info-wrap']}>
                                            {item.isdefault==='1'?<div className={Css['check-mark']}></div>:''}
                                            <div className={Css['address-info']+" "+Css['default']}>
                                                <div className={Css['person']}><span>{item.name}</span><span>{item.cellphone}</span></div>
                                                <div className={Css['address']}>
                                                    {item.isdefault==='1'?<span className={Css['default']}>默认</span>:''}
                                                    <span className={Css['text']}>{item.province}{item.city}{item.area}{item.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={Css['handle-wrap']}>
                                            <div className={Css['edit']} onClick={(e)=>{this.modAddress(e, item.aid)}}></div>
                                            <div className={Css['del']} onClick={(e)=>{this.delAddress(e,index,item.aid)}}></div>
                                        </div>
                                    </div>
                                )
                            })
                        :<div className="null-item">您还没有添加收货地址！</div>
                    }
                </div>
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(AddressIndex)