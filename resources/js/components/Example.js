import React,{Fragment,useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function Example(){
    const [year,setYear] = useState(new Date().getFullYear())
    const [month,setMonth] = useState(new Date().getMonth()+1)
    const last = new Date(year,month,0).getDate()
    const prevlast = new Date(year,month-1,0).getDate()
    const calendar = createCalendear(year,month)

    const onClick = n => () => {
        const nextMonth = month + n
        if (12 < nextMonth) {
          setMonth(1)
          setYear(year + 1)
        } else if (nextMonth < 1) {
          setMonth(12)
          setYear(year - 1)
        } else {
          setMonth(nextMonth)
        }
    }

    //スケジュールのデータ
    const [schedules,setSche] = useState([])

    //画面読み込み時に、1度だけ起動
    useEffect(()=>{
        getPostData();
    },[])

    //バックエンドからデータ一覧を取得
    const getPostData = () =>{
        axios
        .post('/api/posts')
        .then(response=>{
            setSche(response.data); //バックエンドからのデータをセット
            console.log(response.data);
        }).catch(()=>{
            console.log('通信に失敗しました');
        });
    }

    //データ格納の空配列を作成
    let rows = [];

    //スケジュールデータをrowに格納する
    schedules.map((post)=>
        rows.push({
            sch_id:post.id,
            sch_part:post.sch_part,
            sch_date:post.sch_date
        })
    );

    //登録用ポップアップ開閉処理
    const[open,setOpen] = useState(false);

    const handleClickOpen = (e) =>{
        setOpen(true);
    };

    const handleClose = () =>{
        setOpen(false);
    };

    //新規登録用データ配列
    const [formData,setFormData] = useState({sch_part:'',sch_date:''});

    //入力値を一時保存
    const inputChange = (e) =>{
        const key = e.target.name;
        const value = e.target.value;
        formData[key] = value;
        let datas = Object.assign({},formData);
        setFormData(datas);
        console.log(formData);
    }
    //登録処理
    const createSchedule = async() => {
        //入力値を投げる
        await axios
            .post('/api/posts/create',{
                sch_part:formData.sch_part,
                sch_date:formData.sch_date
            })
            .then((res)=>{
                //戻り値をtodosにセット
                const tempPosts = post;
                tempPosts.push(res.data);
                setPosts(tempPosts)
                setFormData('');
            })
            .catch(error=>{
                console.log(error);
            })
    }

    return (
        <Fragment>
            <div className="calender-header">
                <h1>{`${year}年${month}月`}</h1>
                <div className="calender-nav">
                    <button onClick={onClick(-1)}>{'<先月'}</button>
                    <button onClick={onClick(1)}>{'翌月>'}</button>
                </div>
            </div>
            <table className="calender-table">
                <thead>
                    <tr>
                        <th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th>
                    </tr>
                </thead>
                <tbody>
                    {calendar.map((week,i) => (
                        <tr key={week.join('')}>
                            {week.map((day,j) => (
                                <td key={`${i}${j}`} id={day} onClick={handleClickOpen}>
                                    <div>
                                        <div>
                                            {day > last ? day - last : day <= 0 ? prevlast + day : day}
                                        </div>
                                        <div className="schedule-area">
                                            {rows.map((schedule,k) => (
                                                schedule.sch_date == year + '-' + zeroPadding(month) + '-' + zeroPadding(day) &&
                                                    <div className='schedule-title' key={k}>{schedule.sch_part}</div>
                                                
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        スケジュール登録
                    </DialogContentText>
                    <TextField margin="dense" id="sch_date" name="sch_date" label="予定日" type="text" fullWidth variant="standard" onChange={inputChange}/>
                    <InputLabel id="sch_part_label">部位</InputLabel>
                    <Select labelId="sch_part" id="sch_part_select" name="sch_part" label="Part" variant="standard" defaultValue="脚" onChange={inputChange}>
                        <MenuItem value="脚">脚</MenuItem>
                        <MenuItem value="背中">背中</MenuItem>
                        <MenuItem value="腕">腕</MenuItem>
                        <MenuItem value="胸">胸</MenuItem>
                        <MenuItem value="肩">肩</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button href="/dashboard" onClick={createSchedule}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

function createCalendear(year,month){
    const first = new Date(year,month - 1,1).getDay()

    return [0,1,2,3,4,5].map((weekIndex) => {
        return [0,1,2,3,4,5,6].map((dayIndex) => {
            const day = dayIndex + 1 + weekIndex * 7
            return day - first 
        })
    })
}

function zeroPadding(num){
    return ('0' + num).slice(-2);
}

export default Example;

if (document.getElementById('app')) {
    ReactDOM.render(<Example />, document.getElementById('app'));
}