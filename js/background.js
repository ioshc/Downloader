//配置pageAction，只有在铁定页面才显示
chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开七中网课时才高亮
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'https://ulearning.eastedu.com/cdqz/CourseDetails'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});

//设置右键菜单
//api https://developer.chrome.com/extensions/contextMenus
// chrome.contextMenus.create({
// 	type: 'normal', // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
//     title: "查看所有课程链接", // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
//     contexts: ['page'],	// 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
//     onclick: function(){

//     	//发送消息给content-script，通知其开始学习
// 		sendMessageToContentScript({cmd:'showLinks', value:''}, function(response)
// 		{
// 			console.log('来自content的回复：'+ response);
// 		});
//     },
//     // parentId: 1, // 右键菜单项的父菜单项ID。指定父菜单项将会使此菜单项成为父菜单项的子菜单
//     documentUrlPatterns: ['https://ulearning.eastedu.com/cdqz/CourseDetails/*'] // 只在某些页面显示此右键菜单
// });

//监听来至content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	
	if (request.cmd == 'downloadLesson') {
		downloadLesson(request.value);
		sendResponse('downloadLesson');
	}

	if (request.cmd == 'downloadAll') {

		alert('程序会自动帮你下载所有课程，下载完成之前，请不要重复点击');

		request.value.forEach(lesson => {
			downloadLesson(lesson);
		});
		sendResponse('downloadAll');
	}
});

function downloadLesson(lesson) {
	var fileName = lesson.name + '.mp4';
	chrome.downloads.download({url: lesson.courseware, filename: fileName},
		function(id) {
	});
}

function sendMessageToContentScript(message, callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}
