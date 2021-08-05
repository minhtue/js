//Document Link will be: /docs/v1.1/get-started
jQuery.expr[':'].etext = function(a, i, m) {
  return jQuery(a).text() === m[3];
};
jQuery.expr[':'].itext = function(a, i, m) {
  return jQuery(a).text().toLowerCase() === m[3].toLowerCase();
};
jQuery.extend({
  getValues: function(url) {
    var result = null;
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      async: false,
      success: function(data) {
        result = data;
      }
    });
   return result;
  }
});
$(document).ready(function(){
  //load data
  var settings = $.getValues('/settings.json');
  var version = location.pathname.replace(/.*\/(v[0-9\.]+).*/ig, '$1');
  var menu = $.getValues('/docs/' + version + '/menu.json');
  //check slug and redirect
  var slug = location.pathname.replace(/.*\/v[0-9\.]+\/([^\/\#\?\&]+).*/ig, '$1');
  if (slug.indexOf('/') !== -1){
    slug = getSlug(menu);
    if(slug !== ''){
      location.href = '/docs/' + version + '/' + slug;
    } else {
      //redirect to not found
      location.href = '/404';
    }
  }
  var content = $.getValues('/docs/' + version + '/' + slug + '.json');
  header(settings);
  menu(menu);
  content(content);
});

function getSlug(data){
  if(data === undefined || data === ''){
    return '';
  }
  var result = '';
  $.each(data, function(k,v){
    if(result !== ''){
      return false;
    }
    if(v.items !== undefined){
      $.each(v.items, function(i, item){
        if(item.slug !== undefined && item.slug !== ''){
          result = item.slug;
          return false;
        }
      })
    }
  })
  return result;
}

function menu(data){
	if(data === undefined || data === ''){
		return;
	}
	const markup = `
		${data.map(item => `
			<li class="ce-cat">
			<div><strong>${item.title}</strong></div>
			<ul id="${item.refId}">
				${item.items ? `${item.items.map(link => `
					<li class="ce-link">
						<a class="link"><div>${link.title}</div></a>
					</li>
				`).join('')}` : ''}
			</ul>
			</li>
		`).join('')}
	`;
	$('#links').append(markup);
}
function header(data){
  //render main menu
  //change css variable
}
function content(data){
  //render content
}
