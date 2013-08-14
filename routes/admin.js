var Blog = require('./../lib/blog.js')
  , Tuts = require('./../lib/tuts.js')
  , Labs = require('./../lib/labs.js')
  , fs = require('fs');

var Path = __dirname + '/..';

exports.index = function(req, res){
  res.render('admin', { title: 'The Mind Company | Administration Panel' });
};

exports.blog_post = function(req, res){   
  var blog_img = Path + '/public/blog/images/' + req.files.blog_add_image.name;
  fs.readFile(req.files.blog_add_image.path, function (err, data) {
    fs.writeFile(blog_img, data, function (err) {
      console.log('image error: ' + err);    
    });
  });

  Blog.add(req.body.blog_add_title,req.session.user.user,req.body.blog_add_date, 
           req.body.blog_add_article, function(err, entry) {
    if(err) {
      console.log('Blog Entry Failed: ' + err);
    } else if (entry) {
      console.log('Blog Entry Made' + entry);
    }
    res.redirect('admin-panel');
  });
};

exports.tuts_post = function(req, res){     
  var tuts_img = Path + '/public/tuts/images/' + req.files.tuts_add_image.name;
  fs.readFile(req.files.tuts_add_image.path, function (err, data) {
    fs.writeFile(tuts_img, data, function (err) {
      console.log('image error: ' + err);    
    });
  }); 
  
  Tuts.add(req.body.tuts_add_title,req.session.user.user,req.body.tuts_add_date, 
           req.body.tuts_add_article, function(err, entry) {
    if(err) {
      console.log('Tutorial Entry Failed: ' + err);
    } else if (entry) {
      console.log('Tutorial Entry Made' + entry);
    }
    res.redirect('admin-panel');
  });
};

exports.labs_post = function(req, res){     
  var labs_img = Path + '/public/labs/images/' + req.files.labs_add_image.name;
  fs.readFile(req.files.labs_add_image.path, function (err, data) {
    fs.writeFile(labs_img, data, function (err) {
      console.log('image error: ' + err);    
    });
  }); 
  
  Labs.add(req.body.labs_add_title,req.session.user.user,req.body.labs_add_date, 
           req.body.labs_add_article, function(err, entry) {
    if(err) {
      console.log('Labratory Entry Failed: ' + err);
    } else if (entry) {
      console.log('Labratory Entry Made' + entry);
    }
    res.redirect('admin-panel');
  });
};
