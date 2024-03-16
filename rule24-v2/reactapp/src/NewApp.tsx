import { useEffect, useState, useRef } from "react";

let playBtnsd = "M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16z";
let pauseBtnsd = "M176 96h16v320h-16zM320 96h16v320h-16z";

let intervalIdim: any;
let radius = 120

function Countdown() {

    let [music, setMusic] = useState("/nice_ring_tones.mp3")
    
    let storedMusic = localStorage.getItem("mymusic");

    let audioimRef: any;
    let audioim: any;

    const [isPlayPauseHovered, setPlayPauseHovered] = useState(false);
    const [isRefreshTimeHovered, setRefreshTimeHovered] = useState(false);
    
    const [isplaying, setIsplaying] = useState(false);
    const [playpausechangeIcon, setPlaypausechangeIcon] = useState(playBtnsd);

    const [timemin, setTimemin] = useState( Number(localStorage.getItem("minute")) || 20 );
    const [timeminRelax, setTimeminRelax] = useState( Number(localStorage.getItem("minuterelax")) || 4 );

    const [allSec, setAllSec] = useState(timemin*60);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [mode, setMode] = useState("work")

    if (storedMusic) {
        audioimRef = useRef(new Audio(storedMusic));
        audioim = audioimRef.current;  
    } else {
        audioimRef = useRef(new Audio(music));
        audioim = audioimRef.current;  
    }

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      // Cleanup function to prevent memory leaks
      return () => clearInterval(intervalId);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      let a;
      useEffect(() => {
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            a = 7
          } else {
            a =4
          }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }, []);

    function playMusic() {
        audioim.play()        
        StopInterval();
        setIsplaying(false);
        setPlaypausechangeIcon(playBtnsd);
        return 0;
    }

    function removeMusic(){
        setMode("relax");
        console.log(mode);
        
        audioim.pause()
        audioim.currentTime = 0;
        setAllSec(timeminRelax*60);
        audioimRef.current = new Audio("/success.mp3");
        audioim = audioimRef.current;
    }

    function changeMusic(musicim: any) {
        setMusic(musicim);
        audioim.pause();
        audioim.currentTime = 0;
        localStorage.setItem("mymusic", musicim);
        audioimRef.current = new Audio(musicim);
        audioim = audioimRef.current;
        audioim.play();
    }
    
    function StopInterval() {
        clearInterval(intervalIdim);
        intervalIdim = null
    }

    function StartInterval() {
        setAllSec(current => current > 0 ? current = current - 1 : playMusic())
    }

    function playpauseFunc() {

            if ( isplaying ) {
                StopInterval()
                setIsplaying(false);
                setPlaypausechangeIcon(playBtnsd);
            } else {
                setIsplaying(true);
                setPlaypausechangeIcon(pauseBtnsd);
                intervalIdim = setInterval( () => StartInterval(), 1000 )
            }

    }

    function RefreshTimer() {
        setMode("work");
        StopInterval();
        setAllSec(timemin*60)
        setIsplaying(false);
        setPlaypausechangeIcon(playBtnsd);
        console.log("refreshed");
        audioim.pause()
        audioim.currentTime = 0;
        audioimRef.current = new Audio(String(localStorage.getItem("mymusic")));
        audioim = audioimRef.current;
    }

    function saveButton(){
        setMode("work")
        setTimemin( Number(localStorage.getItem("minute")) || 20 );
        setTimeminRelax( Number(localStorage.getItem("minuterelax")) || 0 );
        setAllSec(timemin*60)
        audioim.pause()
        audioim.currentTime = 0;
    }

    // window.addEventListener('beforeunload', function (e) { 
    //     e.preventDefault(); 
    //     e.returnValue = 'Are you sure ?'; 
    // });

    document.title = `${Math.floor(allSec/60)} : ${allSec - Math.floor(allSec/60)*60}`

    return(
        <> 
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Configurations</h1>
                        </div>
                        <div className="modal-body">
                            <div className="inpCont">
                                <label className="workTitle">Working time (in minutes)</label>
                                <div id="inputBox">
                                    <input onChange={(e) => {setTimemin(Number(e.target.value)); localStorage.setItem("minute", (e.target.value)) }} className="form-control workingMinutes" defaultValue={timemin} type="number" min={1} placeholder="Search" aria-label="Search" />
                                </div>
                            </div>
                            <div className="inpCont">
                                <label className="workTitle">Relaxing time (in minutes)</label>
                                <div id="inputBox">
                                    <input onChange={(e) => { setTimeminRelax(Number(e.target.value)); localStorage.setItem("minuterelax", (e.target.value)) }} className="form-control workingMinutes" defaultValue={timeminRelax} type="number" min={1} placeholder="Search" aria-label="Search" />
                                </div>
                            </div>
                            <div className="inpCont">
                                <div>

                                    <p>Choose an audio</p>
                                    <input type="radio" defaultChecked= { localStorage.getItem("mymusic") == "/alarm_clock.mp3" ? true : false } id="colorRed" name="color" value="red" />
                                    <label onClick={()=> changeMusic("/alarm_clock.mp3")} htmlFor="colorRed">Alarm clock</label>
                                    
                                    <br/>

                                    <input type="radio" defaultChecked= { localStorage.getItem("mymusic") == "/frozen.mp3" ? true : false } id="colorGreen" name="color" value="green" />
                                    <label onClick={()=> changeMusic("/frozen.mp3")} htmlFor="colorGreen">Frozen</label>
                                    
                                    <br/>
                                    <input type="radio" defaultChecked= { localStorage.getItem("mymusic") == "/nice_ring_tones.mp3" ? true : false } id="colorBlue" name="color" value="blue" />
                                    <label onClick={()=> changeMusic("/nice_ring_tones.mp3")} htmlFor="colorBlue">Nice ring tone</label>
                                    
                                    <br />
                                    <input type="radio" defaultChecked= { localStorage.getItem("mymusic") == "/nokia.mp3" ? true : false } id="colorLa" name="color" value="blue" />
                                    <label onClick={()=> changeMusic("/nokia.mp3")} htmlFor="colorLa">Nokia</label>

                                    <br />
                                    <input type="radio" defaultChecked= { localStorage.getItem("mymusic") == "/ringtone1.mp3" ? true : false } id="colorBa" name="color" value="blue" />
                                    <label onClick={()=> changeMusic("/ringtone1.mp3")} htmlFor="colorBa">Ringtone 1</label>

                                    <br />
                                    <input type="radio" defaultChecked= { localStorage.getItem("mymusic") == "/ringtone2.mp3" ? true : false } id="colorTa" name="color" value="blue" />
                                    <label onClick={()=> changeMusic("/ringtone2.mp3")} htmlFor="colorTa">Ringtone 2</label>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={saveButton} type="button" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="top">
                <p id="clock"><span>{formattedTime}</span></p>
                
            </div>

            <div id="centerpart">
                <div id="timeContainer">
                <div id="timeBox">
                        <p id="time">{ (Math.floor(allSec/60)) < 10 ? `0${(Math.floor(allSec/60))}` : (Math.floor(allSec/60)) } : { (allSec - Math.floor(allSec/60)*60) < 10 ? `0${(allSec - Math.floor(allSec/60)*60)}` : (allSec - Math.floor(allSec/60)*60)}</p>
                        <div id="timecontrolbox">
                            <div onClick={playpauseFunc} onMouseEnter={() => setPlayPauseHovered(true)} onMouseLeave={() => setPlayPauseHovered(false)}>
                                <svg id="playpause" xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><path fill="none" stroke={isPlayPauseHovered ? "white" : "grey"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d={playpausechangeIcon}/> </svg>
                            </div>
                            <div onClick={RefreshTimer} onMouseEnter={() => setRefreshTimeHovered(true)} onMouseLeave={() => setRefreshTimeHovered(false)}>
                                <svg id="refreshtime" xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><path d="M320 146s24.36-12-64-12a160 160 0 10160 160" fill="none" stroke={isRefreshTimeHovered ? "white" : "grey"} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"/><path fill="none" stroke={isRefreshTimeHovered ? "white" : "grey"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 58l80 80-80 80"/></svg>
                            </div>
                        </div>
                    </div>
                    <svg id="circleContainer">
                        <circle
                            id="circle1"
                            cy={155}
                            cx={155}
                            r={radius}
                            //strokeDashoffset = { (2 * Math.PI * radius) - 10 + "px"}
                        ></circle>
                        <circle
                            id="circle"
                            cy={155}
                            cx={155}
                            r={radius}
                            strokeDasharray={2 * Math.PI * radius}
                            strokeDashoffset={ mode == "work" ? ( 2 * Math.PI * radius ) - ( 2 * Math.PI * radius ) / 100 * ( allSec*100/( Number(localStorage.getItem("minute"))*60 ) ) :
                             ( 2 * Math.PI * radius ) - ( 2 * Math.PI * radius ) / 100 * ( allSec*100/( Number(localStorage.getItem("minuterelax"))*60 ) ) }
                        ></circle>
                    </svg>
                    <div style={{display: "block", justifyContent: "center", position: "absolute", left: "10%"}}>
                        <span style={{display: "block"}}>
                            { allSec > 0 && !isplaying ? <button type="button" id="configuration" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Configuration</button> :
                                <button style={{visibility: "hidden"}} type="button" id="configuration" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Configuration</button>
                            }
                            {allSec <= 0 ? <button onClick={removeMusic} type="button" className="btn btn-primary">Stop sound</button> :
                                <button style={{display: "none"}} onClick={removeMusic} type="button" className="btn btn-primary">Stop sound</button>
                            }
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Countdown;