import React from 'react'
import Audio from "../audio/audio.jsx"
import "./index.less"
import {HashRouter, Switch, Route, Link} from "react-router-dom"
import Recommend from "../header/recommend/index.jsx"
import Search from "../header/search/index.jsx"
import User from "../header/user/user.jsx"
import MusicPlaying from "../header/musicPlaying/index.jsx"
import { connect } from 'react-redux'
import { setPageTitle, setInfoList } from '../../../src/store/action.jsx'

class Home extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount () {
		let { setPageTitle, setInfoList } = this.props;

		// 触发setPageTitle action
		setPageTitle('新的标题');

		// 触发setInfoList action
		setInfoList()
	}

	render() {
		let { pageTitle, infoList } = this.props;
		return <div>
			<HashRouter>
				<div>
					<div className="header-box-container">
						<div className="header-box"><Link to="/user" replace>我的</Link></div>
						<div className="header-box"><Link to="/" replace>推荐</Link></div>
						<div className="header-box"><Link to="/playing" replace>播放</Link></div>
						<div className="header-box"><Link to="/search" replace>搜索</Link></div>
					</div>
					<Switch>
						<Route path="/user" component={User}/>
						<Route exact path="/" component={Recommend}/>
						<Route path="/playing" component={MusicPlaying}/>
						<Route path="/search" component={Search}/>
					</Switch>
					<Audio url="http://www.ytmp3.cn/?down/47153.mp3" data={infoList}/>
				</div>
			</HashRouter>
		</div>
	}
}

// mapStateToProps：将state映射到组件的props中
const mapStateToProps = (state) => {
	return {
		pageTitle: state.pageTitle,
		infoList: state.infoList
	}
};

// mapDispatchToProps：将dispatch映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setPageTitle (data) {
			dispatch(setPageTitle(data))
			// 执行setPageTitle会返回一个函数
			// 这正是redux-thunk的所用之处:异步action
			// 上行代码相当于
			/*dispatch((dispatch, getState) => {
					dispatch({ type: 'SET_PAGE_TITLE', data: data })
			)*/
		},
		setInfoList (data) {
			dispatch(setInfoList(data))
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
