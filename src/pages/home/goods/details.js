import React from 'react';
import {connect} from "react-redux";
import  {Route,Switch,Redirect}  from  'react-router-dom';
import asyncComponents from '../../../components/async/AsyncComponent';
import config from '../../../assets/js/conf/config.js';
import {localParam} from '../../../assets/js/utils/util.js';
import Css from '../../../assets/css/home/goods/details.css';
const DetailsItem=asyncComponents(()=>import('./details_item'));
const DetailsContent=asyncComponents(()=>import('./details_content'));
const DetailsReviews=asyncComponents(()=>import('./details_reviews'));
class GoodsDetails extends React.Component{
    constructor(props){
        super(props);
        this.state={
            gid:props.location.search!==''?localParam(props.location.search).search.gid:'',
            tabStyle:{
                bItem:true,
                bContent:false,
                bReviews:false
            }
        }
    }
    componentDidMount(){
        this.setTabStyle(this.props);
    }
    componentWillReceiveProps(newProps){
        this.setTabStyle(newProps);
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    //设置选项卡切换的样式
    setTabStyle(props){
        switch (props.location.pathname){
            case config.path+'goods/details/item':
                this.setState({tabStyle:{bItem:true,bContent:false,bReviews:false}});
                break;
            case config.path+'goods/details/content':
                this.setState({tabStyle:{bItem:false,bContent:true,bReviews:false}});
                break;
            case config.path+'goods/details/reviews':
                this.setState({tabStyle:{bItem:false,bContent:false,bReviews:true}});
                break;
            default:
                this.setState({tabStyle:{bItem:true,bContent:false,bReviews:false}});
                break;
        }
    }
    goBack(){
        this.props.history.goBack();
    }
    replacePage(url){
        this.props.history.replace(config.path+url);
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return(
            <div>
                <div className={Css['details-header']}>
                    <div className={Css['back']} onClick={this.goBack.bind(this)}></div>
                    <div className={Css['tab-wrap']}>
                        <div className={this.state.tabStyle.bItem?Css['tab-name']+" "+Css['active']:Css['tab-name']} onClick={this.replacePage.bind(this, 'goods/details/item?gid='+this.state.gid+'')}>商品</div>
                        <div className={this.state.tabStyle.bContent?Css['tab-name']+" "+Css['active']:Css['tab-name']} onClick={this.replacePage.bind(this, 'goods/details/content?gid='+this.state.gid+'')}>详情</div>
                        <div className={this.state.tabStyle.bReviews?Css['tab-name']+" "+Css['active']:Css['tab-name']} onClick={this.replacePage.bind(this, 'goods/details/reviews?gid='+this.state.gid+'')}>评价</div>
                    </div>
                    <div id="cart-icon" className={Css['cart-icon']} onClick={this.pushPage.bind(this, 'home/cart')}>
                        <div className={this.props.state.cart.aCartData.length>0?Css['spot']:Css['spot']+" hide"}></div>
                    </div>
                </div>
                <div className={Css['sub-page']}>
                    <Switch>
                        <Route path={config.path+"goods/details/item"} component={DetailsItem}></Route>
                        <Route path={config.path+"goods/details/content"} component={DetailsContent}></Route>
                        <Route path={config.path+"goods/details/reviews"} component={DetailsReviews}></Route>
                        <Redirect to={config.path+"goods/details/item"}></Redirect>
                    </Switch>
                </div>
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(GoodsDetails)