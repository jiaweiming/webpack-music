import React from "react"
import "./index.less"
import { Progress, Button, Icon } from 'antd'
import { connect } from "react-redux"
import store from "../stores/index.jsx"
import { setSongTitle, setSongAvatar, setSongAuthor, setSongIsPlaying } from '../../components/stores/action.jsx'

class Audio extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allTime: 0,
			currentTime: 0,
			isPlay: true,
			musicList:store.getState().infoList,
			percentProgress: 0,
			showLists: false,
			playing: true,
			currentAuthor: '小潘潘&小峰峰',
			currentUrl: 'http://www.ytmp3.cn/?down/47153.mp3',
			currentTitle: '学猫叫',
			currentAvatar: 'http://p1.music.126.net/D1Ov-XMAwUzsr16mQk95fA==/109951163256119128.jpg?param=500y500'
		};
		this.next = this.next.bind(this);
		this.last = this.last.bind(this);
		this.play = this.play.bind(this);
		this.musicEnd = this.musicEnd.bind(this);
		this.formatTime = this.formatTime.bind(this);
		this.toggleLists = this.toggleLists.bind(this);
		this.playMusicFromList = this.playMusicFromList.bind(this);
		store.subscribe(() => {
			let initState = store.getState();
			this.setState({
				musicList:initState.infoList
			})
	});
	}

	componentDidMount() {
		let { setSongTitle, setSongAvatar, setSongAuthor, setSongIsPlaying } = this.props;
		// 触发setPageTitle action
		setSongTitle(this.state.currentTitle);
		setSongAvatar(this.state.currentAvatar);
		setSongAuthor(this.state.currentAuthor);
		setSongIsPlaying(this.state.playing)
	}

	//移除当前歌曲
	removeSong(index){
		let currentSongList = this.state.musicList;
		currentSongList.splice(index,1);
		this.setState({
			musicList:currentSongList
		})
	}
	//播放暂停
	play() {
		let { setSongIsPlaying } = this.props;
		this.setState({
			isPlay: !this.state.isPlay
		})
		setSongIsPlaying(this.state.playing)
	};

	//格式化时间，两位数
	formatTime(time) {
		const second = Math.floor(time % 60);
		let minutes = Math.floor(time / 60);
		return `0${minutes}:${second > 9 ? second : `0${second}`}`
	};

	//控制显示，根据参数决定
	controlAudio(type, value) {
		const audio = document.getElementById("my-audio");
		switch (type) {
			case 'allTime':
				this.setState({
					allTime: audio.duration
				});
				break;
			case 'currentTime':
				this.setState({
					currentTime: audio.currentTime
				});
				break;
			case 'play':
				this.setState({
					isPlay: true
				});
				audio.play();
				break;
			case 'pause':
				this.setState({
					isPlay: false
				});
				audio.pause();
				break;
			case 'changeCurrentTime':
				this.setState({
					currentTime: value
				});
				if (value === audio.duration) {
					this.setState({
						isPlay: false
					})
				}
				break;
			case 'getCurrentTime':
				this.setState({
					currentTime: audio.currentTime
				});
				if (audio.currentTime === audio.duration) {
					this.setState({
						isPlay: false
					})
				}
		}
	};

	last() {  //上一首切换
		const audio = document.getElementById("my-audio");
		let current = '';
		let myData = this.state.musicList;
		myData.map((value, index) => {
			if (value.url === audio.currentSrc) {
				current = index
			}
		});
		if (current >= 2) {
			audio.src = myData[current - 1].url;
			let { setSongTitle, setSongAvatar, setSongAuthor } = this.props;
			// 触发action
			setSongTitle(myData[current - 1].title);
			setSongAvatar(myData[current - 1].avatar);
			setSongAuthor(myData[current - 1].author);
		} else {
			audio.src = myData[current].url;
			let { setSongTitle, setSongAvatar, setSongAuthor } = this.props;
			// 触发action
			setSongTitle(myData[current].title);
			setSongAvatar(myData[current].avatar);
			setSongAuthor(myData[current].author);
		}
		audio.load();
		audio.play()
	}

	next() {  //下一首,获取当前歌曲url在数组中位置，修改索引值
		const audio = document.getElementById("my-audio");
		let current = '';
		let myData = this.state.musicList;
		audio.pause();
		myData.map((value, index) => {
			if (value.url === audio.currentSrc) {
				current = index;
			}
		});
		if (current <= myData.length) {
			audio.src = myData[current + 1].url;
			let { setSongTitle, setSongAvatar, setSongAuthor } = this.props;
			// 触发action
			setSongTitle(myData[current + 1].title);
			setSongAvatar(myData[current + 1].avatar);
			setSongAuthor(myData[current + 1].author);
		} else {
			audio.src = myData[current].url;
			let { setSongTitle, setSongAvatar, setSongAuthor } = this.props;
			// 触发action
			setSongTitle(myData[current].title);
			setSongAvatar(myData[current].avatar);
			setSongAuthor(myData[current].author);
		}
		audio.load();
		audio.play()
	}

	musicEnd() { //播放结束，随机下一首
		let myData = this.state.musicList;
		const audio = document.getElementById("my-audio");
		const randomNumber = Math.floor(Math.random() * myData.length);
		audio.src = myData[randomNumber].url;
		let { setSongTitle, setSongAvatar, setSongAuthor } = this.props;
		// 触发action
		setSongTitle(myData[randomNumber].title);
		setSongAvatar(myData[randomNumber].avatar);
		setSongAuthor(myData[randomNumber].author);
		audio.load();
		audio.play()
	}

	toggleLists() {//点击按钮，列表显示与隐藏
		this.setState({
			showLists: !this.state.showLists
		})
	}


	playMusicFromList(url, author, title, avatar) {//在列表任意点击歌曲直接播放
		const audio = document.getElementById("my-audio");
		audio.src = url;
		audio.load();
		audio.play();
		this.setState({
			showLists: !this.state.showLists,
		});
		let { setSongTitle, setSongAvatar, setSongAuthor } = this.props;
		// 触发action
		setSongTitle(title);
		setSongAvatar(avatar);
		setSongAuthor(author);
	}

	render() {
		let { isPlay, allTime, currentTime, showLists,musicList } = this.state;
		let audioTime = Math.floor(currentTime / allTime * 100);
		return <div className="footer-tab-container">
			<audio id="my-audio" autoPlay="autoPlay"
				src={this.props.url}
				onCanPlay={() => this.controlAudio('allTime')}
				onEnded={this.musicEnd}
				onTimeUpdate={(e) => this.controlAudio("getCurrentTime")}>
			</audio>
			<div className="play-time-progress">
				<span className="current-time">{this.formatTime(currentTime)}</span>
				<Progress className="play-progress" onChange={(value) => this.controlAudio('changeCurrentTime', value)}
					percent={audioTime} showInfo={false} />
				<span className="total-time">{this.formatTime(allTime)}</span>
			</div>
			<div className="footer-control">
				<div className="footer-four-btn">
					<Button type="primary" className="play-btn play-last" onClick={this.last}>
						<Icon type="fast-backward" className="play-left-right" />
					</Button>
					<Button type="primary" className="play-btn play-pause"
						onClick={() => this.controlAudio(isPlay === true ? 'pause' : 'play')}>
						<Icon type={isPlay === true ? "pause-circle-o" : "play-circle-o"} className="play-pause" />
					</Button>
					<Button type="primary" className="play-btn play-right" onClick={this.next}>
						<Icon type="fast-forward" className="play-left-right" />
					</Button>
					<Button type="primary" className="play-btn play-recent-list" onClick={this.toggleLists}>
						<Icon type="profile" className="play-left-right" />
					</Button>
				</div>
				<div className={showLists === false ? "music-lists-hide" : "music-lists-show"}>
				<div className="close-list" >
					<span><Icon type="customer-service" />播放列表</span>
					<Icon onClick={this.toggleLists} type="close-circle-o" />
				</div>
					<ul>
						{musicList.map((item, index) => {
							return <li  className="music-my-li" key={index}>
							<span onClick={(e) => this.playMusicFromList(`${item.url}`, `${item.author}`, `${item.title}`, `${item.avatar}`)}>
							{(index + 1) >9 ? index + 1 : "0" + (index + 1)}-{item.author}-{item.title}
							</span><span onClick={(e)=>{this.removeSong(index)}} className="delete-icon"><Icon type="delete" /></span>
							</li>
						})}
					</ul>
				</div>
			</div>
		</div>
	}
}

// mapStateToProps：将state映射到组件的props中
const mapStateToProps = (state) => {
	return {
		songTitle: state.songTitle,
		songAvatar: state.songAvatar,
		songAuthor: state.songAuthor,
		songIsPlaying: state.songIsPlaying
	}
};

// mapDispatchToProps：将dispatch映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setSongTitle(data) {
			dispatch(setSongTitle(data))
		},
		setSongAvatar(data) {
			dispatch(setSongAvatar(data))
		},
		setSongAuthor(data) {
			dispatch(setSongAuthor(data))
		},
		setSongIsPlaying(data) {
			dispatch(setSongIsPlaying(data))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Audio)

