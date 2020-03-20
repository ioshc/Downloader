
var lessonList;

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
	setTimeout(featchCourseDetail, 5000);
});

function featchCourseDetail() {

	var courseId = document.location.pathname.split('/').pop();
	var url = document.location.origin + '/api/web/' + courseId + '/lessons/vod?page=0&size=10000&schoolId=1098';

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "get" , url , true );
    xmlHttp.setRequestHeader( "Content-Type" , "application/json;charset=utf-8" );
    xmlHttp.onreadystatechange = function () {
        if( xmlHttp.readyState == 4 ) {
            if( xmlHttp.status == 200 ) {
				var response = JSON.parse(xmlHttp.responseText);
				lessonList = response._embedded.vodLessons;
            }
        }
 
    }
    xmlHttp.send( null );
}

function injectDownloadButton() {

	var lessons = $("div.list-main").children();
	for (var i = 0 ; i < lessons.length ; i++) {

		var div = lessons[i];

		var button = document.createElement('input');
		button.setAttribute("type", "button");
		button.setAttribute("value", "下载");
		button.title = i
		button.onclick = downloadSingleLesson;
		div.appendChild(button);
	}
}

function downloadSingleLesson(e) {

	if (!checkLessonList()) { return; }

	var index = e.toElement.title;
	var lesson = lessonList[index];
	var fileName = '课时' + index + ' ' + lesson.name + '.mp4';

	console.log('下载课程：' + e.toElement.title);

	chrome.runtime.sendMessage({cmd: 'downloadLesson', value: lesson}, function(response) {
		console.log('收到来自后台的回复：' + response);
	});
}

function downloadAll() {

	if (!checkLessonList()) { return; }

	console.log('下载所有课程');
	chrome.runtime.sendMessage({cmd: 'downloadAll', value: lessonList}, function(response) {
		console.log('收到来自后台的回复：' + response);
	});
}

function checkLessonList() {
	if (lessonList == undefined) {
		featchCourseDetail();
		alert('未能获取到课程链接，已自动重新获取，请5秒后重试');
		return false;
	}
	
	return true;
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.cmd == 'showDownload') {
		injectDownloadButton();
		console.log('成功注入下载按钮');
		sendResponse('showDownload');
		return;
	}

	if(request.cmd == 'downloadAll') {
		downloadAll()
		sendResponse('downloadAll');
		return;
	}

	sendResponse('不要发骚扰信息');
});
