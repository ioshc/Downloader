var showDownloadButton = document.getElementById("showDownloadButton");
var downloadAllButton = document.getElementById("downloadAllButton");

showDownloadButton.onclick = function() { 
	//发送消息给content-script，通知其显示下载按钮
	sendMessageToContentScript({cmd:'showDownload', value:''}, function(response) {
		console.log('来自content的回复：'+ response);
	});
}

downloadAllButton.onclick = function() { 

	//发送消息给content-script，通知其开始学习
	sendMessageToContentScript({cmd:'downloadAll', value:''}, function(response) {
		console.log('来自content的回复：'+ response);
	});
}

function sendMessageToContentScript(message, callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}