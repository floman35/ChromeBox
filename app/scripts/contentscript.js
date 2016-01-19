'use strict';
console.log('\'Allo \'Allo! Content script');

function getData(){
		var d = $.Deferred(),
			data={
				'page':{},
				'titles':[]
				};

		// Explore page title
			$('h1, h2, h3, h4, p').each(function(i, el){
				var title={};
				if(el.innerText.lenght!==0){
					title.text=el.innerText;
					title.style=el.nodeName;
					data.titles.push(title);
				}
			});

			console.dir(data.titles);
 			data.page.title=document.title;
			data.page.URL=document.URL;
			var logos = $('head link[rel*="icon"][href*=".png"]');

			if(logos.lenght!==0 && logos[0]){
				data.page.logo=logos[0].href;
			}
			else{
				logos = $('head link[rel*="icon"][href*=".ico"]');
				if(logos.lenght!==0 && logos){
					data.page.logo=logos[0].href;
				}
			}
			console.dir(data);

		d.resolve(data);
	  return d;
	}

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === 'getData') {
		console.log('About to inspect the page');
      getData().done(function(data){
        	sendResponse(data);
    	});
    }
  });
