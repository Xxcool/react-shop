import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import {safeAuth,setScrollTop} from '../../../assets/js/utils/util.js';
import {request} from '../../../assets/js/libs/request.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/user/address/index.css';
class  UserAddressIndex extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            datas:[]
        }
    }
    componentDidMount(){
        setScrollTop();
        this.getData();
    }

    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    getData(){
        let url=config.baseUrl+"/api/user/address/index?uid="+this.props.state.user.uid+"&token="+config.token;
        request(url).then(res=>{
            if (res.code===200){
                this.setState({datas:res.data});
            }
        })
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title="收货地址管理"></SubHeaderComponent>
                <div className={Css['main']}>
                    {
                        this.state.datas.length>0?
                            this.state.datas.map((item,index)=>{
                                return (
                                    <div className={Css['list']} key={index} onClick={this.pushPage.bind(this, 'user/address/mod?aid='+item.aid)}>
                                        <div className={Css['name-wrap']}>
                                            <span>{item.name}</span><span>{item.cellphone}</span>
                                        </div>
                                        <div className={Css['address']}>
                                            {item.isdefault==='1'?<span>[默认]</span>:''}{item.province}{item.city}{item.area}{item.address}
                                        </div>
                                        <div className={Css['right-arrow']}></div>
                                    </div>
                                )
                            })
                        :""
                    }
                    <div style={{width:"100%",height:"1.3rem"}}></div>
                </div>
                <div className={Css['add-btn']} onClick={this.pushPage.bind(this, 'address/add')}>+ 添加新地址</div>
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(UserAddressIndex)