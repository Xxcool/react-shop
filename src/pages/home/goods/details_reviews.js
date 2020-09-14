import React from 'react';
import config from '../../../assets/js/conf/config.js';
import {request} from "../../../assets/js/libs/request";
import {lazyImg,localParam} from '../../../assets/js/utils/util.js';
import Css from '../../../assets/css/home/goods/details_reviews.css';
import UpRefresh from "../../../assets/js/libs/uprefresh";
export default class  DetailsReviews extends React.Component{
    constructor(props){
        super(props);
        this.state={
            aReviews:[],
            iReviewTotal:0,
            gid:props.location.search!==''?localParam(props.location.search).search.gid:''
        }
        this.oUpRefresh=null;
        this.curPage=1;
        this.maxPage=0;
        this.offsetBottom=100;
    }
    componentDidMount(){
        this.getReviews();
    }
    getReviews(){
        let sUrl=config.baseUrl+"/api/home/reviews/index?gid="+this.state.gid+"&token="+config.token+"&page=1";
        request(sUrl).then((res)=>{
            if (res.code===200){
                this.setState({aReviews:res.data, iReviewTotal:res.pageinfo.total},()=>{
                    lazyImg();
                });
                this.maxPage=res.pageinfo.pagenum;
                this.getScrollPage();
            }else{
                this.setState({aReviews:[]})
            }
        });
    }
    getScrollPage(){
        this.oUpRefresh=new UpRefresh({"curPage":this.curPage,"maxPage":this.maxPage,"offsetBottom":this.offsetBottom},curPage=>{
            let sUrl=config.baseUrl+"/api/home/reviews/index?gid="+this.state.gid+"&token="+config.token+"&page="+curPage;
            request(sUrl).then((res)=>{
                if (res.code===200){
                    if (res.data.length>0){
                        let aReviews=this.state.aReviews;
                        for (let i=0;i<res.data.length;i++){
                            aReviews.push(res.data[i]);
                        }
                        this.setState({aReviews:aReviews},()=>{
                            lazyImg();
                        });
                    }
                }
            });
        });
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    render(){
        return(
            <div className={Css['page']}>
                <div className={Css['reviews-main']}>
                    <div className={Css["reviews-title"]}>商品评价（{this.state.iReviewTotal}）</div>
                    <div className={Css['reviews-wrap']}>
                        {
                            this.state.aReviews.length>0?
                                this.state.aReviews.map((item, index)=>{
                                    return (
                                        <div className={Css['reviews-list']} key={index}>
                                            <div className={Css['uinfo']}>
                                                <div className={Css['head']}><img alt={item.nickname} data-echo={item.head} src={require("../../../assets/images/common/lazyImg.jpg")}  /></div>
                                                <div className={Css['nickname']}>{item.nickname}</div>
                                            </div>
                                            <div className={Css['reviews-content']}>{item.content}</div>
                                            <div className={Css['reviews-date']}>{item.times}</div>
                                        </div>
                                    )
                                })
                            :""
                        }
                    </div>
                </div>
            </div>
        );
    }
}