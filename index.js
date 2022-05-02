function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function draw(Xposition, Yposition, color, processNumber)
{
    var width = 10;
    var height = 40;

    switch(processNumber)
    {
        case 0: ctx1.fillStyle = color;
                ctx1.fillRect(Xposition, Yposition, width, height);
                break;

        case 1: ctx2.fillStyle = color;
                ctx2.fillRect(Xposition, Yposition, width, height);
                break;

        case 2: ctx3.fillStyle = color;
                ctx3.fillRect(Xposition, Yposition, width, height);
                break;

        case 3: ctx4.fillStyle = color;
                ctx4.fillRect(Xposition, Yposition, width, height);
                break;

        case 4: ctx5.fillStyle = color;
                ctx5.fillRect(Xposition, Yposition, width, height);
                break;

        default: console.log("error");
                    break;

    }
}

var lastXposition = [1, 1, 1, 1, 1];
var barsCompleted = [0, 0, 0, 0, 0];

async function fillBar(color, unitProgressBar, processNumber)
{
    //console.log(lastXposition);
    for(var i = 0; i <= unitProgressBar; i++)
    {
        draw(lastXposition[processNumber], 1, color, processNumber);
        await sleep(100);
        lastXposition[processNumber] += 12;
        barsCompleted[processNumber]++;
        
    }

}	

var canvasWidth = 484;
var canvasHeight = 42;

var p1 = document.querySelector('#p1');
var ctx1 = p1.getContext('2d');
ctx1.fillRect(0, 0, canvasWidth, canvasHeight);
ctx1.clearRect(0, 0, canvasWidth, canvasHeight);	

var p2 = document.querySelector('#p2');
var ctx2 = p2.getContext('2d');
ctx2.fillRect(0, 0, canvasWidth, canvasHeight);
ctx2.clearRect(0, 0, canvasWidth, canvasHeight);	

var p3 = document.querySelector('#p3');
var ctx3 = p3.getContext('2d');
ctx3.fillRect(0, 0, canvasWidth, canvasHeight);
ctx3.clearRect(0, 0, canvasWidth, canvasHeight);

var p4 = document.querySelector('#p4');
var ctx4 = p4.getContext('2d');
ctx4.fillRect(0, 0, canvasWidth, canvasHeight);
ctx4.clearRect(0, 0, canvasWidth, canvasHeight);	

var p5 = document.querySelector('#p5');
var ctx5 = p5.getContext('2d');
ctx5.fillRect(0, 0, canvasWidth, canvasHeight);
ctx5.clearRect(0, 0, canvasWidth, canvasHeight);		

async function start()
{
    //TODO
}

async function handleDrawningPercent(quantum, burstTime, remainingBurstTime, processNumber)
{		
    if(remainingBurstTime == 0)
    {
        fillBar('blue', 41 - barsCompleted[processNumber], processNumber);
        return;
    }

    var bars = parseInt((41 * quantum) / burstTime);
    fillBar('blue', bars, processNumber);

}

//Round robin algorithm
function findExecutionTime(processes, burstTime, waitingTime, executionTime)
{
    for(var i = 0; i < processes.length; i++)
    {
        executionTime[i] = burstTime[i] + waitingTime[i];
    }
}

function findAverageExecutionTime(processes, executionTime)
{
    var sum = executionTime.reduce((a, b) => a + b, 0);
    var average = sum / processes.length;
    console.log("averageExecutionTime = " + average);
}

function findAverageWaitingTime(processes, waitingTime)
{
    var sum = waitingTime.reduce((a, b) => a + b, 0);
    var average = sum / processes.length;
    console.log("averageWaitingTime = " + average);
}

async function findWaitingTime(processes, burstTime, waitingTime, quantum)
{
    var remainingBurstTime = burstTime.slice();
    var progress = 0;
    var time = 0;

    while(true)
    {
        var isDone = true;

        for(var i = 0; i < processes.length; i++)
        {
            if(remainingBurstTime[i] > 0)
            {
                isDone = false;

                if(remainingBurstTime[i] > quantum)
                {
                    time += quantum;
                    remainingBurstTime[i] -= quantum;
                    //console.log("1process " + i + ": RBT " + remainingBurstTime[i]);
                    handleDrawningPercent(quantum, burstTime[i], remainingBurstTime[i], i);
                    //console.log('p: ' + i);
                }

                else
                {
                    time += remainingBurstTime[i];
                    waitingTime[i] = time - burstTime[i];
                    remainingBurstTime[i] = 0;
                    //console.log("2process " + i + ": RBT " + remainingBurstTime[i]);
                    handleDrawningPercent(quantum, burstTime[i], 0, i);
                    //console.log('p: ' + i);
                }
                
                //console.log(i + ": " + waitingTime[i]);
                await sleep(4500);

            }
        }
        

        if(isDone == true)
            break;
    }

    var executionTime = [0, 0, 0, 0, 0];

    findExecutionTime(processes, burstTime, waitingTime, executionTime);

    findAverageWaitingTime(processes, waitingTime);

    findAverageExecutionTime(processes, executionTime);
}

function handleRandomBurstTime(processes)
{
    burstTime = [];

    for(var i = 0; i < processes.length; i++)
    {
        burstTime.push((parseInt(Math.random() * 10)) + 1);
    }

    return burstTime;
}

function handleInputBurstTime(processes)
{
    var burstTime = [];
    var temp;

    for(var i = 1; i <= processes.length; i++)
    {
        temp = ("#inputP" + i);
        burstTime.push(parseInt(document.querySelector(temp).value));
    }

    return burstTime;
}

function handleAppendOnHtml(elementId, item)
{
    document.getElementById(elementId).append(item);
}

function startRobin()
{
    if(isRandomized)
    {
        burstTime = handleRandomBurstTime(processes);
        quantum = (parseInt(Math.random() * 5)) + 1;
        handleAppendOnHtml('quantumValue', quantum);
    }
    else
    {
        burstTime = handleInputBurstTime(processes);
        quantum = parseInt(document.querySelector("#quantumInput").value);
        handleAppendOnHtml('quantumValue', quantum);
    }

    for(var i = 1; i <= processes.length; i++)
    {
            handleAppendOnHtml('p' + i + 'BurstTime', burstTime[i - 1]);
    }

    findWaitingTime(processes, burstTime, waitingTime, quantum);
}

function randomize()
{
    isRandomized = true;
}

var waitingTime = [0, 0, 0, 0, 0];		
var processes = [1, 2, 3, 4, 5];
var burstTime = [];
var quantum;
var isRandomized = false;
