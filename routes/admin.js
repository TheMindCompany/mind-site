var Blog = require('./../lib/blog.js')
  , Tuts = require('./../lib/tuts.js')
  , Labs = require('./../lib/labs.js')
  , Navi = require('./../lib/nav.js')
  , fs = require('fs');

var Path = __dirname + '/..';

function nameMerge (title) {
  var merged = title.split(' ').join('_');
  return merged;
}

function imgExtention (type) {
  var extention;
  if (type == 'image/jpeg') {
    extention='jpg';
  } else if (type == 'image/png') {
    extention='png';
  } else if (type == 'image/gif') {
    extention='gif';
  } else {
    // default image
    extention = 'png';
  }
  return extention;
}

function writeImage (image, title, type) {
  var imageName = nameMerge(title) + '.' + imgExtention(image.type);
  var img = Path + '/public/' + type + '/images/' + imageName;
  fs.readFile(image.path, function (err, data) {
    fs.writeFile(img, data, function (err) {
      if (err) {
        console.log('Image error: ' + err);  
      } else {
        console.log('Write image:' + img);
      }
    });
  });
  return imageName;
}

exports.index = function(req, res){
  Navi.navList('admin_panel', function(err, navItem){
    if (err){
      console.log(err);
    } else {
      res.render('admin', { title: 'The Mind Company | Administration Panel',  navi: navItem });
    }
  });
};

exports.blog_post = function(req, res){  
  var imageName;
  var blog_add_html = nameMerge(req.body.blog_add_title) + ".html";
  if (req.files.blog_add_image.name) { 
    imageName = writeImage(req.files.blog_add_image, req.body.blog_add_title, 'blog');
  }  
  // console.log(req.session.user._id);
  Blog.add(blog_add_html,req.body.blog_add_title,req.session.user,req.body.blog_add_date, 
           req.body.blog_add_article, imageName, function(err, entry) {
    if(err) {
      console.log('Blog Entry Failed: ' + err);
    } else if (entry) {
      console.log('Blog Entry Made' + entry);
    }
    res.redirect('admin-panel#blog');
  });
};

exports.tuts_post = function(req, res){     
  var imageName;
  var tuts_add_html = nameMerge(req.body.tuts_add_title) + ".html";
  if (req.files.tuts_add_image.name) {
    imageName = writeImage(req.files.tuts_add_image, req.body.tuts_add_title, 'tutorials');
  }
  
  Tuts.add(tuts_add_html, req.body.tuts_add_title,req.session.user,req.body.tuts_add_date, 
           req.body.tuts_add_article, imageName, function(err, entry) {
    if(err) {
      console.log('Tutorial Entry Failed: ' + err);
    } else if (entry) {
      console.log('Tutorial Entry Made' + entry);
    }
    res.redirect('admin-panel#tuts');
  });
};

exports.labs_post = function(req, res){
  var imageName;
  var labs_add_html = nameMerge(req.body.labs_add_title) + ".html";     
  if (req.files.labs_add_image.name) {
    imageName = writeImage(req.files.labs_add_image, req.body.labs_add_title, 'laboratory');
  }
  
  Labs.add(labs_add_html, req.body.labs_add_title,req.session.user,req.body.labs_add_date, 
           req.body.labs_add_article, imageName, function(err, entry) {
    if(err) {
      console.log('Labratory Entry Failed: ' + err);
    } else if (entry) {
      console.log('Labratory Entry Made' + entry);
    }
    res.redirect('admin-panel#labs');
  });
};
