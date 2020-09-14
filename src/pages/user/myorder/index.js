import React from 'react';
import {connect} from "react-redux";
import  {Route,Switch}  from  'react-router-dom';
import asyncComponents from '../../../components/async/AsyncComponent';
import config from '../../../assets/js/conf/config.js';
import {localParam,safeAuth} from '../../../assets/js/utils/util.js';
import SubHeaderComponent from '../../../components/header/subheader';
import TagsComponent from '../../../components/tags/tags';
import Css from '../../../assets/css/user/myorder/index.css';
const OrderPage=asyncComponents(()=>import('./order'));
const ReviewPage=asyncComponents(()=>import('./review'));
class  MyOrder extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            status:localParam(this.props.location.search).search.status?localParam(this.props.location.search).search.status:"",
            title:""
        }
    }
    componentDidMount(){
        this.getTitle();
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    componentWillReceiveProps(newProps){
        this.setState({status:localParam(newProps.location.search).search.status},()=>{
            this.getTitle();
        })
    }
    getTitle(){
        switch (this.state.status){
            case "all":
                this.setState({title:"全部订单"});
                break;
            case "0":
                this.setState({title:"待付款"});
                break;
            case "1":
                this.setState({title:"待收货"});
                break;
            case "2":
                this.setState({title:"待评价"});
                break;
            default:
                this.setState({title:"全部订单"});
                break;
        }
    }
    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title={this.state.title}></SubHeaderComponent>
                <TagsComponent></TagsComponent>
                <div className={Css['main']}>
                    <Switch>
                        <Route path={config.path+"myorder/order"} component={OrderPage}></Route>
                        <Route path={config.path+"myorder/review"} component={ReviewPage}></Route>
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
})(MyOrder)