import React from 'react';
import config from '../../../assets/js/conf/config.js';
import {request} from "../../../assets/js/libs/request";
import IScroll from '../../../assets/js/libs/iscroll.js';
import {lazyImg,localParam} from '../../../assets/js/utils/util.js';
import UpRefresh from '../../../assets/js/libs/uprefresh.js';
import SearchComponent from '../../../components/search/search';
import Css from '../../../assets/css/home/goods/search.css';
export default class  GoodsSearch extends React.Component{
    constructor(props){
        super(props);
        this.state={
            screenMove:"",
            bMask:false,
            bPriceMenu:false,
            bSalesMenu:false,
            pageStyle:{display:"none"},
            aGoods:[],
            aPriceOrder:[
                {title:"综合",type:"all",checked:true},
                {title:"价格从低到高",type:"up",checked:false},
                {title:"价格从高到低",type:"down",checked:false}
            ],
            sKeywords:"",
            aClassify:{
                checked:true,
                items:[]
            },
            aPrice:{
                checked:true,
                items:[
                    {price1:1,price2:50,checked:false},
                    {price1:51,price2:99,checked:false},
                    {price1:100,price2:300,checked:false},
                    {price1:301,price2:1000,checked:false},
                    {price1:1001,price2:4000,checked:false},
                    {price1:4001,price2:9999,checked:false}
                ]
            },
            fPrice1:0,
            fPrice2:0,
            aAttr:[],
            itemTotal:0
        }
        this.myScroll=null;
        this.oUpRefresh=null;
        this.curPage=1;
        this.maxPage=0;
        this.offsetBottom=100;
        this.bPriceMenu=false;
        this.bSalesMenu=false;
        this.oType="all";
        this.sParams="";
        this.sKeywords="";
        this.cid="";
        this.fPrice1="";
        this.fPrice2="";
        this.sParam="";
        this.aParam=[];
    }
    componentDidMount(){
        this.myScroll= new IScroll(this.refs['screen'], {
            scrollX : false,
            scrollY : true,
            preventDefault : false
        });
        this.sKeywords=decodeURIComponent(localParam(this.props.location.search).search.keywords);
        this.setState({sKeywords:this.sKeywords});
        this.getPageData();
        this.getClassifyData();
        this.getAttrData();
    }
    //显示筛选面板
    showScreen(){
        this.refs['mask'].addEventListener("touchmove",function (e) {
            e.preventDefault();
        },false);

        this.refs['screen'].addEventListener("touchmove",function (e) {
            e.preventDefault();
        },false);
        this.setState({screenMove:Css['move'],bMask:true});
    }

    //隐藏筛选面板
    hideScreen(){
        this.setState({screenMove:Css['unmove'],bMask:false});
    }
    goBack(){
        this.props.history.goBack();
    }

    //显示隐藏价格排序
    handlePriceOrder(){
        this.bSalesMenu=false;
        this.setState({bSalesMenu:false});
        if (!this.bPriceMenu){
            this.bPriceMenu=true;
            this.setState({bPriceMenu:true})
        }else{
            this.bPriceMenu=false;
            this.setState({bPriceMenu:false})
        }
    }
    //显示隐藏销量排序
    handleSalesOrder(){
        this.bPriceMenu=false;
        this.setState({bPriceMenu:false});
        if (!this.bSalesMenu){
            this.setState({bSalesMenu:true})
        }else{
            this.setState({bSalesMenu:false})
        }
        this.oType="sales";
        this.getPageData();
    }
    getStyle(val){
        this.setState({pageStyle:val})
    }
    changeSearch(){
        this.setState({pageStyle:{display:"block"}})
    }
    getPageData(){
        this.setParams();
        let url=config.baseUrl+"/api/home/goods/search?"+this.sParams+"&page=1&token="+config.token;
        request(url).then(res=>{
            if (res.code ===200){
                this.setState({aGoods:res.data,itemTotal:res.pageinfo.total},()=>{
                    lazyImg();
                });
                this.maxPage=res.pageinfo.pagenum;
                this.getScrollPage();
            }else{
                this.setState({aGoods:[],itemTotal:0});
            }
        } )
    }
    getScrollPage(){
        this.oUpRefresh=new UpRefresh({"curPage":this.curPage,"maxPage":this.maxPage,"offsetBottom":this.offsetBottom},curPage=>{
            let url=config.baseUrl+"/api/home/goods/search?"+this.sParams+"&page="+curPage+"&token="+config.token;
            request(url).then((res)=>{
                if (res.code===200){
                    if (res.data.length>0){
                        let aGoods=this.state.aGoods;
                        for (let i=0;i<res.data.length;i++){
                            aGoods.push(res.data[i]);
                        }
                        this.setState({aGoods:aGoods},()=>{
                            lazyImg();
                        });
                    }
                }
            });
        });
    }
    setParams(){
        this.sParams="kwords="+this.sKeywords+"&param="+this.sParam+"&price1="+this.fPrice1+"&price2="+this.fPrice2+"&otype="+this.oType+"&cid="+this.cid+"";
    }
    //选择价格排序里面的值
    checkedPriceOrder(index){
        let aPriceOrder=this.state.aPriceOrder;
        for (var i=0;i<aPriceOrder.length;i++) {
            aPriceOrder[i].checked=false;
        }
        aPriceOrder[index].checked=true;
        this.setState({aPriceOrder:aPriceOrder});
        this.oType=aPriceOrder[index].type;
        this.getPageData();
    }
    getChildKeywords(val){
        this.sKeywords=val;
        this.setState({sKeywords:val,pageStyle:{display:"none"}});
        this.props.history.replace(config.path+'goods/search?keywords='+val);
        this.setReset();
        this.getPageData();
        this.getAttrData();
    }
    //分类显示隐藏
    handleClassify(){
        let aClassify=this.state.aClassify;
        if (aClassify.checked){
            aClassify.checked = false;
        } else{
            aClassify.checked = true;
        }
        this.setState({aClassify:aClassify})
    }
    //选择分类
    checkedClassify(index){
        let aClassify=this.state.aClassify;
        if (aClassify.items.length>0){
            for (let i=0;i<aClassify.items.length;i++){
                if (i!==index){
                    aClassify.items[i].checked=false;
                }
            }
            if (aClassify.items[index].checked){
                aClassify.items[index].checked=false;
                this.cid="";
            }else{
                aClassify.items[index].checked=true;
                this.cid = aClassify.items[index].cid;
            }
            this.setState({aClassify:aClassify});
        }
    }
    //价格范围显示隐藏
    handlePrice(){
        let aPrice=this.state.aPrice;
        if (aPrice.checked){
            aPrice.checked = false;
        } else{
            aPrice.checked = true;
        }
        this.setState({aPrice:aPrice})
    }
    //选择价格范围
    checkedPrice(index,price1,price2){
        let aPrice=this.state.aPrice;
        let fPrice1=price1,fPrice2=price2;
        if (aPrice.items.length>0){
            for (let i=0;i<aPrice.items.length;i++){
                if (i!==index){
                    aPrice.items[i].checked=false;
                }
            }
            if (aPrice.items[index].checked){
                aPrice.items[index].checked=false;
                fPrice1=0;
                fPrice2=0;
                this.fPrice1="";
                this.fPrice2=""
            } else{
                aPrice.items[index].checked=true;
                this.fPrice1=aPrice.items[index].price1;
                this.fPrice2 = aPrice.items[index].price2;
            }

            this.setState({aPrice:aPrice,fPrice1:fPrice1, fPrice2:fPrice2});
        }
    }
    //阻止冒泡
    preventBubble(e){
        e.stopPropagation();
    }
    //显示隐藏属性
    handleAttr(index){
        let aAttr=this.state.aAttr;

        if (aAttr[index].checked){
            aAttr[index].checked=false;
        } else{
            aAttr[index].checked=true;
        }
        this.setState({aAttr:aAttr});
    }
    //选择属性的值
    checkedParams(attrIndex,paramIndex){
        let aAttr=this.state.aAttr;
        if (aAttr[attrIndex].param[paramIndex].checked){
            aAttr[attrIndex].param[paramIndex].checked=false;
            for (let i=0;i<this.aParam.length;i++){
                if (this.aParam[i]===aAttr[attrIndex].param[paramIndex].pid){
                    this.aParam.splice(i--,1);
                    break;
                }
            }
        } else{
            aAttr[attrIndex].param[paramIndex].checked=true;
            this.aParam.push(aAttr[attrIndex].param[paramIndex].pid);
        }
        this.sParam = this.aParam.length>0?JSON.stringify(this.aParam):"";
        this.setState({aAttr:aAttr});
    }

    //获取分类数据
    getClassifyData(){
        let url=config.baseUrl+"/api/home/category/menu?token="+config.token;
        request(url).then(res=>{
            if (res.code ===200){
                let aClassify=this.state.aClassify;
                aClassify.items=res.data;
                for (let i=0;i<res.data.length;i++){
                    aClassify.items[i].checked=false;
                }
                this.setState({aClassify:aClassify},()=>{
                    this.myScroll.refresh();
                });
            }
        })
    }

    //获取属性数据
    getAttrData(){
        let url=config.baseUrl+"/api/home/goods/param?kwords="+this.sKeywords+"&token="+config.token;
        request(url).then(res=>{
            if (res.code ===200){
                let aAttr=res.data;
                for (let i=0;i<aAttr.length;i++){
                    aAttr[i].checked=true;
                    if (aAttr[i].param.length>0){
                        for (let j=0;j<aAttr[i].param.length;j++){
                            aAttr[i].param[j].checked=false;
                        }
                    }
                }
                this.setState({aAttr:aAttr},()=>{
                    this.myScroll.refresh();
                });
            }
        })
    }
    goSearch(){
        this.hideScreen();
        this.getPageData();
    }
    //监听价格范围最低价的值
    changePrice1(e){
        this.setState({fPrice1:e.target.value.replace(/[a-zA-Z]|[\u4e00-\u9fa5]|[#|*|,|+|;]/g,'')},()=>{
            this.fPrice1=this.state.fPrice1;
        })
    }
    //监听价格范围最高价的值
    changePrice2(e){
        this.setState({fPrice2:e.target.value.replace(/[a-zA-Z]|[\u4e00-\u9fa5]|[#|*|,|+|;]/g,'')},()=>{
            this.fPrice2=this.state.fPrice2;
        })
    }
    //全部重置
    setReset(){
        this.sParam="";
        this.aParam=[];
        this.cid = "";
        this.fPrice1="";
        this.fPrice2="";
        this.oType = "all";

        //分类重置
        let aClassify=this.state.aClassify;
        if (aClassify.items.length>0){
            for (let i=0;i<aClassify.items.length;i++){
                aClassify.items[i].checked=false;
            }
        }

        //价格范围重置
        let aPrice=this.state.aPrice;
        for (let i=0;i<aPrice.items.length;i++){
            aPrice.items[i].checked=false;
        }

        //属性重置
        let aAttr=this.state.aAttr;
        if (aAttr.length>0){
            for (let i=0;i<aAttr.length;i++){
                if (aAttr[i].param.length>0){
                    for (let j=0;j<aAttr[i].param.length;j++){
                        aAttr[i].param[j].checked=false;
                    }
                }
            }
        }

        this.setState({fPrice1:0,fPrice2:0,aClassify:aClassify,aPrice:aPrice,aAttr:aAttr})
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return(
            <div className={Css['page']}>
                <div className={Css['search-top']}>
                    <div className={Css['search-header']}>
                        <div className={Css['back']} onClick={this.goBack.bind(this)}></div>
                        <div className={Css['search-wrap']}>
                            <div className={Css['search-icon']}></div>
                            <div className={Css['search-text']} onClick={this.changeSearch.bind(this)}>{this.state.sKeywords}</div>
                        </div>
                        <div className={Css['screen-btn']} onClick={this.showScreen.bind(this)}>筛选</div>
                    </div>
                    <div className={Css['order-main']}>
                        <div className={this.state.bPriceMenu?Css['order-item']+" "+Css['active']:Css['order-item']} onClick={this.handlePriceOrder.bind(this)}>
                            <div className={Css["order-text"]}>综合</div>
                            <div className={Css['order-icon']}></div>
                            <ul className={this.state.bPriceMenu?Css['order-menu']:Css['order-menu']+" hide"}>
                                {
                                    this.state.aPriceOrder.map((item,index)=>{
                                        return(
                                            <li key={index} onClick={this.checkedPriceOrder.bind(this,index)} className={item.checked?Css['active']:''}>{item.title}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className={this.state.bSalesMenu?Css['order-item']+" "+Css['active']:Css['order-item']} onClick={this.handleSalesOrder.bind(this)}>
                            <div className={Css["order-text"]}>销量</div>
                        </div>
                    </div>
                </div>
                <div className={Css['goods-main']}>
                    {
                        this.state.aGoods.length>0?
                            this.state.aGoods.map((item,index)=>{
                                return (
                                    <div key={index} className={Css['goods-list']} onClick={this.pushPage.bind(this, 'goods/details/item?gid='+item.gid)}>
                                        <div className={Css['image']}><img data-echo={item.image} src={require("../../../assets/images/common/lazyImg.jpg")} alt={item.title}/></div>
                                        <div className={Css['goods-content']}>
                                            <div className={Css['goods-title']}>{item.title}</div>
                                            <div className={Css['price']}>¥{item.price}</div>
                                            <div className={Css['sales']}>销量<span>{item.sales}</span>件</div>
                                        </div>
                                    </div>
                                )
                            })
                        :<div className="null-item">没有相关商品！</div>
                    }
                </div>
                <div ref="mask" className={this.state.bMask?Css['mask']:Css['mask']+" hide"} onClick={this.hideScreen.bind(this)}></div>
                <div ref="screen" className={Css['screen']+" "+this.state.screenMove}>
                    <div>
                        <div className={Css['attr-wrap']}>
                            <div className={Css['attr-title-wrap']} onClick={this.handleClassify.bind(this)}>
                                <div className={Css['attr-name']}>分类</div>
                                <div className={this.state.aClassify.checked?Css['attr-icon']:Css['attr-icon']+" "+Css['up']}></div>
                            </div>
                            <div className={this.state.aClassify.checked?Css['item-wrap']:Css['item-wrap']+" height-hide"}>
                                {
                                    this.state.aClassify.items.length>0?
                                        this.state.aClassify.items.map((item,index)=>{
                                            return (
                                                <div key={index} className={item.checked?Css['item']+" "+Css['active']:Css['item']} onClick={this.checkedClassify.bind(this, index)}>{item.title}</div>
                                            )
                                        })
                                    :""
                                }
                            </div>
                        </div>
                        <div style={{width:"100%",height:"1px",backgroundColor:"#EFEFEF"}}></div>
                        <div className={Css['attr-wrap']}>
                            <div className={Css['attr-title-wrap']} onClick={this.handlePrice.bind(this)}>
                                <div className={Css['attr-name']}>价格区间</div>
                                <div className={Css['price-wrap']}>
                                    <div className={Css['price-input']} onClick={this.preventBubble.bind(this)}><input type="tel" placeholder="最低价" value={this.state.fPrice1===0?'':this.state.fPrice1} onChange={this.changePrice1.bind(this)} /></div>
                                    <div className={Css['price-line']}></div>
                                    <div className={Css['price-input']} onClick={this.preventBubble.bind(this)}><input type="tel" placeholder="最高价" value={this.state.fPrice2===0?'':this.state.fPrice2} onChange={this.changePrice2.bind(this)} /></div>
                                </div>
                                <div className={Css['attr-icon']}></div>
                            </div>
                            <div className={this.state.aPrice.checked?Css['item-wrap']:Css['item-wrap']+" height-hide"}>
                                {
                                    this.state.aPrice.items.map((item,index)=>{
                                        return (
                                            <div key={index} className={item.checked?Css['item']+" "+Css['active']:Css['item']} onClick={this.checkedPrice.bind(this, index,item.price1, item.price2)}>{item.price1}-{item.price2}</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div style={{width:"100%",height:"0.3rem",backgroundColor:"#EFEFEF"}}></div>
                        {
                            this.state.aAttr.length>0?
                                this.state.aAttr.map((item, index)=>{
                                    return (
                                        <React.Fragment key={index}>
                                            <div className={Css['attr-wrap']}>
                                                <div className={Css['attr-title-wrap']} onClick={this.handleAttr.bind(this,index)}>
                                                    <div className={Css['attr-name']}>{item.title}</div>
                                                    <div className={item.checked?Css['attr-icon']:Css['attr-icon']+" "+Css['up']}></div>
                                                </div>
                                                <div className={item.checked?Css['item-wrap']:Css['item-wrap']+" height-hide"}>
                                                    {
                                                        item.param.length>0?
                                                            item.param.map((item2, index2)=>{
                                                                return (
                                                                    <div className={item2.checked?Css['item']+" "+Css['active']:Css['item']} key={index2} onClick={this.checkedParams.bind(this, index, index2)}>{item2.title}</div>
                                                                )
                                                            })
                                                        :''
                                                    }
                                                </div>
                                            </div>
                                            <div style={{width:"100%",height:"1px",backgroundColor:"#EFEFEF"}}></div>
                                        </React.Fragment>
                                    )
                                })
                            :""
                        }
                        <div style={{width:"100%",height:"1.2rem"}}></div>
                    </div>
                    <div className={Css['handel-wrap']}>
                        <div className={Css['item']}>共<span>{this.state.itemTotal}</span>件</div>
                        <div className={Css['item']+" "+Css['reset']} onClick={this.setReset.bind(this)}>全部重置</div>
                        <div className={Css['item']+" "+Css['sure']} onClick={this.goSearch.bind(this)}>确定</div>
                    </div>
                </div>
                <SearchComponent pageStyle={this.state.pageStyle} childStyle={this.getStyle.bind(this)} isLocal="1" childKeywords={this.getChildKeywords.bind(this)} keywords={this.state.sKeywords}></SearchComponent>
            </div>
        );
    }
}