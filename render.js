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
var tools = {
  container: $('#editorjs'),
  render: function(item){
    if(item.type !== undefined){
      this[item.type](item);
    }
  },
  header: function(item){
    const header = `<div class="ce-block"><div class="ce-block__content"><h${item.data.level} class="ce-header">${item.data.text}</h${item.data.level}></div></div>`;
    var target = $(header);
    this.container.append(target);
  },
  paragraph: function(item){
    const paragraph = `<div class="ce-block"><div class="footnotes-outer"><div class="ce-block__content"><div class="ce-paragraph cdx-block">${item.data.text}</div></div><div class="footnotes-container" ></div></div></div>`;
    var target = $(paragraph);
    this.container.append(target);
    this.tunes(item.tunes, target)
  },
  list: function(item){
    const list = `<div class="ce-block"><div class="footnotes-outer"><div class="ce-block__content"><${item.data.style === 'unordered' ? 'u' : 'o'}l class="cdx-block cdx-list cdx-list--${item.data.style}">${item.data.items ? `${item.data.items.map(li => `<li class="cdx-list__item">${li}</li>`).join('')}` : ''}</<${item.data.style === 'unordered' ? 'u' : 'o'}l></div><div class="footnotes-container"></div></div></div>`;
    var target = $(list);
    this.container.append(target);
    this.tunes(item.tunes, target)
  },
  delimiter: function(item){
    this.container.append('<div class="ce-block"><div class="ce-block__content"><div class="ce-delimiter cdx-block"></div></div></div>');
  },
  image: function(item){
    const image = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-block image-tool ${item.data.withBorder ? 'image-tool--withBorder' : ''} ${item.data.stretched ? 'image-tool--stretched' : ''} ${item.data.withBackground ? 'image-tool--withBackground' : ''} image-tool--filled"><div class="image-tool__image"><div class="image-tool__image-preloader"></div><img class="image-tool__image-picture" src="${item.data.file.url}"></div><div class="cdx-input image-tool__caption">${item.data.caption}</div></div></div></div>`;
    var target = $(image);
    this.container.append(target);
  },
	
  tunes: function(item, con){
    if(item !== undefined && item.footnotes !== undefined && item.footnotes.length > 0){
      $(con).on('click', 'sup[data-tune=footnotes]', function(){
        var i = parseInt($(this).text());
      	if(i > item.footnotes.length){
      	  return false;
      	}
      	console.log('Show FOOTNOTES', item.footnotes[i-1]);
      });
    }
  }
};
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
            <li class="ce-link"><a class="link"><div>${link.title}</div></a></li>
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
  $.each(data, function(i, item){
    tools.render(item);
  })
}
