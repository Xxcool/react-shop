import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import {safeAuth,localParam,setScrollTop} from '../../../assets/js/utils/util.js';
import {Picker,Toast,Modal} from 'antd-mobile';
import {province} from '../../../assets/data/province.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/home/address/add.css';
class  AddressMod extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            defaultProvince:"",
            sProvince:"",
            sCity:"",
            sArea:"",
            sName:"",
            sCellphone:'',
            sAddress:'',
            bChecked:false
        }
        this.aid=localParam(this.props.location.search).search.aid;
    }
    componentDidMount(){
        setScrollTop();
        this.getAddress();
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    pushPage(url){
        this.props.history.push(config.path+url)
    }
    //提交数据到后台
    submitData() {
        if (this.state.sName.match(/^\s*$/)) {
            Toast.info("请输入收货人姓名", 2);
            return false;
        }
        if (this.state.sCellphone.match(/^\s*$/)) {
            Toast.info("请输入联系人手机号", 2);
            return false;
        }
        if (!this.state.sCellphone.match(/^1[0-9][0-9]{9}/)) {
            Toast.info("您输入的手机号格式不正确", 2);
            return false;
        }
        if (this.state.defaultProvince.match(/^\s*$/)) {
            Toast.info("请选择所在地区", 2);
            return false;
        }
        if (this.state.sAddress.match(/^\s*$/)) {
            Toast.info("请输入详细地址", 2);
            return false;
        }
        let url = config.baseUrl + "/api/user/address/mod?token="+config.token;
        let data={
            aid:this.aid,
            uid:this.props.state.user.uid,
            name:this.state.sName,
            cellphone:this.state.sCellphone,
            province:this.state.sProvince,
            city:this.state.sCity,
            area:this.state.sArea,
            address:this.state.sAddress,
            isdefault:this.state.bChecked?"1":"0"
        };
        request(url, "post",data).then((res)=>{
            if (res.code===200){
                if (this.state.bChecked){
                    localStorage['addressId']=this.aid;
                    sessionStorage.removeItem("addressId");
                }else{
                    localStorage.removeItem("addressId");
                }
                Toast.info("修改成功",2,()=>{
                    this.props.history.goBack();
                });
            }else{
                Toast.info(res.data, 2);
            }
        });
    }
    //获取收货地址信息
    getAddress(){
        let sUrl=config.baseUrl+"/api/user/address/info?uid="+this.props.state.user.uid+"&aid="+this.aid+"&token="+config.token;
        request(sUrl).then(res=>{
            if (res.code===200){
                this.setState({sName:res.data.name,sCellphone:res.data.cellphone, sProvince:res.data.province, sCity:res.data.city, sArea:res.data.area, sAddress:res.data.address, bChecked:res.data.isdefault==="1"?true:false,defaultProvince:`${res.data.province} ${res.data.city} ${res.data.area}`});
            }
        });
    }
    //删除收货地址
    delData(){
        Modal.alert('', '确认要删除吗？', [
            { text: '取消', onPress: () => {}, style: 'default' },
            { text: '确认', onPress: () => {
                    let url=config.baseUrl+'api/user/address/del?uid='+this.props.state.user.uid+'&aid='+this.aid+'&token='+config.token;
                    request(url).then(res=>{
                        if (res.code===200){
                            if (this.aid === sessionStorage['addressId']){
                                sessionStorage.removeItem("addressId");
                            }
                            if (this.aid === localStorage['addressId']){
                                localStorage.removeItem("addressId");
                            }
                            this.props.history.goBack();
                        }
                    });
                }
            }
        ]);
    }
    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title="修收货地址" right-text="删除" onClickRightBtn={this.delData.bind(this)}></SubHeaderComponent>
                <div className={Css['main']}>
                    <ul>
                        <li>收货人</li>
                        <li><input type="text" placeholder="收货人姓名" value={this.state.sName} onChange={(e)=>{
                            this.setState({sName:e.target.value})
                        }} /></li>
                    </ul>
                    <ul>
                        <li>联系方式</li>
                        <li><input type="text" placeholder="联系人手机号" value={this.state.sCellphone} onChange={(e)=>{
                            this.setState({sCellphone:e.target.value})
                        }} /></li>
                    </ul>
                    <ul>
                        <li>所在地区</li>
                        <Picker data={province} title="选择地区" onOk={e =>{
                            this.setState({defaultProvince:e.join(" "),sProvince:e[0],sCity:e[1],sArea:e[2]!==undefined?e[2]:''});
                        }}
                        >
                        <li>
                            <input type="text" placeholder="请选择收货地址" className={Css['area']} readOnly value={this.state.defaultProvince} />
                        </li>
                        </Picker>
                    </ul>
                    <ul>
                        <li>详细地址</li>
                        <li><input type="text" placeholder="街道详细地址" value={this.state.sAddress} onChange={(e)=>{
                            this.setState({sAddress:e.target.value})
                        }} /></li>
                    </ul>
                    <ul>
                        <li>设置为默认地址</li>
                        <li><input type="checkbox" checked={this.state.bChecked} onChange={(e)=>{
                            this.setState({bChecked:!this.state.bChecked})
                        }} /></li>
                    </ul>
                    <button type="button" className={Css['submit-save']} onClick={this.submitData.bind(this)}>修改</button>
                </div>
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(AddressMod)