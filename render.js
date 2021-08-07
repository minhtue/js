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
  attaches: function(item){
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var bytes = item.data.file.size;
    if (bytes === 0){
      item.data.num = 0;
      item.data.label = 'byte';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    item.data.num = Math.round(bytes / Math.pow(1024, i), 2);
    item.data.label = sizes[i];
    var attaches = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-block"><div class="cdx-attaches cdx-attaches--with-file"><div class="cdx-attaches__file-icon" data-extension="${item.data.file.extension}" style="color: rgb(246, 118, 118);"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="40"><path d="M17 0l15 14V3v34a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h20-6zm0 2H3a1 1 0 0 0-1 1v34a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V14H17V2zm2 10h7.926L19 4.602V12z"></path></svg></div><div class="cdx-attaches__file-info"><div class="cdx-attaches__title">${item.data.title}</div><div class="cdx-attaches__size" data-size="${item.data.label}">${item.data.num}</div></div><a class="cdx-attaches__download-button" href="${item.data.file.url}" target="_blank" download="${item.data.title}" rel="nofollow noindex noreferrer"><i class="fas fa-download"></i></a></div></div></div></div>`;
    var target = $(attaches);
    this.container.append(target);
  },
  embed: function(item){
    const embed = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-block embed-tool"><preloader class="embed-tool__preloader"><div class="embed-tool__url">${item.data.source}</div></preloader><iframe style="width:100%;" height="${item.data.height > 400 ? `${item.data.height}`: '450'}" frameborder="0" allowfullscreen src="${item.data.embed}" class="embed-tool__content"></iframe><div class="cdx-input embed-tool__caption" contenteditable="false" data-placeholder="Enter a caption">${item.data.caption}</div></div></div></div>`;
    var target = $(embed);
    this.container.append(target);
  },
  personality: function(item){
    const personality = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-personality"><div class="cdx-personality__photo" style="background: url(&quot;${item.data.photo}&quot;) center center / cover no-repeat;"></div><div class="cdx-personality__name" contenteditable="false">${item.data.name}</div><div class="cdx-personality__description" contenteditable="false">${item.data.description}</div><div class="cdx-personality__link" contenteditable="false"><a href="${item.data.link}" target="_blank">${item.data.link}</a></div></div></div></div>`;
    var target = $(personality);
    this.container.append(target);
  },
  quote: function(item){
    const quote = `<div class="ce-block"><div class="ce-block__content"><blockquote class="cdx-block cdx-quote"><div class="cdx-input cdx-quote__text" data-placeholder="Enter a quote">${item.data.text}</div><div class="cdx-input cdx-quote__caption" contenteditable="true" data-placeholder="Quote's author">${item.data.caption}</div></blockquote></div></div>`;
    var target = $(quote);
    this.container.append(target);
  },
  checklist: function(item){
    const checklist = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-block cdx-checklist">${item.data.items.map(li => `<div class="cdx-checklist__item${li.checked ? ' cdx-checklist__item--checked':''}"><span class="cdx-checklist__item-checkbox"></span><div class="cdx-checklist__item-text">${li.text}</div></div>`).join('')}</div></div></div>`;
    var target = $(checklist);
    this.container.append(target);
  },
  code: function(item){
    const code = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-block ce-code"><textarea class="ce-code__textarea cdx-input" placeholder="Enter a code" disabled>${item.data.code}</textarea></div></div></div>`;
    var target = $(code);
    this.container.append(target);
  },
  alert: function(item){
    const html = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-alert cdx-alert-${item.data.type}"><div class="cdx-alert__message">${item.data.text}</div></div></div></div>`;
    var target = $(html);
    this.container.append(target);
  },
  table: function(item){
    const html = `<div class="ce-block"><div class="ce-block__content"><div class="cdx-block"><div class="tc-wrap tc-wrap--readonly"><div class="tc-table ${item.data.withHeadings ? 'tc-table--heading':''}">${item.data.content.map(row => `<div class="tc-row">${row.map(cell => `<div class="tc-cell">${cell}</div>`).join('')}</div>`).join('')}</div></div></div></div></div>`;
    var target = $(html);
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
  },
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
